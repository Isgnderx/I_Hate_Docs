import { useEffect, useMemo, useState } from 'react';
import { useLocation, type NavigateFunction } from 'react-router-dom';

type Command = {
  label: string;
  action: () => void;
  section: 'Actions' | 'Navigate';
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: NavigateFunction;
};

export default function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  const commands = useMemo<Command[]>(() => {
    return [
      {
        label: 'New Document',
        section: 'Actions',
        action: () => window.dispatchEvent(new CustomEvent('open-upload'))
      },
      {
        label: 'Upload Document',
        section: 'Actions',
        action: () => window.dispatchEvent(new CustomEvent('open-upload'))
      },
      {
        label: 'Open current document AI chat',
        section: 'Actions',
        action: () => window.dispatchEvent(new CustomEvent('open-ai-panel'))
      },
      {
        label: 'Summarize current document',
        section: 'Actions',
        action: () => window.dispatchEvent(new CustomEvent('ai-quick-action', { detail: 'summarize' }))
      },
      {
        label: 'Export current document',
        section: 'Actions',
        action: () => window.dispatchEvent(new CustomEvent('export-document'))
      },
      {
        label: 'Go to dashboard',
        section: 'Navigate',
        action: () => onNavigate('/app')
      },
      {
        label: 'Go to documents',
        section: 'Navigate',
        action: () => onNavigate('/app/documents')
      },
      {
        label: 'Go to AI agents',
        section: 'Navigate',
        action: () => onNavigate('/app/agents')
      },
      {
        label: 'Go to settings',
        section: 'Navigate',
        action: () => onNavigate('/app/settings')
      }
    ];
  }, [onNavigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    return commands.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()));
  }, [commands, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open, location.pathname]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        filtered[activeIndex]?.action();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  const actions = filtered.filter((cmd) => cmd.section === 'Actions');
  const navigations = filtered.filter((cmd) => cmd.section === 'Navigate');

  return (
    <div className="cmd-palette-overlay active" onClick={(event) => event.currentTarget === event.target && onClose()}>
      <div className="cmd-palette">
        <div className="cmd-palette-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="cmd-palette-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          <div className="cmd-palette-kbd">ESC</div>
        </div>
        <div className="cmd-palette-section">
          <div className="cmd-palette-label">Actions</div>
          {actions.map((cmd) => {
            const idx = filtered.findIndex((item) => item.label === cmd.label);
            return (
              <div
                key={cmd.label}
                className={`cmd-palette-item ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <div className="cmd-palette-item-icon">⌘</div>
                <span>{cmd.label}</span>
              </div>
            );
          })}
        </div>
        <div className="cmd-palette-section">
          <div className="cmd-palette-label">Navigate</div>
          {navigations.map((cmd) => {
            const idx = filtered.findIndex((item) => item.label === cmd.label);
            return (
              <div
                key={cmd.label}
                className={`cmd-palette-item ${activeIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <div className="cmd-palette-item-icon">↗</div>
                <span>{cmd.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
