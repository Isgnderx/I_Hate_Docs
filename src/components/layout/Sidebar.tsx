import { NavLink } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

type SidebarProps = {
  collapsed: boolean;
  onCollapse: () => void;
};

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const { profile } = useProfile();
  const initials = profile?.full_name?.split(' ').map((p) => p[0]).join('').slice(0, 2) || 'IH';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
              <path
                d="M10 8h8l4 4v12a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
                fill="white"
                opacity="0.15"
              />
              <path d="M15 10v4h4" fill="white" fillOpacity="0.3" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="sidebar-logo-text">I Hate Docs</span>
        </div>
        <button className="sidebar-collapse-btn" onClick={onCollapse} title="Collapse sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </div>

      <div className="sidebar-workspace">
        <button className="workspace-switcher">
          <div className="workspace-switcher-avatar">{initials}</div>
          <div className="workspace-switcher-info">
            <span className="workspace-switcher-name">Personal</span>
            <span className="workspace-switcher-plan">{profile?.plan ?? 'free'} plan</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <NavLink className="sidebar-link" to="/app">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
          <span>Workspace</span>
          <div className="sidebar-ai-dot" title="AI Active"></div>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/documents">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>All Documents</span>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/agents">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
          </svg>
          <span>AI Agents</span>
          <div className="sidebar-pulse"></div>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/redesign">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>AI Redesign</span>
          <span className="sidebar-badge badge-new">New</span>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/research">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Research Mode</span>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/multi-doc">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <span>Multi-Document</span>
        </NavLink>

        <div className="sidebar-section-label">Account</div>
        <NavLink className="sidebar-link" to="/app/settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </NavLink>
        <NavLink className="sidebar-link" to="/app/billing">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span>Billing</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-ai-status">
          <div className="ai-status-dot"></div>
          <div className="ai-status-text">
            <span>AI Online</span>
            <span className="ai-status-model">OpenAI compatible</span>
          </div>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{profile?.full_name ?? 'Your Workspace'}</span>
            <span className="sidebar-user-email">{profile?.email ?? '—'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
