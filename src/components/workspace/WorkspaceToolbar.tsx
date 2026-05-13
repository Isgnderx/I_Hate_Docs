type WorkspaceToolbarProps = {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onExport: () => void;
};

const tools = [
  { id: 'select', label: 'Select' },
  { id: 'hand', label: 'Hand' },
  { id: 'text', label: 'Text' },
  { id: 'highlight', label: 'Highlight' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'redact', label: 'Redact' },
  { id: 'comment', label: 'Comment' }
];

export default function WorkspaceToolbar({
  selectedTool,
  onToolChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
  onExport
}: WorkspaceToolbarProps) {
  return (
    <div className="canvas-toolbar">
      <div className="canvas-toolbar-left">
        <div className="tool-group">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`canvas-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
              title={tool.label}
              onClick={() => onToolChange(tool.id)}
            >
              {tool.label.slice(0, 1)}
            </button>
          ))}
        </div>
        <div className="tool-divider"></div>
        <div className="tool-group">
          <button className="canvas-tool-btn" onClick={onExport} title="Export">
            ⤓
          </button>
        </div>
      </div>
      <div className="canvas-toolbar-right">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={onZoomOut}>
            −
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={onZoomIn}>
            +
          </button>
          <button className="zoom-fit-btn" onClick={onFit}>
            Fit
          </button>
        </div>
      </div>
    </div>
  );
}
