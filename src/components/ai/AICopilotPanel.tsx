import { useEffect, useState } from 'react';
import { useAIChat } from '../../hooks/useAIChat';
import AIChatMessage from './AIChatMessage';
import AIThinking from './AIThinking';
import AIQuickActions from './AIQuickActions';

type AICopilotPanelProps = {
  documentId: string;
  documentTitle?: string | null;
  pageCount?: number | null;
};

const actionToPrompt: Record<string, { mode: string; message: string }> = {
  summarize: { mode: 'summarize', message: 'Summarize this document.' },
  explain: { mode: 'explain', message: 'Explain the selected text.' },
  rewrite: { mode: 'rewrite', message: 'Rewrite the selected text.' },
  translate: { mode: 'translate', message: 'Translate the selected text.' },
  extract: { mode: 'extract', message: 'Extract key data from this document.' },
  risks: { mode: 'risks', message: 'Identify risks or issues.' },
  study: { mode: 'summarize', message: 'Create study notes from this document.' },
  email: { mode: 'email', message: 'Write a concise email based on this document.' },
  checklist: { mode: 'summarize', message: 'Create a checklist based on this document.' },
  slides: { mode: 'summarize', message: 'Create a presentation outline from this document.' }
};

export default function AICopilotPanel({ documentId, documentTitle, pageCount }: AICopilotPanelProps) {
  const { messages, loading, sendMessage, clear } = useAIChat(documentId);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handler = () => setOpen(true);
    const actionHandler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const action = actionToPrompt[detail];
      if (action) sendMessage(action.message, action.mode);
    };
    window.addEventListener('open-ai-panel', handler);
    window.addEventListener('ai-quick-action', actionHandler as EventListener);
    return () => {
      window.removeEventListener('open-ai-panel', handler);
      window.removeEventListener('ai-quick-action', actionHandler as EventListener);
    };
  }, [sendMessage]);

  if (!open) return null;

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div className="ai-panel-title">
          <div className="ai-panel-title-dot"></div>
          <span>AI Copilot</span>
        </div>
        <div className="ai-panel-header-actions">
          <button className="ai-panel-action-btn" onClick={clear} title="New chat">
            +
          </button>
          <button className="ai-panel-action-btn" onClick={() => setOpen(false)} title="Close panel">
            ⌄
          </button>
        </div>
      </div>

      <div className="ai-context-bar">
        <div className="ai-context-chip">
          <span>{documentTitle ?? 'Untitled Document'}</span>
        </div>
        <div className="ai-context-pages">{pageCount ? `${pageCount} pages` : 'Processing...'}</div>
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-message ai-message-system">
            <div className="ai-message-content">
              <p>I&apos;ve analyzed this document. Ask anything or pick a quick action.</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <AIChatMessage key={message.id} message={message} />
        ))}
        {loading && <AIThinking />}
      </div>

      <AIQuickActions onAction={(action) => {
        const prompt = actionToPrompt[action];
        if (prompt) sendMessage(prompt.message, prompt.mode);
      }} />

      <div className="ai-chat-input-area">
        <div className="ai-chat-input-wrapper">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask anything about this PDF..."
          />
          <button
            className="ai-send-btn"
            onClick={() => {
              if (!input.trim()) return;
              sendMessage(input.trim());
              setInput('');
            }}
            type="button"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
