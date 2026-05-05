-- Blind Democracy auth roles and row level security
-- Client-side route guards are UX only. These policies are the real production boundary.

create type public.app_role as enum (
  'admin',
  'moderator',
  'viewer'
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = any(required_roles)
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin');
$$;

create or replace function public.can_review()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin', 'moderator']::public.app_role[]);
$$;

create or replace function public.can_view_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(array['admin', 'moderator', 'viewer']::public.app_role[]);
$$;

create policy "Admins can manage roles"
  on public.user_roles
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can read their own roles"
  on public.user_roles
  for select
  using (user_id = auth.uid());

-- Public reference data
alter table public.parties enable row level security;
alter table public.politicians enable row level security;
alter table public.dossiers enable row level security;
alter table public.issues enable row level security;
alter table public.approved_positions enable row level security;
alter table public.correction_ledger enable row level security;

create policy "Public can read parties"
  on public.parties for select
  using (true);

create policy "Admins can manage parties"
  on public.parties for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read politicians"
  on public.politicians for select
  using (true);

create policy "Admins can manage politicians"
  on public.politicians for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read dossiers"
  on public.dossiers for select
  using (true);

create policy "Admins can manage dossiers"
  on public.dossiers for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read issues"
  on public.issues for select
  using (true);

create policy "Admins can manage issues"
  on public.issues for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Public can read current approved positions"
  on public.approved_positions for select
  using (is_current = true);

create policy "Reviewers can manage approved positions"
  on public.approved_positions for all
  using (public.can_review())
  with check (public.can_review());

create policy "Public can read correction ledger"
  on public.correction_ledger for select
  using (true);

create policy "Reviewers can manage correction ledger"
  on public.correction_ledger for all
  using (public.can_review())
  with check (public.can_review());

-- Admin/review-only data
alter table public.source_documents enable row level security;
alter table public.extracted_passages enable row level security;
alter table public.candidate_positions enable row level security;
alter table public.review_logs enable row level security;

create policy "Admin viewers can read source documents"
  on public.source_documents for select
  using (public.can_view_admin());

create policy "Reviewers can manage source documents"
  on public.source_documents for all
  using (public.can_review())
  with check (public.can_review());

create policy "Admin viewers can read extracted passages"
  on public.extracted_passages for select
  using (public.can_view_admin());

create policy "Reviewers can manage extracted passages"
  on public.extracted_passages for all
  using (public.can_review())
  with check (public.can_review());

create policy "Admin viewers can read candidate positions"
  on public.candidate_positions for select
  using (public.can_view_admin());

create policy "Reviewers can manage candidate positions"
  on public.candidate_positions for all
  using (public.can_review())
  with check (public.can_review());

create policy "Admin viewers can read review logs"
  on public.review_logs for select
  using (public.can_view_admin());

create policy "Reviewers can insert review logs"
  on public.review_logs for insert
  with check (public.can_review());

-- Mixed public/admin data: only reviewed rows are public
alter table public.kamer_votes enable row level security;
alter table public.promise_checks enable row level security;

create policy "Public can read approved Kamer votes"
  on public.kamer_votes for select
  using (review_status = 'approved');

create policy "Reviewers can manage Kamer votes"
  on public.kamer_votes for all
  using (public.can_review())
  with check (public.can_review());

create policy "Public can read approved promise checks"
  on public.promise_checks for select
  using (review_status = 'approved');

create policy "Reviewers can manage promise checks"
  on public.promise_checks for all
  using (public.can_review())
  with check (public.can_review());

