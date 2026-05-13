import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { AnnotationData, AnnotationRecord, AnnotationType } from '../lib/annotations';

export function useAnnotations(documentId?: string) {
  const { user } = useAuth();
  const [annotations, setAnnotations] = useState<AnnotationRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (!user || !documentId) return;
    const { data, error } = await supabase
      .from('document_annotations')
      .select('*')
      .eq('document_id', documentId)
      .eq('user_id', user.id);
    if (!error && data) setAnnotations(data);
  }, [documentId, user]);

  useEffect(() => {
    load();
  }, [load]);

  const addAnnotation = useCallback(
    async (pageNumber: number, type: AnnotationType, data: AnnotationData) => {
      if (!user || !documentId) return;
      const { data: created, error } = await supabase
        .from('document_annotations')
        .insert({
          document_id: documentId,
          user_id: user.id,
          page_number: pageNumber,
          type,
          data
        })
        .select('*')
        .single();
      if (!error && created) {
        setAnnotations((prev) => [...prev, created]);
      }
    },
    [documentId, user]
  );

  const updateAnnotation = useCallback(
    (id: string, data: AnnotationData) => {
      setAnnotations((prev) =>
        prev.map((annotation) => (annotation.id === id ? { ...annotation, data } : annotation))
      );

      setSaving(true);
      if (saveTimeout.current) window.clearTimeout(saveTimeout.current);
      saveTimeout.current = window.setTimeout(async () => {
        await supabase
          .from('document_annotations')
          .update({ data, updated_at: new Date().toISOString() })
          .eq('id', id);
        setSaving(false);
      }, 400);
    },
    []
  );

  const removeAnnotation = useCallback(async (id: string) => {
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id));
    await supabase.from('document_annotations').delete().eq('id', id);
  }, []);

  return {
    annotations,
    addAnnotation,
    updateAnnotation,
    removeAnnotation,
    saving,
    reload: load
  };
}
