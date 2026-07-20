-- LISUNGI multi-organisation foundations (progressive, non-destructive).
-- Organisation initiale AFD ASBL — UUID stable partagé avec src/config/organization-brand.ts

-- ---------------------------------------------------------------------------
-- Identifiant stable AFD (ne pas régénérer dans d'autres migrations)
-- ---------------------------------------------------------------------------
-- a0000000-0000-4000-8000-000000000afd

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key,
  name text not null,
  short_name text not null,
  legal_name text not null,
  slug text not null unique,
  domain text,
  logo_bucket text,
  logo_path text,
  primary_color text,
  secondary_color text,
  status text not null default 'active'
    check (status in ('active', 'suspended', 'archived', 'pilot')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_status_idx on public.organizations (status);
create index if not exists organizations_domain_idx on public.organizations (domain);

-- ---------------------------------------------------------------------------
-- organization_branding
-- ---------------------------------------------------------------------------
create table if not exists public.organization_branding (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  logo_url text,
  favicon_url text,
  primary_color text,
  secondary_color text,
  accent_color text,
  report_header_html text,
  report_footer_html text,
  email_footer_text text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- organization_memberships
-- ---------------------------------------------------------------------------
create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'employe',
  status text not null default 'active'
    check (status in ('active', 'invited', 'suspended', 'revoked')),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_memberships_user_idx
  on public.organization_memberships (user_id);
create index if not exists organization_memberships_org_status_idx
  on public.organization_memberships (organization_id, status);

-- ---------------------------------------------------------------------------
-- organization_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- subscription_plans / organization_subscriptions / feature_entitlements
-- ---------------------------------------------------------------------------
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_internal boolean not null default false,
  max_users integer,
  max_storage_gb integer,
  modules jsonb not null default '[]'::jsonb,
  limits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid not null references public.subscription_plans (id),
  status text not null default 'active'
    check (status in ('active', 'trial', 'past_due', 'cancelled', 'pilot')),
  started_at date,
  renews_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_subscriptions_org_idx
  on public.organization_subscriptions (organization_id);

create table if not exists public.feature_entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feature_code text not null,
  enabled boolean not null default true,
  limits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, feature_code)
);

-- ---------------------------------------------------------------------------
-- Seed AFD + plan pilote
-- ---------------------------------------------------------------------------
insert into public.organizations (
  id, name, short_name, legal_name, slug, domain,
  logo_path, primary_color, secondary_color, status
) values (
  'a0000000-0000-4000-8000-000000000afd',
  'Alliance des Femmes pour le Développement',
  'AFD',
  'Alliance des Femmes pour le Développement — AFD ASBL',
  'afd',
  'afd-rdc.org',
  '/assets/brand/Logo_AFD.jpeg',
  '#034ea2',
  '#e31c79',
  'pilot'
)
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  legal_name = excluded.legal_name,
  slug = excluded.slug,
  domain = excluded.domain,
  updated_at = now();

insert into public.organization_branding (
  organization_id, logo_url, primary_color, secondary_color,
  report_footer_html
) values (
  'a0000000-0000-4000-8000-000000000afd',
  '/assets/brand/Logo_AFD.jpeg',
  '#034ea2',
  '#e31c79',
  'Généré avec LISUNGI — un produit Lisungi Hub'
)
on conflict (organization_id) do nothing;

insert into public.organization_settings (organization_id, settings)
values (
  'a0000000-0000-4000-8000-000000000afd',
  jsonb_build_object('tenant_label', 'Organisation active', 'locale', 'fr-CD')
)
on conflict (organization_id) do nothing;

insert into public.subscription_plans (code, name, description, is_internal, modules, limits)
values (
  'pilot_internal',
  'Pilote interne',
  'Plan pilote LISUNGI pour l’organisation AFD — aucun montant commercial.',
  true,
  '["operations","impact","communication","engagement","rh","finances","rapports"]'::jsonb,
  '{"blocks_access": false}'::jsonb
)
on conflict (code) do nothing;

insert into public.organization_subscriptions (
  organization_id, plan_id, status, started_at, renews_at, notes
)
select
  'a0000000-0000-4000-8000-000000000afd',
  p.id,
  'pilot',
  '2026-01-01',
  '2027-01-01',
  'Abonnement pilote — ne bloque pas l’accès AFD'
from public.subscription_plans p
where p.code = 'pilot_internal'
  and not exists (
    select 1 from public.organization_subscriptions s
    where s.organization_id = 'a0000000-0000-4000-8000-000000000afd'
  );

-- ---------------------------------------------------------------------------
-- Helpers membership / isolation (préparation RLS)
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = p_org_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function public.user_organization_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.organization_id
  from public.organization_memberships m
  where m.user_id = auth.uid()
    and m.status = 'active';
$$;

revoke all on function public.is_org_member(uuid) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
revoke all on function public.user_organization_ids() from public;
grant execute on function public.user_organization_ids() to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_branding enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.organization_settings enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.organization_subscriptions enable row level security;
alter table public.feature_entitlements enable row level security;

-- Lecture : membres de l’organisation uniquement
drop policy if exists organizations_select_member on public.organizations;
create policy organizations_select_member on public.organizations
  for select to authenticated
  using (public.is_org_member(id) or public.has_role('platform_owner') or public.has_role('platform_admin'));

drop policy if exists organization_branding_select_member on public.organization_branding;
create policy organization_branding_select_member on public.organization_branding
  for select to authenticated
  using (public.is_org_member(organization_id));

drop policy if exists organization_memberships_select_own on public.organization_memberships;
create policy organization_memberships_select_own on public.organization_memberships
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_org_member(organization_id)
  );

drop policy if exists organization_settings_select_member on public.organization_settings;
create policy organization_settings_select_member on public.organization_settings
  for select to authenticated
  using (public.is_org_member(organization_id));

drop policy if exists subscription_plans_select_authenticated on public.subscription_plans;
create policy subscription_plans_select_authenticated on public.subscription_plans
  for select to authenticated
  using (true);

drop policy if exists organization_subscriptions_select_member on public.organization_subscriptions;
create policy organization_subscriptions_select_member on public.organization_subscriptions
  for select to authenticated
  using (public.is_org_member(organization_id));

drop policy if exists feature_entitlements_select_member on public.feature_entitlements;
create policy feature_entitlements_select_member on public.feature_entitlements
  for select to authenticated
  using (public.is_org_member(organization_id));

-- Backfill memberships pour profils admin existants → AFD
insert into public.organization_memberships (organization_id, user_id, role, status, is_default)
select
  'a0000000-0000-4000-8000-000000000afd',
  p.id,
  coalesce(
    (
      select r.nom
      from public.utilisateurs_roles ur
      join public.roles r on r.id = ur.role_id
      where ur.utilisateur_id = p.id
      order by case when r.nom in ('super_admin', 'administrateur', 'platform_owner') then 0 else 1 end
      limit 1
    ),
    'administrateur'
  ),
  'active',
  true
from public.profils_administrateurs p
where coalesce(p.actif, true) = true
on conflict (organization_id, user_id) do nothing;

-- Rôles plateforme (catalogue) — ne confèrent pas d’accès org silencieux
insert into public.roles (nom, description) values
  ('platform_owner', 'Propriétaire Lisungi Hub'),
  ('platform_admin', 'Administrateur plateforme Lisungi Hub'),
  ('support_agent', 'Support Lisungi Hub (accès journalisé requis)'),
  ('billing_admin', 'Facturation Lisungi Hub'),
  ('tenant_owner', 'Propriétaire organisation cliente'),
  ('tenant_super_admin', 'Super administrateur organisation cliente')
on conflict (nom) do nothing;

comment on table public.organizations is 'Organisations clientes LISUNGI (multi-tenant)';
comment on column public.organizations.id is 'UUID stable — AFD = a0000000-0000-4000-8000-000000000afd';
