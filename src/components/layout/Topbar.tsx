type TopbarProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  docStatus?: string;
  onCommand?: () => void;
};

export default function Topbar({ title, subtitle, showBack, onBack, docStatus, onCommand }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {showBack && (
          <button className="topbar-back" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="topbar-breadcrumbs">
          <span className="breadcrumb-item active">{title}</span>
          {subtitle && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="breadcrumb-item">{subtitle}</span>
            </>
          )}
        </div>
        {docStatus && (
          <div className="topbar-doc-status">
            <div className={`doc-status-indicator ${docStatus === 'Saved' ? 'saved' : 'saving'}`}></div>
            <span>{docStatus}</span>
          </div>
        )}
      </div>

      <div className="topbar-center">
        <button className="topbar-cmd-btn" onClick={onCommand} title="Command Palette (⌘K)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>Search anything...</span>
          <div className="topbar-cmd-kbd">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="AI Activity">
          <div className="ai-activity-indicator">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
            </svg>
            <div className="ai-activity-pulse"></div>
          </div>
        </button>
        <button className="topbar-icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="notification-dot"></div>
        </button>
        <div className="topbar-profile">
          <div className="topbar-profile-avatar">A</div>
        </div>
      </div>
    </header>
  );
}
