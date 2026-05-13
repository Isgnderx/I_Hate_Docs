import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { PLAN_LIMITS, STORAGE_BUCKET } from '../lib/constants';
import { extractPdfText, chunkText } from '../lib/pdf';
import { useProfile } from './useProfile';
import { useToast } from './useToast';

async function uploadFileWithProgress(
  file: File,
  path: string,
  accessToken: string,
  supabaseUrl: string,
  anonKey: string,
  onProgress: (value: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${supabaseUrl}/storage/v1/object/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('apikey', anonKey);
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(file);
  });
}

export function useUploadDocument() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { pushToast } = useToast();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(
    async (file: File) => {
      if (!user) return null;
      setError(null);

      const planKey = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS;
      const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.free;
      if (!file.type.includes('pdf')) {
        setError('Only PDF files are supported for MVP.');
        return null;
      }
      if (file.size > limits.maxFileBytes) {
        setError(`File exceeds ${Math.round(limits.maxFileBytes / (1024 * 1024))}MB limit.`);
        return null;
      }

      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);
      if ((count ?? 0) >= limits.maxDocuments) {
        setError('You have reached your document limit for this plan.');
        return null;
      }

      setUploading(true);
      setProgress(0);

      const documentId = crypto.randomUUID();
      const title = file.name.replace(/\.pdf$/i, '');
      const filePath = `${STORAGE_BUCKET}/${user.id}/${documentId}/original.pdf`;

      const { error: insertError } = await supabase.from('documents').insert({
        id: documentId,
        owner_id: user.id,
        title,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        status: 'uploading'
      });
      if (insertError) {
        setError('Failed to create document record.');
        setUploading(false);
        return null;
      }

      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!token || !supabaseUrl || !anonKey) {
          throw new Error('Missing Supabase session or env configuration.');
        }

        await uploadFileWithProgress(file, filePath, token, supabaseUrl, anonKey, setProgress);
        await supabase.from('documents').update({ status: 'processing' }).eq('id', documentId);

        const extracted = await extractPdfText(file);
        const pagesPayload = extracted.pages.map((page) => ({
          document_id: documentId,
          owner_id: user.id,
          page_number: page.pageNumber,
          text_content: page.text,
          width: page.width,
          height: page.height
        }));
        if (pagesPayload.length) {
          await supabase.from('document_pages').insert(pagesPayload);
        }

        const chunks = chunkText(extracted.pages);
        if (chunks.length) {
          const chunkPayload = chunks.map((chunk) => ({
            document_id: documentId,
            owner_id: user.id,
            page_number: chunk.page_number,
            chunk_index: chunk.chunk_index,
            content: chunk.content,
            token_count: chunk.token_count
          }));
          await supabase.from('document_chunks').insert(chunkPayload);
        }

        await supabase
          .from('documents')
          .update({
            page_count: extracted.pageCount,
            status: 'ready',
            text_extracted: extracted.pages.some((page) => page.text.length > 0)
          })
          .eq('id', documentId);

        pushToast('Upload complete. Document ready.');
        setUploading(false);
        return documentId;
      } catch (err) {
        await supabase.from('documents').update({ status: 'failed' }).eq('id', documentId);
        setError((err as Error).message);
        setUploading(false);
        return null;
      }
    },
    [user, profile, pushToast]
  );

  return {
    uploadDocument,
    progress,
    uploading,
    error
  };
}
