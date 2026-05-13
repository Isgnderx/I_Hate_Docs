import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { invokeAiChat } from '../lib/ai';
import { useToast } from '../hooks/useToast';

const templates = ['Modern report', 'Investor deck', 'Academic paper', 'Contract cleanup', 'Brand polish'];

export default function RedesignPage() {
  const { documents } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const { pushToast } = useToast();

  const runRedesign = async () => {
    if (!selectedDoc) {
      pushToast('Select a document to redesign.');
      return;
    }
    await invokeAiChat({
      documentId: selectedDoc,
      message: `Create a redesign plan using the "${selectedTemplate}" template.`,
      mode: 'rewrite'
    });
    pushToast('Redesign plan saved to AI history.');
  };

  return (
    <div className="redesign-view">
      <div className="redesign-header">
        <h2>AI Redesign</h2>
        <p>Transform your documents with intelligent design</p>
      </div>
      <div className="redesign-selector">
        <label>
          Document
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
      <div className="redesign-templates">
        <div className="redesign-templates-label">Style Presets</div>
        <div className="redesign-templates-grid">
          {templates.map((template) => (
            <button
              key={template}
              className={`redesign-template ${selectedTemplate === template ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="template-preview">
                <span>Aa</span>
              </div>
              <span>{template}</span>
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={runRedesign} type="button">
        Generate redesign plan
      </button>
      <p className="mvp-note">MVP: outputs a redesign plan (not full visual reflow).</p>
    </div>
  );
}
