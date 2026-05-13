import { useRef, type PointerEvent } from 'react';
import type { AnnotationRecord } from '../../lib/annotations';

type AnnotationLayerProps = {
  annotations: AnnotationRecord[];
  onUpdate: (id: string, data: AnnotationRecord['data']) => void;
  onRemove: (id: string) => void;
};

export default function AnnotationLayer({ annotations, onUpdate, onRemove }: AnnotationLayerProps) {
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    width: number;
    height: number;
  } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>, annotation: AnnotationRecord) => {
    const target = event.currentTarget;
    const rect = target.parentElement?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: annotation.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: annotation.data.x ?? 0,
      originY: annotation.data.y ?? 0,
      width: rect.width,
      height: rect.height
    };
    target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { id, startX, startY, originX, originY, width, height } = dragRef.current;
    const dx = (event.clientX - startX) / width;
    const dy = (event.clientY - startY) / height;
    onUpdate(id, {
      ...annotations.find((annotation) => annotation.id === id)?.data,
      x: Math.max(0, Math.min(0.95, originX + dx)),
      y: Math.max(0, Math.min(0.95, originY + dy))
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>, annotation: AnnotationRecord) => {
    dragRef.current = null;
    const element = event.currentTarget;
    const rect = element.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const width = element.clientWidth / rect.width;
    const height = element.clientHeight / rect.height;
    onUpdate(annotation.id, { ...annotation.data, width, height });
  };

  return (
    <div className="annotation-layer">
      {annotations.map((annotation) => {
        const width = (annotation.data.width ?? 0.2) * 100;
        const height = (annotation.data.height ?? 0.05) * 100;
        const style: React.CSSProperties = {
          left: `${(annotation.data.x ?? 0) * 100}%`,
          top: `${(annotation.data.y ?? 0) * 100}%`,
          width: `${width}%`,
          height: `${height}%`
        };

        if (annotation.type === 'text') {
          return (
            <div
              key={annotation.id}
              className="annotation annotation-text"
              style={style}
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => onUpdate(annotation.id, { ...annotation.data, text: event.currentTarget.textContent ?? '' })}
              onDoubleClick={() => onRemove(annotation.id)}
              onPointerDown={(event) => handlePointerDown(event, annotation)}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event, annotation)}
            >
              {annotation.data.text ?? 'Text'}
            </div>
          );
        }

        if (annotation.type === 'highlight') {
          return (
            <div
              key={annotation.id}
              className="annotation annotation-highlight"
              style={style}
              onDoubleClick={() => onRemove(annotation.id)}
              onPointerDown={(event) => handlePointerDown(event, annotation)}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event, annotation)}
            />
          );
        }

        if (annotation.type === 'rectangle') {
          return (
            <div
              key={annotation.id}
              className="annotation annotation-rectangle"
              style={style}
              onDoubleClick={() => onRemove(annotation.id)}
              onPointerDown={(event) => handlePointerDown(event, annotation)}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event, annotation)}
            />
          );
        }

        if (annotation.type === 'redaction') {
          return (
            <div
              key={annotation.id}
              className="annotation annotation-redaction"
              style={style}
              onDoubleClick={() => onRemove(annotation.id)}
              onPointerDown={(event) => handlePointerDown(event, annotation)}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event, annotation)}
            />
          );
        }

        return (
          <div key={annotation.id} className="annotation annotation-comment" style={style}>
            {annotation.data.text ?? 'Comment'}
            <button className="annotation-remove" onClick={() => onRemove(annotation.id)} type="button">
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
