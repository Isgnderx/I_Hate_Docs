import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { invokeAiChat } from '../lib/ai';
import { useToast } from '../hooks/useToast';

export default function MultiDocPage() {
  const { documents } = useDocuments();
  const { pushToast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((doc) => doc !== id) : [...prev, id]));
  };

  const compare = async () => {
    if (selected.length < 2) {
      pushToast('Select at least two documents.');
      return;
    }
    const selectedDocs = documents.filter((doc) => selected.includes(doc.id));
    const summaryPayload = selectedDocs
      .map((doc) => `Document: ${doc.title}\nSummary: ${doc.summary ?? 'No summary available yet.'}`)
      .join('\n\n');
    const response = await invokeAiChat({
      documentId: selectedDocs[0].id,
      message: `Compare these documents and highlight key differences:\n\n${summaryPayload}`,
      mode: 'summarize'
    });
    setOutput(response.answer);
  };

  return (
    <div className="multi-doc-view">
      <div className="multi-doc-header">
        <h2>Multi-Document Workspace</h2>
      </div>
      <div className="multi-doc-selector">
        {documents.map((doc) => (
          <label key={doc.id} className="multi-doc-option">
            <input type="checkbox" checked={selected.includes(doc.id)} onChange={() => toggle(doc.id)} />
            {doc.title}
          </label>
        ))}
      </div>
      <button className="btn btn-primary" onClick={compare} type="button">
        Compare documents
      </button>
      {output && (
        <div className="multi-doc-output">
          <h3>Comparison</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
