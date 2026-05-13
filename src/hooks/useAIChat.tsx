import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { invokeAiChat } from '../lib/ai';
import { useAuth } from './useAuth';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{ page: number; quote: string; chunkId: string }>;
  created_at?: string;
};

export function useAIChat(documentId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user || !documentId) return;
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setMessages(
        data.map((row) => ({
          id: row.id,
          role: row.role,
          content: row.content,
          citations: row.citations ?? [],
          created_at: row.created_at
        }))
      );
    }
  }, [documentId, user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const sendMessage = useCallback(
    async (message: string, mode?: string, selectedText?: string) => {
      if (!documentId || !user) return;
      const tempId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: tempId, role: 'user', content: message, created_at: new Date().toISOString() }
      ]);
      setLoading(true);
      try {
        const response = await invokeAiChat({
          documentId,
          message,
          mode: (mode ?? 'chat') as any,
          selectedText
        });
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: response?.answer ?? 'No response.',
            citations: response?.citations ?? [],
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: (err as Error).message || 'AI request failed.',
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [documentId, user]
  );

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    loadHistory,
    clear
  };
}
