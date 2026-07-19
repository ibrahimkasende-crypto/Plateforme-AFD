-- Vague 3–8 — consolidations finance, indicateurs, sync enquêtes, agents, santé
-- Migration progressive non destructive.

-- ---------------------------------------------------------------------------
-- Finances : versions budget, transactions, rapprochement
-- ---------------------------------------------------------------------------
alter table public.finances_budgets
  add column if not exists version_num integer not null default 1,
  add column if not exists statut text not null default 'brouillon',
  add column if not exists parent_budget_id uuid references public.finances_budgets(id),
  add column if not exists notes text,
  add column if not exists updated_at timestamptz not null default now();

do $$ begin
  alter table public.finances_budgets
    drop constraint if exists finances_budgets_statut_check;
  alter table public.finances_budgets
    add constraint finances_budgets_statut_check
    check (statut in ('brouillon','soumis','approuve','amende','cloture'));
exception when others then null;
end $$;

alter table public.finances_depenses
  add column if not exists justification text,
  add column if not exists fournisseur text,
  add column if not exists reference_paiement text,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists approved_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

do $$ begin
  alter table public.finances_depenses
    drop constraint if exists finances_depenses_status_check;
  alter table public.finances_depenses
    add constraint finances_depenses_status_check
    check (status in ('brouillon','soumise','approuvee','rejetee','payee','annulee','enregistree'));
exception when others then null;
end $$;

create table if not exists public.finances_transactions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  type text not null check (type in ('debit','credit')),
  canal text not null default 'banque'
    check (canal in ('caisse','banque','mobile_money','autre')),
  montant numeric not null check (montant > 0),
  devise text not null default 'USD',
  libelle text not null,
  depense_id uuid references public.finances_depenses(id) on delete set null,
  statut text not null default 'enregistree'
    check (statut in ('enregistree','rapprochee','annulee')),
  reference_externe text,
  occurred_at date not null default current_date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create unique index if not exists finances_transactions_ref_ext_uidx
  on public.finances_transactions (reference_externe)
  where reference_externe is not null;

-- ---------------------------------------------------------------------------
-- Indicateurs : valeurs périodiques liées projets
-- ---------------------------------------------------------------------------
create table if not exists public.indicateur_valeurs (
  id uuid primary key default gen_random_uuid(),
  chiffre_impact_id uuid references public.chiffres_impact(id) on delete cascade,
  projet_id uuid,
  programme_id uuid,
  periode date not null,
  valeur numeric not null,
  baseline numeric,
  cible numeric,
  source text,
  methode text,
  statut text not null default 'brouillon'
    check (statut in ('brouillon','soumis','valide','rejete')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

-- ---------------------------------------------------------------------------
-- Enquêtes : file de synchronisation hors-ligne
-- ---------------------------------------------------------------------------
create table if not exists public.enquete_sync_queue (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes(id) on delete cascade,
  idempotency_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  statut text not null default 'pending'
    check (statut in ('pending','processing','synced','conflict','failed')),
  device_id text,
  agent_id uuid,
  error_message text,
  created_at timestamptz not null default now(),
  synced_at timestamptz,
  is_demo boolean not null default false,
  demo_batch_id text
);

-- ---------------------------------------------------------------------------
-- Agents terrain : appareils
-- ---------------------------------------------------------------------------
create table if not exists public.agent_appareils (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents_terrain(id) on delete cascade,
  device_label text not null,
  device_fingerprint text not null,
  statut text not null default 'actif'
    check (statut in ('actif','revoque','expire')),
  last_sync_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text,
  unique (agent_id, device_fingerprint)
);

-- ---------------------------------------------------------------------------
-- Témoignages : consentement
-- ---------------------------------------------------------------------------
create table if not exists public.temoignage_consentements (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid,
  titre text not null,
  consentement_accorde boolean not null default false,
  anonymise boolean not null default false,
  retire_at timestamptz,
  projet_id uuid,
  province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

-- ---------------------------------------------------------------------------
-- Santé système : snapshots connus uniquement
-- ---------------------------------------------------------------------------
create table if not exists public.system_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  checked_at timestamptz not null default now(),
  database_ok boolean,
  storage_ok boolean,
  jobs_pending integer not null default 0,
  jobs_failed integer not null default 0,
  app_version text,
  notes text,
  created_by uuid references auth.users(id)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
select public._afd_replace_admin_policies('finances_transactions', 'finances:read', 'finances:write');
select public._afd_replace_admin_policies('indicateur_valeurs', 'indicateurs:read', 'indicateurs:write');
select public._afd_replace_admin_policies('enquete_sync_queue', 'enquetes:read', 'enquetes:write');
select public._afd_replace_admin_policies('agent_appareils', 'agents:read', 'agents:write');
select public._afd_replace_admin_policies('temoignage_consentements', 'temoignages:write', 'temoignages:write');
select public._afd_replace_admin_policies('system_health_snapshots', 'parametres:manage', 'parametres:manage');
