import type { ChatMessage } from '../../hooks/useAIChat';
import CitationList from './CitationList';

type AIChatMessageProps = {
  message: ChatMessage;
};

export default function AIChatMessage({ message }: AIChatMessageProps) {
  return (
    <div className={`ai-message ai-message-${message.role}`}>
      {message.role === 'assistant' && (
        <div className="ai-message-avatar">
          <div className="ai-msg-avatar-icon">AI</div>
        </div>
      )}
      <div className="ai-message-content">
        <p>{message.content}</p>
        {message.citations && message.citations.length > 0 && <CitationList citations={message.citations} />}
      </div>
    </div>
  );
}
