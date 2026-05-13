import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { DocumentRecord } from './useDocuments';

export function usePDFViewer(document?: DocumentRecord | null) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!document?.file_path) {
        setFileUrl(null);
        return;
      }
      setLoading(true);
      setError(null);
      const path = document.file_path.replace(/^documents\//, '');
      const { data, error: signedError } = await supabase.storage
        .from('documents')
        .createSignedUrl(path, 60 * 15);
      if (signedError) {
        setError('Unable to load PDF');
        setFileUrl(null);
        setLoading(false);
        return;
      }
      setFileUrl(data.signedUrl);
      setLoading(false);
    };
    load();
  }, [document?.file_path]);

  return { fileUrl, loading, error };
}
