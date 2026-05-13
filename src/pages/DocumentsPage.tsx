import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentGrid from '../components/documents/DocumentGrid';
import UploadDropzone from '../components/documents/UploadDropzone';
import { useDocuments } from '../hooks/useDocuments';

export default function DocumentsPage() {
  const { documents, loading, refresh } = useDocuments();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return documents;
    return documents.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()));
  }, [documents, query]);

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <div className="file-manager-title">
          <h2>All Documents</h2>
          <span className="file-count">{documents.length} documents</span>
        </div>
        <div className="file-manager-actions">
          <div className="file-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Search documents..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <button className="file-action-btn" type="button">
            Filter
          </button>
          <button className="file-action-btn primary" type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-upload'))}>
            Upload
          </button>
        </div>
      </div>

      <UploadDropzone onUploaded={(id) => navigate(`/app/document/${id}`)} />

      {loading ? (
        <div className="skeleton-block">Loading documents...</div>
      ) : (
        <DocumentGrid documents={filtered} onOpen={(id) => navigate(`/app/document/${id}`)} onRefresh={refresh} />
      )}
    </div>
  );
}
