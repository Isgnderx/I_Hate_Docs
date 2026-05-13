import { useEffect, useState } from 'react';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import PDFPage from './PDFPage';
import type { AnnotationRecord } from '../../lib/annotations';

type PDFViewerProps = {
  fileUrl: string | null;
  scale: number;
  annotations: AnnotationRecord[];
  selectedTool: string;
  onAddAnnotation: (pageNumber: number, type: AnnotationRecord['type'], data: AnnotationRecord['data']) => void;
  onUpdateAnnotation: (id: string, data: AnnotationRecord['data']) => void;
  onRemoveAnnotation: (id: string) => void;
  onPageCount: (count: number) => void;
};

export default function PDFViewer({
  fileUrl,
  scale,
  annotations,
  selectedTool,
  onAddAnnotation,
  onUpdateAnnotation,
  onRemoveAnnotation,
  onPageCount
}: PDFViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  GlobalWorkerOptions.workerSrc = workerSrc;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!fileUrl) {
        setPdfDoc(null);
        return;
      }
      const pdf = await getDocument(fileUrl).promise;
      if (cancelled) return;
      setPdfDoc(pdf);
      onPageCount(pdf.numPages);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fileUrl, onPageCount]);

  if (!fileUrl) {
    return <div className="pdf-empty">Select a document to preview.</div>;
  }

  if (!pdfDoc) {
    return <div className="pdf-empty">Loading PDF…</div>;
  }

  return (
    <div className="doc-canvas">
      {Array.from({ length: pdfDoc.numPages }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <PDFPage
            key={pageNumber}
            pdf={pdfDoc}
            pageNumber={pageNumber}
            scale={scale}
            annotations={annotations.filter((annotation) => annotation.page_number === pageNumber)}
            selectedTool={selectedTool}
            onAddAnnotation={onAddAnnotation}
            onUpdateAnnotation={onUpdateAnnotation}
            onRemoveAnnotation={onRemoveAnnotation}
          />
        );
      })}
    </div>
  );
}
