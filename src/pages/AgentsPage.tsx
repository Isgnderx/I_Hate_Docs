import { useMemo, useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { invokeAiChat } from '../lib/ai';
import { useToast } from '../hooks/useToast';

const agents = [
  { id: 'summarizer', name: 'Summarizer', mode: 'summarize', desc: 'Generate concise document summaries.' },
  { id: 'contract', name: 'Contract Reviewer', mode: 'risks', desc: 'Flag risky clauses and compliance issues.' },
  { id: 'research', name: 'Research Assistant', mode: 'summarize', desc: 'Extract claims, citations, and study notes.' },
  { id: 'translator', name: 'Translator', mode: 'translate', desc: 'Translate sections while preserving meaning.' },
  { id: 'tables', name: 'Table Extractor', mode: 'extract', desc: 'Extract tables and structured data.' },
  { id: 'email', name: 'Email Writer', mode: 'email', desc: 'Draft a concise email from the document.' },
  { id: 'slides', name: 'Presentation Builder', mode: 'summarize', desc: 'Generate a slide outline.' },
  { id: 'redesign', name: 'Redesign Assistant', mode: 'rewrite', desc: 'Create a redesign plan for the content.' }
];

export default function AgentsPage() {
  const { documents } = useDocuments();
  const { pushToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [activeAgent, setActiveAgent] = useState<typeof agents[0] | null>(null);

  const selectedDocument = useMemo(() => documents.find((doc) => doc.id === selectedDoc), [documents, selectedDoc]);

  const runAgent = async () => {
    if (!activeAgent) return;
    if (!selectedDocument) {
      pushToast('Select a document first.');
      return;
    }
    await invokeAiChat({
      documentId: selectedDocument.id,
      message: `${activeAgent.name}: ${activeAgent.desc}`,
      mode: activeAgent.mode as any
    });
    pushToast(`${activeAgent.name} output saved to AI history.`);
  };

  return (
    <div className="agents-view">
      <div className="agents-header">
        <h2>AI Agents</h2>
        <p>Specialized AI agents for every document workflow</p>
      </div>
      <div className="agent-select">
        <label>
          Active document
          <select value={selectedDoc} onChange={(event) => setSelectedDoc(event.target.value)}>
            <option value="">Select a document...</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="agents-grid">
        {agents.map((agent) => (
          <div className="agent-card" key={agent.id}>
            <div className="agent-card-header">
              <div className="agent-card-icon">{agent.name.charAt(0)}</div>
              <div className="agent-card-status active">
                <div className="agent-status-dot"></div>
                Ready
              </div>
            </div>
            <h3 className="agent-card-name">{agent.name}</h3>
            <p className="agent-card-desc">{agent.desc}</p>
            <button className="agent-card-btn" onClick={() => setActiveAgent(agent)}>
              Launch Agent
            </button>
          </div>
        ))}
      </div>

      {activeAgent && (
        <div className="modal-backdrop" onClick={() => setActiveAgent(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>{activeAgent.name}</h3>
            <p>{activeAgent.desc}</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setActiveAgent(null)} type="button">
                Close
              </button>
              <button className="btn btn-primary" onClick={runAgent} type="button">
                Run agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
