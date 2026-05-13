create extension if not exists vector;

alter table document_chunks
  add column if not exists embedding vector(1536);
