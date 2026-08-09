-- Colonnes de démonstration pour contenus publics / dashboard.
-- Idempotent : safe si déjà présentes.

alter table if exists public.actualites
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.programmes
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.projets
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.activites
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.partenaires
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.chiffres_impact
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.finances_budgets
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;

alter table if exists public.finances_depenses
  add column if not exists is_demo boolean not null default false,
  add column if not exists demo_batch_id text,
  add column if not exists demo_source text;
