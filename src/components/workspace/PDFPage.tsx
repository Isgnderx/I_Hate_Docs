import { useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';
import type { AnnotationRecord } from '../../lib/annotations';

type PDFPageProps = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  annotations: AnnotationRecord[];
  selectedTool: string;
  onAddAnnotation: (pageNumber: number, type: AnnotationRecord['type'], data: AnnotationRecord['data']) => void;
  onUpdateAnnotation: (id: string, data: AnnotationRecord['data']) => void;
  onRemoveAnnotation: (id: string) => void;
};

export default function PDFPage({
  pdf,
  pageNumber,
  scale,
  annotations,
  selectedTool,
  onAddAnnotation,
  onUpdateAnnotation,
  onRemoveAnnotation
}: PDFPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const page = await pdf.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, scale]);

  const handleClick = (event: React.MouseEvent) => {
    if (selectedTool === 'select' || selectedTool === 'hand') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (selectedTool === 'text') {
      onAddAnnotation(pageNumber, 'text', { x, y, width: 0.2, height: 0.05, text: 'New text', fontSize: 14, color: '#ffffff' });
    } else if (selectedTool === 'highlight') {
      onAddAnnotation(pageNumber, 'highlight', { x, y, width: 0.3, height: 0.03, color: 'rgba(99,102,241,0.35)' });
    } else if (selectedTool === 'rectangle') {
      onAddAnnotation(pageNumber, 'rectangle', { x, y, width: 0.2, height: 0.15, color: '#6366f1' });
    } else if (selectedTool === 'redact') {
      onAddAnnotation(pageNumber, 'redaction', { x, y, width: 0.2, height: 0.08, fill: '#000000' });
    } else if (selectedTool === 'comment') {
      onAddAnnotation(pageNumber, 'comment', { x, y, width: 0.25, height: 0.08, text: 'Comment' });
    }
  };

  return (
    <div className="doc-page" id={`pdf-page-${pageNumber}`} ref={containerRef} onClick={handleClick}>
      <canvas ref={canvasRef} />
      <AnnotationLayer annotations={annotations} onUpdate={onUpdateAnnotation} onRemove={onRemoveAnnotation} />
    </div>
  );
}
