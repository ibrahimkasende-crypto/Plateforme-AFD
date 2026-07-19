-- Vague 2 — Opérations : inventaires, clusters (membres/réunions), sitreps urgences, seed entrepôts
-- Migration progressive non destructive.

-- ---------------------------------------------------------------------------
-- Clusters (table canonique si absente du schéma lié)
-- ---------------------------------------------------------------------------
create table if not exists public.clusters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type text,
  icon text,
  "order" integer not null default 0,
  active boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

select public._afd_replace_admin_policies('clusters', 'clusters:read', 'clusters:write');

-- ---------------------------------------------------------------------------
-- Stocks : inventaires
-- ---------------------------------------------------------------------------
create table if not exists public.stock_inventaires (
  id uuid primary key default gen_random_uuid(),
  entrepot_id uuid not null references public.stock_entrepots(id),
  reference text not null unique,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'valide', 'annule')),
  note text,
  created_by uuid references auth.users(id),
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.stock_inventaire_lignes (
  id uuid primary key default gen_random_uuid(),
  inventaire_id uuid not null references public.stock_inventaires(id) on delete cascade,
  article_id uuid not null references public.stock_articles(id),
  quantite_comptee numeric not null check (quantite_comptee >= 0),
  quantite_systeme numeric,
  ecart numeric,
  unique (inventaire_id, article_id)
);

-- ---------------------------------------------------------------------------
-- Clusters : membres + réunions
-- ---------------------------------------------------------------------------
create table if not exists public.cluster_membres (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.clusters(id) on delete cascade,
  nom text not null,
  role text,
  email text,
  organisation text,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.cluster_reunions (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references public.clusters(id) on delete cascade,
  titre text not null,
  date_reunion date not null default current_date,
  decisions text,
  actions text,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

-- ---------------------------------------------------------------------------
-- Urgences : situation reports
-- ---------------------------------------------------------------------------
create table if not exists public.urgence_sitreps (
  id uuid primary key default gen_random_uuid(),
  urgence_id uuid not null references public.urgences(id) on delete cascade,
  titre text not null,
  contenu text not null default '',
  population_affectee integer,
  besoins text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

-- ---------------------------------------------------------------------------
-- Logistique : lignes de demande
-- ---------------------------------------------------------------------------
create table if not exists public.logistique_demande_lignes (
  id uuid primary key default gen_random_uuid(),
  demande_id uuid not null references public.logistique_demandes(id) on delete cascade,
  article_id uuid references public.stock_articles(id),
  designation text not null,
  quantite numeric not null check (quantite > 0),
  unite_code text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Seed entrepôts de base (idempotent)
-- ---------------------------------------------------------------------------
insert into public.stock_entrepots (code, nom, province, actif, is_demo, demo_batch_id)
values
  ('KIN-HQ', 'Entrepôt Kinshasa HQ', 'Kinshasa', true, true, 'afd-ops-wave2-seed'),
  ('GOM-EST', 'Entrepôt Goma Est', 'Nord-Kivu', true, true, 'afd-ops-wave2-seed')
on conflict (code) do nothing;

insert into public.stock_categories (code, nom, actif, is_demo, demo_batch_id)
values
  ('ALIM', 'Alimentaire', true, true, 'afd-ops-wave2-seed'),
  ('NFI', 'Articles non alimentaires', true, true, 'afd-ops-wave2-seed'),
  ('MED', 'Médical', true, true, 'afd-ops-wave2-seed'),
  ('LOG', 'Logistique', true, true, 'afd-ops-wave2-seed')
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
select public._afd_replace_admin_policies('stock_inventaires', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('stock_inventaire_lignes', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('cluster_membres', 'clusters:read', 'clusters:write');
select public._afd_replace_admin_policies('cluster_reunions', 'clusters:read', 'clusters:write');
select public._afd_replace_admin_policies('urgence_sitreps', 'urgences:read', 'urgences:write');
select public._afd_replace_admin_policies('logistique_demande_lignes', 'logistique:read', 'logistique:write');
