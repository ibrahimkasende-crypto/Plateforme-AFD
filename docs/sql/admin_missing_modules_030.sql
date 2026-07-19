-- Modules admin manquants : tables métier + colonnes demo sur tables existantes.

create extension if not exists pgcrypto;

-- Colonnes is_demo / demo_batch_id sur tables existantes
do $$
declare
  tbl text;
begin
  foreach tbl in array array['messages', 'membres', 'dons', 'clusters']
  loop
    if to_regclass(format('public.%I', tbl)) is not null then
      execute format(
        'alter table public.%I add column if not exists is_demo boolean not null default false',
        tbl
      );
      execute format(
        'alter table public.%I add column if not exists demo_batch_id text',
        tbl
      );
    end if;
  end loop;
end $$;

-- Helper RLS générique admin
create or replace function public._admin_table_policies(p_table regclass)
returns void
language plpgsql
as $$
declare
  tname text := p_table::text;
begin
  execute format('alter table %s enable row level security', p_table);
  execute format('drop policy if exists "Admin select %1$s" on %1$s', tname);
  execute format(
    'create policy "Admin select %1$s" on %1$s for select to authenticated using (true)',
    tname
  );
  execute format('drop policy if exists "Admin insert %1$s" on %1$s', tname);
  execute format(
    'create policy "Admin insert %1$s" on %1$s for insert to authenticated with check (true)',
    tname
  );
  execute format('drop policy if exists "Admin update %1$s" on %1$s', tname);
  execute format(
    'create policy "Admin update %1$s" on %1$s for update to authenticated using (true) with check (true)',
    tname
  );
end;
$$;

-- 1. activites
create table if not exists public.activites (
  id uuid primary key default gen_random_uuid(),
  projet_id uuid,
  programme_id uuid,
  type text not null default 'autre',
  title text not null,
  description text,
  activity_date date,
  province text,
  location text,
  femmes integer not null default 0,
  hommes integer not null default 0,
  enfants integer not null default 0,
  jeunes integer not null default 0,
  total integer not null default 0,
  status text not null default 'planifiee',
  active boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. beneficiaires_agregats
create table if not exists public.beneficiaires_agregats (
  id uuid primary key default gen_random_uuid(),
  periode date not null,
  programme_id uuid,
  projet_id uuid,
  province text,
  femmes integer not null default 0,
  hommes integer not null default 0,
  enfants integer not null default 0,
  jeunes integer not null default 0,
  total integer not null default 0,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 3. urgences
create table if not exists public.urgences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  summary text,
  status text not null default 'active' check (status in ('active', 'closed')),
  province text,
  started_at date,
  ended_at date,
  active boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists urgences_slug_key on public.urgences (slug);

-- 4. newsletter_campagnes
create table if not exists public.newsletter_campagnes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'programmee', 'envoyee')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 5. newsletter_modeles
create table if not exists public.newsletter_modeles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  active boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 6. finances_budgets
create table if not exists public.finances_budgets (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  programme_id uuid,
  projet_id uuid,
  period_start date,
  period_end date,
  amount_planned numeric not null default 0,
  currency text not null default 'USD',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 7. finances_depenses
create table if not exists public.finances_depenses (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  budget_id uuid references public.finances_budgets (id) on delete set null,
  programme_id uuid,
  projet_id uuid,
  amount numeric not null default 0,
  spent_at date,
  status text not null default 'enregistree',
  currency text not null default 'USD',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 8. rapports_generes
create table if not exists public.rapports_generes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'activite',
  status text not null default 'brouillon',
  period_start date,
  period_end date,
  file_url text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 9. departements
create table if not exists public.departements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- 10. partenariats_demandes
create table if not exists public.partenariats_demandes (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_email text not null,
  message text not null default '',
  status text not null default 'nouveau',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- RLS sur nouvelles tables
select public._admin_table_policies('public.activites'::regclass);
select public._admin_table_policies('public.beneficiaires_agregats'::regclass);
select public._admin_table_policies('public.urgences'::regclass);
select public._admin_table_policies('public.newsletter_campagnes'::regclass);
select public._admin_table_policies('public.newsletter_modeles'::regclass);
select public._admin_table_policies('public.finances_budgets'::regclass);
select public._admin_table_policies('public.finances_depenses'::regclass);
select public._admin_table_policies('public.rapports_generes'::regclass);
select public._admin_table_policies('public.departements'::regclass);
select public._admin_table_policies('public.partenariats_demandes'::regclass);

drop function if exists public._admin_table_policies(regclass);
