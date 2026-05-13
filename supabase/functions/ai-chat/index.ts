import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const systemPrompt =
  'You are I Hate Docs AI, a document copilot. Answer only using the provided document context when the user asks about the document. If the answer is not in the document, say so clearly. Use concise, useful language. Include citations using page numbers when context is available. Never invent citations.';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const payload = await req.json();
  const { documentId, message, selectedText, mode = 'chat' } = payload ?? {};
  if (!documentId || !message) {
    return new Response(JSON.stringify({ error: 'Missing documentId or message' }), { status: 400, headers: corsHeaders });
  }

  const { data: document } = await supabase
    .from('documents')
    .select('id, owner_id, text_extracted')
    .eq('id', documentId)
    .maybeSingle();

  if (!document || document.owner_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Document not found' }), { status: 404, headers: corsHeaders });
  }

  const { data: profile } = await supabase.from('profiles').select('ai_daily_limit').eq('id', user.id).maybeSingle();
  const limit = profile?.ai_daily_limit ?? 10;
  const start = new Date();
  const utcStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const { count } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('event_type', 'ai_chat')
    .gte('created_at', utcStart.toISOString());
  if ((count ?? 0) >= limit) {
    return new Response(JSON.stringify({ error: 'AI daily limit reached' }), { status: 429, headers: corsHeaders });
  }

  const { data: chunks } = await supabase
    .from('document_chunks')
    .select('id, page_number, content')
    .eq('document_id', documentId)
    .eq('owner_id', user.id)
    .limit(200);

  if (!chunks || chunks.length === 0) {
    const answer = 'This document has no extracted text yet. OCR/text extraction is required.';
    await supabase.from('ai_messages').insert([
      { document_id: documentId, user_id: user.id, role: 'user', mode, content: message },
      { document_id: documentId, user_id: user.id, role: 'assistant', mode, content: answer }
    ]);
    await supabase.from('usage_events').insert({
      user_id: user.id,
      document_id: documentId,
      event_type: 'ai_chat',
      metadata: { mode }
    });
    return new Response(JSON.stringify({ answer, citations: [] }), { status: 200, headers: corsHeaders });
  }

  const query = (selectedText ?? message).toLowerCase().split(/\W+/).filter(Boolean);
  const scored = chunks
    .map((chunk) => {
      const hay = chunk.content.toLowerCase();
      const score = query.reduce((acc, term) => (hay.includes(term) ? acc + 1 : acc), 0);
      return { ...chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const context = scored.map((chunk) => `Page ${chunk.page_number}: ${chunk.content}`).join('\n\n');
  const prompt = selectedText
    ? `Selected text: ${selectedText}\n\nUser: ${message}\n\nContext:\n${context}`
    : `User: ${message}\n\nContext:\n${context}`;

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const baseUrl = Deno.env.get('AI_PROVIDER_BASE_URL') ?? 'https://api.openai.com/v1';
  const model = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI provider key not configured' }), { status: 500, headers: corsHeaders });
  }

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!aiResponse.ok) {
    return new Response(JSON.stringify({ error: 'AI provider error' }), { status: 502, headers: corsHeaders });
  }

  const aiJson = await aiResponse.json();
  const answer = aiJson.choices?.[0]?.message?.content ?? 'No answer returned.';

  const citations = scored.map((chunk) => ({
    page: chunk.page_number ?? 0,
    quote: chunk.content.slice(0, 180),
    chunkId: chunk.id
  }));

  await supabase.from('ai_messages').insert([
    { document_id: documentId, user_id: user.id, role: 'user', mode, content: message },
    { document_id: documentId, user_id: user.id, role: 'assistant', mode, content: answer, citations }
  ]);

  await supabase.from('usage_events').insert({
    user_id: user.id,
    document_id: documentId,
    event_type: 'ai_chat',
    metadata: { mode }
  });

  return new Response(
    JSON.stringify({
      answer,
      citations,
      usage: {
        inputTokens: aiJson.usage?.prompt_tokens,
        outputTokens: aiJson.usage?.completion_tokens
      }
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
