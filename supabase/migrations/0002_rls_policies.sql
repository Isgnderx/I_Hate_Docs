alter table profiles enable row level security;
alter table documents enable row level security;
alter table document_pages enable row level security;
alter table document_chunks enable row level security;
alter table ai_messages enable row level security;
alter table document_annotations enable row level security;
alter table document_versions enable row level security;
alter table usage_events enable row level security;

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());

create policy "documents_select_own" on documents
  for select using (owner_id = auth.uid());

create policy "documents_insert_own" on documents
  for insert with check (owner_id = auth.uid());

create policy "documents_update_own" on documents
  for update using (owner_id = auth.uid());

create policy "documents_delete_own" on documents
  for delete using (owner_id = auth.uid());

create policy "pages_select_own" on document_pages
  for select using (owner_id = auth.uid());

create policy "pages_insert_own" on document_pages
  for insert with check (owner_id = auth.uid());

create policy "pages_update_own" on document_pages
  for update using (owner_id = auth.uid());

create policy "pages_delete_own" on document_pages
  for delete using (owner_id = auth.uid());

create policy "chunks_select_own" on document_chunks
  for select using (owner_id = auth.uid());

create policy "chunks_insert_own" on document_chunks
  for insert with check (owner_id = auth.uid());

create policy "chunks_update_own" on document_chunks
  for update using (owner_id = auth.uid());

create policy "chunks_delete_own" on document_chunks
  for delete using (owner_id = auth.uid());

create policy "ai_messages_select_own" on ai_messages
  for select using (user_id = auth.uid());

create policy "ai_messages_insert_own" on ai_messages
  for insert with check (user_id = auth.uid());

create policy "annotations_select_own" on document_annotations
  for select using (user_id = auth.uid());

create policy "annotations_insert_own" on document_annotations
  for insert with check (user_id = auth.uid());

create policy "annotations_update_own" on document_annotations
  for update using (user_id = auth.uid());

create policy "annotations_delete_own" on document_annotations
  for delete using (user_id = auth.uid());

create policy "versions_select_own" on document_versions
  for select using (user_id = auth.uid());

create policy "versions_insert_own" on document_versions
  for insert with check (user_id = auth.uid());

create policy "usage_events_select_own" on usage_events
  for select using (user_id = auth.uid());

create policy "usage_events_insert_own" on usage_events
  for insert with check (user_id = auth.uid());
