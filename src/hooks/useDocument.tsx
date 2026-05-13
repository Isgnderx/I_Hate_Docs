import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { DocumentRecord } from './useDocuments';

export function useDocument(documentId?: string) {
  const { user } = useAuth();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user || !documentId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('owner_id', user.id)
      .maybeSingle();
    if (!error) setDocument(data ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !documentId) {
      setDocument(null);
      return;
    }
    refresh();
  }, [user, documentId]);

  return { document, loading, refresh };
}
