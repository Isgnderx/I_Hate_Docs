type AIQuickActionsProps = {
  onAction: (action: string) => void;
};

const actions = [
  { id: 'summarize', label: 'Summarize' },
  { id: 'explain', label: 'Explain selection' },
  { id: 'rewrite', label: 'Rewrite' },
  { id: 'translate', label: 'Translate' },
  { id: 'extract', label: 'Extract data' },
  { id: 'risks', label: 'Find risks' },
  { id: 'study', label: 'Study notes' },
  { id: 'email', label: 'Email draft' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'slides', label: 'Slide outline' }
];

export default function AIQuickActions({ onAction }: AIQuickActionsProps) {
  return (
    <div className="ai-suggested-prompts">
      {actions.map((action) => (
        <button key={action.id} className="ai-prompt-chip" onClick={() => onAction(action.id)}>
          {action.label}
        </button>
      ))}
    </div>
  );
}
