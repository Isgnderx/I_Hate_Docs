import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from '../command/CommandPalette';
import ToastContainer from '../ui/Toast';
import { useDocument } from '../../hooks/useDocument';

const viewNames: Record<string, string> = {
  '/app': 'Workspace',
  '/app/documents': 'All Documents',
  '/app/agents': 'AI Agents',
  '/app/redesign': 'AI Redesign',
  '/app/research': 'Research Mode',
  '/app/multi-doc': 'Multi-Document',
  '/app/settings': 'Settings',
  '/app/billing': 'Billing'
};

export default function AppShell() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { document } = useDocument(params.id);
  const [docStatus, setDocStatus] = useState<'Saved' | 'Saving'>('Saved');

  useEffect(() => {
    document.body.classList.remove('landing');
    document.body.classList.add('app');
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCmdOpen(true);
      }
      if (event.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const next = (event as CustomEvent<'Saved' | 'Saving'>).detail;
      if (next) setDocStatus(next);
    };
    window.addEventListener('doc-status', handler as EventListener);
    return () => window.removeEventListener('doc-status', handler as EventListener);
  }, []);

  const topbarTitle = useMemo(() => {
    if (location.pathname.startsWith('/app/document') && document?.title) {
      return 'Workspace';
    }
    return viewNames[location.pathname] ?? 'Workspace';
  }, [location.pathname, document?.title]);

  const topbarSubtitle = useMemo(() => {
    if (location.pathname.startsWith('/app/document')) {
      return document?.title ?? 'Document';
    }
    return undefined;
  }, [location.pathname, document?.title]);

  const showBack = location.pathname !== '/app';

  return (
    <div className="app-shell">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed((prev) => !prev)} />
      <main className="main-area">
        <Topbar
          title={topbarTitle}
          subtitle={topbarSubtitle}
          showBack={showBack}
          onBack={() => navigate(-1)}
          onCommand={() => setCmdOpen(true)}
          docStatus={location.pathname.startsWith('/app/document') ? docStatus : undefined}
        />
        <div className="content-area">
          <Outlet />
        </div>
      </main>
      <button
        className="ai-float-btn"
        title="AI Assistant"
        onClick={() => window.dispatchEvent(new CustomEvent('open-ai-panel'))}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
        </svg>
        <div className="ai-float-pulse"></div>
      </button>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
      <ToastContainer />
    </div>
  );
}
