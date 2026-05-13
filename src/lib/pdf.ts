import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument, rgb } from 'pdf-lib';
import type { AnnotationRecord } from './annotations';

GlobalWorkerOptions.workerSrc = workerSrc;

export type ExtractedPage = {
  pageNumber: number;
  text: string;
  width: number;
  height: number;
};

export async function extractPdfText(file: File) {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  const pages: ExtractedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const viewport = page.getViewport({ scale: 1 });
    pages.push({
      pageNumber: i,
      text,
      width: viewport.width,
      height: viewport.height
    });
  }

  return {
    pages,
    pageCount: pdf.numPages
  };
}

export function chunkText(pages: ExtractedPage[], chunkSize = 1200, overlap = 200) {
  const chunks: Array<{ page_number: number; chunk_index: number; content: string; token_count: number }> = [];
  pages.forEach((page) => {
    if (!page.text) return;
    let index = 0;
    let chunkIndex = 0;
    while (index < page.text.length) {
      const content = page.text.slice(index, index + chunkSize);
      chunks.push({
        page_number: page.pageNumber,
        chunk_index: chunkIndex,
        content,
        token_count: Math.ceil(content.length / 4)
      });
      index += chunkSize - overlap;
      chunkIndex += 1;
    }
  });
  return chunks;
}

export async function exportAnnotatedPdf(
  sourcePdf: ArrayBuffer,
  annotations: AnnotationRecord[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(sourcePdf);
  const pages = pdfDoc.getPages();

  annotations.forEach((annotation) => {
    const page = pages[annotation.page_number - 1];
    if (!page) return;
    const { width, height } = page.getSize();
    const data = annotation.data;
    const x = (data.x ?? 0) * width;
    const y = height - (data.y ?? 0) * height - (data.height ?? 0) * height;
    const w = (data.width ?? 0.2) * width;
    const h = (data.height ?? 0.05) * height;

    if (annotation.type === 'highlight') {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(0.39, 0.4, 0.95),
        opacity: 0.35
      });
    }

    if (annotation.type === 'rectangle') {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: rgb(0.39, 0.4, 0.95),
        borderWidth: 1.2
      });
    }

    if (annotation.type === 'redaction') {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(0, 0, 0)
      });
    }

    if (annotation.type === 'text' && data.text) {
      page.drawText(data.text, {
        x,
        y: y + h - (data.fontSize ?? 14),
        size: data.fontSize ?? 14,
        color: rgb(1, 1, 1)
      });
    }
  });

  return await pdfDoc.save();
}
