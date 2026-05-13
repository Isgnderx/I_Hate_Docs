import type { MouseEvent } from 'react';
import { formatBytes } from '../../lib/utils';
import type { DocumentRecord } from '../../hooks/useDocuments';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';

type DocumentCardProps = {
  document: DocumentRecord;
  onOpen: (id: string) => void;
  onDeleted?: () => void;
};

export default function DocumentCard({ document, onOpen, onDeleted }: DocumentCardProps) {
  const { pushToast } = useToast();

  const toggleStar = async (event: MouseEvent) => {
    event.stopPropagation();
    const next = !(document.is_starred ?? false);
    await supabase.from('documents').update({ is_starred: next }).eq('id', document.id);
    pushToast(next ? 'Added to starred' : 'Removed from starred');
    onDeleted?.();
  };

  const deleteDoc = async (event: MouseEvent) => {
    event.stopPropagation();
    await supabase.from('documents').delete().eq('id', document.id);
    pushToast('Document deleted');
    onDeleted?.();
  };

  return (
    <div className="file-card" onClick={() => onOpen(document.id)} role="button" tabIndex={0}>
      <div className="file-card-preview">
        <div className="file-card-thumb">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="file-card-badge badge-pdf">PDF</div>
      </div>
      <div className="file-card-info">
        <h3 className="file-card-name">{document.title}</h3>
        <div className="file-card-meta">
          <span>{formatBytes(document.file_size)}</span>
          <span>·</span>
          <span>{document.status ?? 'uploaded'}</span>
        </div>
      </div>
      <div className="file-card-actions">
        <button className={`file-card-star ${document.is_starred ? 'active' : ''}`} onClick={toggleStar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={document.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button className="file-card-more" onClick={deleteDoc}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
