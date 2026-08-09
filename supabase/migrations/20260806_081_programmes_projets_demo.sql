-- Tables programmes / projets pour carte RDC + seed démo client
-- Idempotent : crée si absentes, ajoute colonnes démo.

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  long_description text not null default '',
  icon text,
  color text,
  image_url text,
  "order" integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.projets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  location text not null default '',
  program_id uuid references public.programmes (id) on delete set null,
  status text,
  budget numeric,
  beneficiaries integer,
  start_date date,
  end_date date,
  results text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.programmes add column if not exists is_demo boolean not null default false;
alter table public.programmes add column if not exists demo_batch_id text;
alter table public.programmes add column if not exists demo_source text;

alter table public.projets add column if not exists is_demo boolean not null default false;
alter table public.projets add column if not exists demo_batch_id text;
alter table public.projets add column if not exists demo_source text;

create index if not exists programmes_active_idx on public.programmes (active);
create index if not exists projets_active_idx on public.projets (active);
create index if not exists projets_location_idx on public.projets (location);
create index if not exists projets_demo_batch_idx on public.projets (demo_batch_id);

alter table public.programmes enable row level security;
alter table public.projets enable row level security;

drop policy if exists "programmes_select_public" on public.programmes;
create policy "programmes_select_public"
  on public.programmes for select
  to anon, authenticated
  using (active = true);

drop policy if exists "projets_select_public" on public.projets;
create policy "projets_select_public"
  on public.projets for select
  to anon, authenticated
  using (active = true);

-- Lecture admin (service_role ignore RLS)
