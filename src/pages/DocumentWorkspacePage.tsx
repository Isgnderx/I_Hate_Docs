import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageThumbnails from '../components/workspace/PageThumbnails';
import WorkspaceToolbar from '../components/workspace/WorkspaceToolbar';
import PDFViewer from '../components/workspace/PDFViewer';
import AICopilotPanel from '../components/ai/AICopilotPanel';
import { useDocument } from '../hooks/useDocument';
import { usePDFViewer } from '../hooks/usePDFViewer';
import { useAnnotations } from '../hooks/useAnnotations';
import { useAuth } from '../hooks/useAuth';
import { exportAnnotatedPdf } from '../lib/pdf';
import { supabase } from '../lib/supabase';
import { documentExportPath } from '../lib/storage';
import { useToast } from '../hooks/useToast';

export default function DocumentWorkspacePage() {
  const { id } = useParams();
  const { document: doc, loading } = useDocument(id);
  const { fileUrl } = usePDFViewer(doc);
  const { annotations, addAnnotation, updateAnnotation, removeAnnotation, saving } = useAnnotations(id);
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [selectedTool, setSelectedTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('doc-status', { detail: saving ? 'Saving' : 'Saved' }));
  }, [saving]);

  useEffect(() => {
    if (!doc) return;
    supabase.from('documents').update({ last_opened_at: new Date().toISOString() }).eq('id', doc.id);
  }, [doc]);

  const handleExport = useCallback(async () => {
    if (!fileUrl || !id || !user) return;
    setExporting(true);
    try {
      const response = await fetch(fileUrl);
      const buffer = await response.arrayBuffer();
      const exported = await exportAnnotatedPdf(buffer, annotations);
      const { count } = await supabase
        .from('document_versions')
        .select('*', { count: 'exact', head: true })
        .eq('document_id', id);
      const version = (count ?? 0) + 1;
      const path = documentExportPath(user.id, id, version).replace(/^documents\//, '');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, new Blob([exported], { type: 'application/pdf' }), { upsert: true });
      if (uploadError) throw uploadError;
      await supabase.from('document_versions').insert({
        document_id: id,
        user_id: user.id,
        file_path: `documents/${path}`,
        version_number: version,
        change_summary: 'Annotated export'
      });
      const { data } = await supabase.storage.from('documents').createSignedUrl(path, 60 * 10);
      if (data?.signedUrl) setExportUrl(data.signedUrl);
      pushToast('Export ready.');
    } catch (err) {
      pushToast('Export failed.');
    } finally {
      setExporting(false);
    }
  }, [annotations, fileUrl, id, pushToast, user]);

  useEffect(() => {
    const handler = () => handleExport();
    window.addEventListener('export-document', handler as EventListener);
    return () => window.removeEventListener('export-document', handler as EventListener);
  }, [handleExport]);

  const handleSelectPage = (page: number) => {
    setSelectedPage(page);
    const pageEl = window.document.getElementById(`pdf-page-${page}`);
    if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth' });
  };

  const readyAnnotations = useMemo(() => annotations ?? [], [annotations]);

  if (loading) {
    return <div className="page-loading">Loading document...</div>;
  }

  if (!doc) {
    return (
      <div className="page-error">
        <h2>Document not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/app/documents')} type="button">
          Back to documents
        </button>
      </div>
    );
  }

  return (
    <div className="workspace-layout">
      <PageThumbnails pageCount={pageCount || doc.page_count || 1} selectedPage={selectedPage} onSelect={handleSelectPage} />
      <div className="doc-canvas-area">
        <WorkspaceToolbar
          selectedTool={selectedTool}
          onToolChange={setSelectedTool}
          zoom={zoom}
          onZoomIn={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
          onZoomOut={() => setZoom((prev) => Math.max(prev - 0.1, 0.6))}
          onFit={() => setZoom(1)}
          onExport={handleExport}
        />
        <div className="doc-canvas-scroll" id="docCanvasScroll">
          <PDFViewer
            fileUrl={fileUrl}
            scale={zoom}
            annotations={readyAnnotations}
            selectedTool={selectedTool}
            onAddAnnotation={addAnnotation}
            onUpdateAnnotation={updateAnnotation}
            onRemoveAnnotation={removeAnnotation}
            onPageCount={setPageCount}
          />
        </div>
        <div className="floating-ai-actions">
          <button className="floating-ai-btn" data-action="summarize" onClick={() => window.dispatchEvent(new CustomEvent('ai-quick-action', { detail: 'summarize' }))}>
            Σ
          </button>
          <button className="floating-ai-btn" data-action="rewrite" onClick={() => window.dispatchEvent(new CustomEvent('ai-quick-action', { detail: 'rewrite' }))}>
            ✎
          </button>
          <button className="floating-ai-btn" data-action="translate" onClick={() => window.dispatchEvent(new CustomEvent('ai-quick-action', { detail: 'translate' }))}>
            🌐
          </button>
          <button className="floating-ai-btn primary" data-action="chat" onClick={() => window.dispatchEvent(new CustomEvent('open-ai-panel'))}>
            💬
          </button>
        </div>
        {exporting && <div className="export-status">Exporting PDF...</div>}
        {exportUrl && (
          <a className="export-link" href={exportUrl} target="_blank" rel="noreferrer">
            Download exported PDF
          </a>
        )}
      </div>
      <AICopilotPanel documentId={doc.id} documentTitle={doc.title} pageCount={pageCount || doc.page_count || 0} />
    </div>
  );
}
