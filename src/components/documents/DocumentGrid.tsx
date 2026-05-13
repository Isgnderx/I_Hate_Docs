import type { DocumentRecord } from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';

type DocumentGridProps = {
  documents: DocumentRecord[];
  onOpen: (id: string) => void;
  onRefresh: () => void;
};

export default function DocumentGrid({ documents, onOpen, onRefresh }: DocumentGridProps) {
  if (!documents.length) {
    return <div className="empty-state">No documents yet. Upload your first PDF.</div>;
  }

  return (
    <div className="file-grid">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onOpen={onOpen} onDeleted={onRefresh} />
      ))}
    </div>
  );
}
