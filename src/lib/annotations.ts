export type AnnotationType = 'text' | 'highlight' | 'rectangle' | 'redaction' | 'comment';

export type AnnotationData = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  color?: string;
  fill?: string;
};

export type AnnotationRecord = {
  id: string;
  document_id: string;
  user_id: string;
  page_number: number;
  type: AnnotationType;
  data: AnnotationData;
  created_at: string;
  updated_at: string;
};
