create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free',
  ai_daily_limit int default 10,
  storage_limit_bytes bigint default 26214400,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text default 'application/pdf',
  page_count int,
  status text default 'uploaded',
  summary text,
  text_extracted boolean default false,
  is_starred boolean default false,
  last_opened_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists document_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  page_number int not null,
  text_content text,
  width numeric,
  height numeric,
  created_at timestamptz default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  page_number int,
  chunk_index int not null,
  content text not null,
  token_count int,
  created_at timestamptz default now()
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  mode text default 'chat',
  content text not null,
  citations jsonb default '[]'::jsonb,
  model text,
  token_usage jsonb,
  created_at timestamptz default now()
);

create table if not exists document_annotations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  page_number int not null,
  type text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  file_path text,
  version_number int not null,
  change_summary text,
  created_at timestamptz default now()
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  document_id uuid references documents(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
