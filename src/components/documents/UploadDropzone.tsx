import { useEffect, useRef } from 'react';
import { useUploadDocument } from '../../hooks/useUploadDocument';

type UploadDropzoneProps = {
  onUploaded?: (documentId: string) => void;
};

export default function UploadDropzone({ onUploaded }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { uploadDocument, progress, uploading, error } = useUploadDocument();

  useEffect(() => {
    const handler = () => inputRef.current?.click();
    window.addEventListener('open-upload', handler as EventListener);
    return () => window.removeEventListener('open-upload', handler as EventListener);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const id = await uploadDocument(files[0]);
    if (id && onUploaded) onUploaded(id);
  };

  return (
    <div
      className="drag-drop-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      <div className="drag-drop-content">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <span>{uploading ? `Uploading... ${progress}%` : 'Drop PDFs here or click to browse'}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(event) => handleFiles(event.target.files)}
      />
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}
