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

  const { documentId } = await req.json();
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Missing documentId' }), { status: 400, headers: corsHeaders });
  }

  const { data: document } = await supabase
    .from('documents')
    .select('id, owner_id')
    .eq('id', documentId)
    .maybeSingle();
  if (!document || document.owner_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Document not found' }), { status: 404, headers: corsHeaders });
  }

  await supabase.from('documents').update({ status: 'processing' }).eq('id', documentId);
  await supabase.from('documents').update({ status: 'ready' }).eq('id', documentId);

  return new Response(JSON.stringify({ status: 'ready' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
