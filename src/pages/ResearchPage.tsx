import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { invokeAiChat } from '../lib/ai';
import { useToast } from '../hooks/useToast';

const tools = [
  { id: 'claims', title: 'Extract claims', prompt: 'Extract key claims and evidence.' },
  { id: 'citations', title: 'Extract citations', prompt: 'List citations and supporting quotes.' },
  { id: 'notes', title: 'Study notes', prompt: 'Create study notes with definitions and key points.' },
  { id: 'equations', title: 'Explain equations', prompt: 'Explain the key equations in the document.' },
  { id: 'contradictions', title: 'Find contradictions', prompt: 'Find contradictions or weak evidence.' }
];

export default function ResearchPage() {
  const { documents } = useDocuments();
  const { pushToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState('');

  const runTool = async (prompt: string) => {
    if (!selectedDoc) {
      pushToast('Select a document first.');
      return;
    }
    await invokeAiChat({ documentId: selectedDoc, message: prompt, mode: 'summarize' });
    pushToast('Output saved to AI history.');
  };

  return (
    <div className="research-view">
      <div className="research-header">
        <h2>Research Mode</h2>
        <p>Advanced tools for academic and scientific documents</p>
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
      <div className="research-grid">
        {tools.map((tool) => (
          <div className="research-card" key={tool.id}>
            <h3>{tool.title}</h3>
            <p>{tool.prompt}</p>
            <button className="research-card-btn" onClick={() => runTool(tool.prompt)}>
              Try it
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
