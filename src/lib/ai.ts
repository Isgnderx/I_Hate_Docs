import { supabase } from './supabase';

export type AiChatMode =
  | 'chat'
  | 'summarize'
  | 'explain'
  | 'rewrite'
  | 'translate'
  | 'extract'
  | 'risks'
  | 'email';

export type AiChatResponse = {
  answer: string;
  citations: Array<{ page: number; quote: string; chunkId: string }>;
  usage?: { inputTokens?: number; outputTokens?: number };
};

export async function invokeAiChat(payload: {
  documentId: string;
  message: string;
  selectedText?: string;
  mode?: AiChatMode;
}) {
  const { data, error } = await supabase.functions.invoke<AiChatResponse>('ai-chat', {
    body: payload
  });
  if (error) throw error;
  return data;
}

export async function invokeSummarize(payload: { documentId: string; style?: string }) {
  const { data, error } = await supabase.functions.invoke<AiChatResponse>('summarize-document', {
    body: payload
  });
  if (error) throw error;
  return data;
}
