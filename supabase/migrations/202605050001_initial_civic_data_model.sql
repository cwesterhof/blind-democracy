-- Blind Democracy civic data model
-- This schema keeps raw sources, AI/import candidates, human review, and public data separate.

create extension if not exists pgcrypto;

create type public.review_status as enum (
  'needs_human_review',
  'approved',
  'rejected',
  'needs_more_source',
  'superseded'
);

create type public.position_direction as enum (
  'for',
  'against',
  'neutral',
  'mixed',
  'unknown'
);

create type public.promise_verdict as enum (
  'kept',
  'broken',
  'mixed',
  'unclear'
);

create type public.vote_choice as enum (
  'for',
  'against',
  'abstain',
  'absent',
  'unknown'
);

create type public.source_kind as enum (
  'party_program',
  'kamerstuk',
  'kamer_vote',
  'public_claim',
  'factcheck',
  'research',
  'official_data',
  'other'
);

create table public.parties (
  id text primary key,
  name text not null,
  short_name text not null unique,
  logo_url text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.politicians (
  id text primary key,
  party_id text references public.parties(id),
  external_id text,
  name text not null,
  role text,
  photo_url text,
  source_url text,
  seat_since date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dossiers (
  id text primary key,
  title text not null,
  summary text,
  context text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.issues (
  id text primary key,
  dossier_id text not null references public.dossiers(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_documents (
  id text primary key default gen_random_uuid()::text,
  kind public.source_kind not null,
  title text not null,
  url text,
  party_id text references public.parties(id),
  politician_id text references public.politicians(id),
  published_at date,
  retrieved_at timestamptz not null default now(),
  raw_storage_path text,
  raw_text text,
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.extracted_passages (
  id text primary key default gen_random_uuid()::text,
  source_document_id text not null references public.source_documents(id) on delete cascade,
  dossier_id text references public.dossiers(id),
  issue_id text references public.issues(id),
  quote text not null,
  page_number integer,
  start_offset integer,
  end_offset integer,
  extraction_method text not null default 'manual',
  confidence numeric(4, 3) check (confidence is null or confidence between 0 and 1),
  created_at timestamptz not null default now()
);

create table public.candidate_positions (
  id text primary key default gen_random_uuid()::text,
  dossier_id text not null references public.dossiers(id),
  issue_id text references public.issues(id),
  party_id text not null references public.parties(id),
  politician_id text references public.politicians(id),
  position public.position_direction not null default 'unknown',
  statement text not null,
  explanation text,
  how text,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  source_document_id text references public.source_documents(id),
  source_passage_id text references public.extracted_passages(id),
  source_quote text,
  confidence text not null default 'medium',
  review_status public.review_status not null default 'needs_human_review',
  extraction_method text not null default 'manual',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approved_positions (
  id text primary key default gen_random_uuid()::text,
  candidate_position_id text references public.candidate_positions(id),
  dossier_id text not null references public.dossiers(id),
  issue_id text references public.issues(id),
  party_id text not null references public.parties(id),
  politician_id text references public.politicians(id),
  position public.position_direction not null,
  statement text not null,
  explanation text,
  how text,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  source_document_id text references public.source_documents(id),
  source_passage_id text references public.extracted_passages(id),
  source_quote text,
  approved_by text,
  approved_at timestamptz not null default now(),
  version integer not null default 1,
  is_current boolean not null default true
);

create table public.kamer_votes (
  id uuid primary key default gen_random_uuid(),
  external_zaak_id text not null,
  external_besluit_id text,
  dossier_id text references public.dossiers(id),
  issue_id text references public.issues(id),
  zaak_number text,
  parliamentary_year text,
  zaak_type text,
  title text not null,
  source_url text,
  voted_at timestamptz,
  outcome text,
  party_id text references public.parties(id),
  vote public.vote_choice not null default 'unknown',
  seats integer,
  raw_vote jsonb not null default '{}'::jsonb,
  review_status public.review_status not null default 'needs_human_review',
  imported_at timestamptz not null default now(),
  unique (external_zaak_id, external_besluit_id, party_id)
);

create table public.promise_checks (
  id text primary key default gen_random_uuid()::text,
  dossier_id text references public.dossiers(id),
  issue_id text references public.issues(id),
  party_id text references public.parties(id),
  politician_id text references public.politicians(id),
  promise_position_id text references public.approved_positions(id),
  kamer_vote_id uuid references public.kamer_votes(id),
  promise text not null,
  vote_title text,
  verdict public.promise_verdict not null default 'unclear',
  severity integer not null default 1 check (severity between 1 and 5),
  explanation text,
  review_status public.review_status not null default 'needs_human_review',
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_logs (
  id uuid primary key default gen_random_uuid(),
  entity_table text not null,
  entity_id text not null,
  action text not null,
  previous_status text,
  next_status text,
  reviewer_id text,
  notes text,
  diff jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.correction_ledger (
  id uuid primary key default gen_random_uuid(),
  public_entity_table text not null,
  public_entity_id text not null,
  title text not null,
  correction text not null,
  reason text,
  source_url text,
  corrected_by text,
  corrected_at timestamptz not null default now()
);

create index idx_candidate_positions_review on public.candidate_positions (review_status, dossier_id, party_id);
create index idx_approved_positions_public on public.approved_positions (is_current, dossier_id, party_id);
create index idx_kamer_votes_dossier_party on public.kamer_votes (dossier_id, party_id);
create index idx_promise_checks_party_verdict on public.promise_checks (party_id, verdict, review_status);
create index idx_extracted_passages_source on public.extracted_passages (source_document_id);

