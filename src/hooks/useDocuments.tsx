import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export type DocumentRecord = {
  id: string;
  owner_id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  page_count: number | null;
  status: string | null;
  summary: string | null;
  text_extracted: boolean | null;
  is_starred: boolean | null;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
};

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false });
    if (!error && data) setDocuments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setDocuments([]);
      return;
    }
    refresh();
  }, [user]);

  return { documents, loading, refresh };
}
