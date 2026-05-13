import { useNavigate } from 'react-router-dom';
import UploadDropzone from '../components/documents/UploadDropzone';
import DocumentGrid from '../components/documents/DocumentGrid';
import { useDocuments } from '../hooks/useDocuments';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { formatBytes } from '../lib/utils';

export default function DashboardPage() {
  const { documents, loading, refresh } = useDocuments();
  const { aiUsedToday, limits, plan } = useUsageLimits();
  const navigate = useNavigate();

  const recent = documents.slice(0, 6);
  const starred = documents.filter((doc) => doc.is_starred).slice(0, 4);

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <h2>Welcome back</h2>
          <p>Upload a PDF and start working with your AI document OS.</p>
        </div>
        <div className="usage-cards">
          <div className="usage-card">
            <span>Plan</span>
            <strong>{plan.toUpperCase()}</strong>
          </div>
          <div className="usage-card">
            <span>AI messages</span>
            <strong>
              {aiUsedToday}/{limits.maxAiDaily}
            </strong>
          </div>
          <div className="usage-card">
            <span>Storage limit</span>
            <strong>{formatBytes(limits.maxFileBytes)}</strong>
          </div>
        </div>
      </div>

      <UploadDropzone onUploaded={(id) => navigate(`/app/document/${id}`)} />

      <div className="dashboard-section-block">
        <div className="section-title-row">
          <h3>Recent documents</h3>
          <button className="btn btn-ghost" onClick={() => navigate('/app/documents')} type="button">
            View all
          </button>
        </div>
        {loading ? <div className="skeleton-block">Loading documents...</div> : (
          <DocumentGrid documents={recent} onOpen={(id) => navigate(`/app/document/${id}`)} onRefresh={refresh} />
        )}
      </div>

      <div className="dashboard-section-block">
        <div className="section-title-row">
          <h3>Starred</h3>
        </div>
        {starred.length ? (
          <DocumentGrid documents={starred} onOpen={(id) => navigate(`/app/document/${id}`)} onRefresh={refresh} />
        ) : (
          <div className="empty-state">Star your most important documents to keep them here.</div>
        )}
      </div>
    </div>
  );
}
