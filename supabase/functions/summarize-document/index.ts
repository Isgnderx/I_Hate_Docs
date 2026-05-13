import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

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
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const { documentId, style = 'executive' } = await req.json();
  const { data: document } = await supabase
    .from('documents')
    .select('id, owner_id')
    .eq('id', documentId)
    .maybeSingle();
  if (!document || document.owner_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Document not found' }), { status: 404, headers: corsHeaders });
  }

  const { data: chunks } = await supabase
    .from('document_chunks')
    .select('content')
    .eq('document_id', documentId)
    .limit(40);
  const context = (chunks ?? []).map((chunk) => chunk.content).join('\n\n');

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const baseUrl = Deno.env.get('AI_PROVIDER_BASE_URL') ?? 'https://api.openai.com/v1';
  const model = Deno.env.get('AI_MODEL') ?? 'gpt-4o-mini';
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI provider key not configured' }), { status: 500, headers: corsHeaders });
  }

  const prompt = `Summarize the document in ${style} style. Use the context below:\n\n${context}`;
  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a concise summarization engine.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!aiResponse.ok) {
    return new Response(JSON.stringify({ error: 'AI provider error' }), { status: 502, headers: corsHeaders });
  }

  const aiJson = await aiResponse.json();
  const answer = aiJson.choices?.[0]?.message?.content ?? 'No summary returned.';

  await supabase.from('documents').update({ summary: answer }).eq('id', documentId);
  await supabase.from('ai_messages').insert([
    { document_id: documentId, user_id: user.id, role: 'user', mode: 'summarize', content: prompt },
    { document_id: documentId, user_id: user.id, role: 'assistant', mode: 'summarize', content: answer }
  ]);

  return new Response(JSON.stringify({ answer, citations: [] }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
