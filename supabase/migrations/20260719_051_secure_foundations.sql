-- Vague 1 — Fondations sécurisées (non destructif).
-- Remplace les politiques USING (true) des tables 030.
-- Ajoute workflows, jobs, notifications, référentiels, vue audit canonique.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. has_permission / has_role : platform_owner = super_admin
-- ---------------------------------------------------------------------------
create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.utilisateurs_roles ur
    join public.roles r on r.id = ur.role_id
    join public.profils_administrateurs pa on pa.id = ur.utilisateur_id
    where ur.utilisateur_id = auth.uid()
      and pa.actif
      and (
        r.nom = role_name
        or (role_name = 'super_admin' and r.nom = 'platform_owner')
      )
  );
$$;

create or replace function public.has_permission(permission_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin')
  or public.has_role('platform_owner')
  or exists (
    select 1
    from public.utilisateurs_roles ur
    join public.profils_administrateurs pa on pa.id = ur.utilisateur_id
    join public.roles_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.utilisateur_id = auth.uid()
      and pa.actif
      and p.nom = permission_name
  );
$$;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profils_administrateurs pa
    join public.utilisateurs_roles ur on ur.utilisateur_id = pa.id
    where pa.id = auth.uid()
      and pa.actif = true
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Remplacer politiques permissives tables 030
-- ---------------------------------------------------------------------------
create or replace function public._afd_replace_admin_policies(
  p_table text,
  p_read_perm text,
  p_write_perm text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regclass(format('public.%I', p_table)) is null then
    return;
  end if;

  execute format('alter table public.%I enable row level security', p_table);

  -- Anciennes politiques 030 (noms variables selon cast regclass)
  execute format('drop policy if exists %I on public.%I', 'Admin select public.' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'Admin insert public.' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'Admin update public.' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'Admin select ' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'Admin insert ' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'Admin update ' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'afd_select_' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'afd_insert_' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'afd_update_' || p_table, p_table);
  execute format('drop policy if exists %I on public.%I', 'afd_delete_' || p_table, p_table);

  execute format(
    'create policy %I on public.%I for select to authenticated using (public.has_permission(%L) or public.is_active_admin())',
    'afd_select_' || p_table, p_table, p_read_perm
  );
  execute format(
    'create policy %I on public.%I for insert to authenticated with check (public.has_permission(%L))',
    'afd_insert_' || p_table, p_table, p_write_perm
  );
  execute format(
    'create policy %I on public.%I for update to authenticated using (public.has_permission(%L)) with check (public.has_permission(%L))',
    'afd_update_' || p_table, p_table, p_write_perm, p_write_perm
  );
  execute format(
    'create policy %I on public.%I for delete to authenticated using (public.has_permission(%L) and (public.has_role(''super_admin'') or public.has_role(''platform_owner'')))',
    'afd_delete_' || p_table, p_table, p_write_perm
  );
end;
$$;

select public._afd_replace_admin_policies('activites', 'activites:read', 'activites:write');
select public._afd_replace_admin_policies('beneficiaires_agregats', 'beneficiaires:read', 'beneficiaires:write');
select public._afd_replace_admin_policies('urgences', 'urgences:read', 'urgences:write');
select public._afd_replace_admin_policies('newsletter_campagnes', 'newsletter:read', 'newsletter:write');
select public._afd_replace_admin_policies('newsletter_modeles', 'newsletter:read', 'newsletter:write');
select public._afd_replace_admin_policies('finances_budgets', 'finances:read', 'finances:write');
select public._afd_replace_admin_policies('finances_depenses', 'finances:read', 'finances:write');
select public._afd_replace_admin_policies('rapports_generes', 'rapports:read', 'rapports:write');
select public._afd_replace_admin_policies('departements', 'equipe:read', 'equipe:write');
select public._afd_replace_admin_policies('partenariats_demandes', 'partenaires:read', 'partenaires:write');

-- Permissions urgences / clusters si absentes
insert into public.permissions (nom, description) values
  ('urgences:read', 'Lire les urgences'),
  ('urgences:write', 'Modifier les urgences'),
  ('clusters:read', 'Lire les clusters'),
  ('clusters:write', 'Modifier les clusters'),
  ('stocks:read', 'Lire les stocks'),
  ('stocks:write', 'Modifier les stocks'),
  ('logistique:read', 'Lire la logistique'),
  ('logistique:write', 'Modifier la logistique'),
  ('workflows:manage', 'Gérer les workflows'),
  ('jobs:manage', 'Gérer les jobs asynchrones'),
  ('notifications:manage', 'Gérer les notifications')
on conflict (nom) do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('super_admin', 'platform_owner')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 3. Référentiels partagés
-- ---------------------------------------------------------------------------
create table if not exists public.ref_provinces (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ref_devises (
  code text primary key,
  nom text not null,
  symbole text,
  actif boolean not null default true
);

create table if not exists public.ref_unites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  actif boolean not null default true
);

create table if not exists public.ref_statuts (
  id uuid primary key default gen_random_uuid(),
  domaine text not null,
  code text not null,
  label text not null,
  ordre int not null default 0,
  unique (domaine, code)
);

insert into public.ref_devises (code, nom, symbole) values
  ('USD', 'Dollar américain', '$'),
  ('CDF', 'Franc congolais', 'FC'),
  ('EUR', 'Euro', '€')
on conflict (code) do nothing;

insert into public.ref_provinces (code, nom) values
  ('KIN', 'Kinshasa'),
  ('NK', 'Nord-Kivu'),
  ('SK', 'Sud-Kivu'),
  ('IT', 'Ituri'),
  ('HK', 'Haut-Katanga'),
  ('KS', 'Kasaï'),
  ('KG', 'Kongo-Central'),
  ('TP', 'Tanganyika')
on conflict (code) do nothing;

insert into public.ref_unites (code, nom) values
  ('u', 'Unité'),
  ('kg', 'Kilogramme'),
  ('l', 'Litre'),
  ('carton', 'Carton'),
  ('kit', 'Kit')
on conflict (code) do nothing;

alter table public.ref_provinces enable row level security;
alter table public.ref_devises enable row level security;
alter table public.ref_unites enable row level security;
alter table public.ref_statuts enable row level security;

drop policy if exists ref_provinces_select on public.ref_provinces;
create policy ref_provinces_select on public.ref_provinces for select to authenticated
  using (public.is_active_admin());
drop policy if exists ref_devises_select on public.ref_devises;
create policy ref_devises_select on public.ref_devises for select to authenticated
  using (public.is_active_admin());
drop policy if exists ref_unites_select on public.ref_unites;
create policy ref_unites_select on public.ref_unites for select to authenticated
  using (public.is_active_admin());
drop policy if exists ref_statuts_select on public.ref_statuts;
create policy ref_statuts_select on public.ref_statuts for select to authenticated
  using (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- 4. Workflows & approbations
-- ---------------------------------------------------------------------------
create table if not exists public.workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  module text not null,
  nom text not null,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_states (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_definitions(id) on delete cascade,
  code text not null,
  label text not null,
  is_terminal boolean not null default false,
  unique (workflow_id, code)
);

create table if not exists public.workflow_transitions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_definitions(id) on delete cascade,
  from_state text not null,
  to_state text not null,
  action_code text not null,
  required_permission text,
  unique (workflow_id, from_state, to_state, action_code)
);

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  entity_type text not null,
  entity_id uuid not null,
  workflow_code text not null,
  current_state text not null default 'brouillon',
  requested_by uuid references auth.users(id),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.approval_decisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.approval_requests(id) on delete cascade,
  actor_id uuid references auth.users(id),
  from_state text not null,
  to_state text not null,
  action_code text not null,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.approval_requests(id) on delete cascade,
  from_state text,
  to_state text not null,
  actor_id uuid,
  action_code text,
  comment text,
  created_at timestamptz not null default now()
);

insert into public.workflow_definitions (code, module, nom) values
  ('generic_publish', 'shared', 'Publication générique'),
  ('expense_approval', 'finances', 'Approbation dépense'),
  ('payroll_approval', 'payroll', 'Approbation paie'),
  ('ocr_apply', 'ocr', 'Application OCR')
on conflict (code) do nothing;

insert into public.workflow_states (workflow_id, code, label, is_terminal)
select w.id, s.code, s.label, s.term
from public.workflow_definitions w
cross join (values
  ('brouillon', 'Brouillon', false),
  ('soumis', 'Soumis', false),
  ('en_revision', 'En révision', false),
  ('approuve', 'Approuvé', false),
  ('publie', 'Publié', true),
  ('rejete', 'Rejeté', true),
  ('archive', 'Archivé', true)
) as s(code, label, term)
where w.code = 'generic_publish'
on conflict do nothing;

insert into public.workflow_transitions (workflow_id, from_state, to_state, action_code, required_permission)
select w.id, t.fs, t.ts, t.ac, t.perm
from public.workflow_definitions w
cross join (values
  ('brouillon', 'soumis', 'submit', null),
  ('soumis', 'en_revision', 'start_review', null),
  ('en_revision', 'approuve', 'approve', null),
  ('en_revision', 'rejete', 'reject', null),
  ('approuve', 'publie', 'publish', null),
  ('publie', 'archive', 'archive', null)
) as t(fs, ts, ac, perm)
where w.code = 'generic_publish'
on conflict do nothing;

alter table public.workflow_definitions enable row level security;
alter table public.workflow_states enable row level security;
alter table public.workflow_transitions enable row level security;
alter table public.approval_requests enable row level security;
alter table public.approval_decisions enable row level security;
alter table public.workflow_history enable row level security;

drop policy if exists wf_def_select on public.workflow_definitions;
create policy wf_def_select on public.workflow_definitions for select to authenticated
  using (public.is_active_admin());
drop policy if exists wf_req_all on public.approval_requests;
create policy wf_req_all on public.approval_requests for all to authenticated
  using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists wf_dec_all on public.approval_decisions;
create policy wf_dec_all on public.approval_decisions for all to authenticated
  using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists wf_hist_select on public.workflow_history;
create policy wf_hist_select on public.workflow_history for select to authenticated
  using (public.is_active_admin());
drop policy if exists wf_hist_insert on public.workflow_history;
create policy wf_hist_insert on public.workflow_history for insert to authenticated
  with check (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- 5. Background jobs
-- ---------------------------------------------------------------------------
create table if not exists public.background_jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  statut text not null default 'queued'
    check (statut in ('queued','running','succeeded','failed','cancelled')),
  progression int not null default 0 check (progression between 0 and 100),
  priorite int not null default 100,
  tentatives int not null default 0,
  max_tentatives int not null default 3,
  erreur text,
  resultat jsonb,
  idempotency_key text unique,
  created_by uuid references auth.users(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.background_job_attempts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.background_jobs(id) on delete cascade,
  attempt_no int not null,
  erreur text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.background_job_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.background_jobs(id) on delete cascade,
  event_type text not null,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists background_jobs_statut_idx on public.background_jobs (statut, priorite, created_at);

alter table public.background_jobs enable row level security;
alter table public.background_job_attempts enable row level security;
alter table public.background_job_events enable row level security;

drop policy if exists jobs_select on public.background_jobs;
create policy jobs_select on public.background_jobs for select to authenticated
  using (public.is_active_admin() and (created_by = auth.uid() or public.has_permission('jobs:manage') or public.has_role('super_admin')));
drop policy if exists jobs_insert on public.background_jobs;
create policy jobs_insert on public.background_jobs for insert to authenticated
  with check (public.is_active_admin());
drop policy if exists jobs_update on public.background_jobs;
create policy jobs_update on public.background_jobs for update to authenticated
  using (public.has_permission('jobs:manage') or public.has_role('super_admin') or created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- 6. Notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  titre text not null,
  message text not null default '',
  module text,
  entity_type text,
  entity_id uuid,
  priorite text not null default 'normale' check (priorite in ('basse','normale','haute','critique')),
  lien text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.notification_recipients (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  lu_at timestamptz,
  created_at timestamptz not null default now(),
  unique (notification_id, user_id)
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_enabled boolean not null default true,
  in_app_enabled boolean not null default true,
  modules jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
alter table public.notification_recipients enable row level security;
alter table public.notification_preferences enable row level security;

drop policy if exists notif_select on public.notifications;
create policy notif_select on public.notifications for select to authenticated
  using (
    exists (
      select 1 from public.notification_recipients nr
      where nr.notification_id = notifications.id and nr.user_id = auth.uid()
    )
    or public.has_permission('notifications:manage')
  );
drop policy if exists notif_insert on public.notifications;
create policy notif_insert on public.notifications for insert to authenticated
  with check (public.is_active_admin());

drop policy if exists notif_rec_select on public.notification_recipients;
create policy notif_rec_select on public.notification_recipients for select to authenticated
  using (user_id = auth.uid() or public.has_permission('notifications:manage'));
drop policy if exists notif_rec_update on public.notification_recipients;
create policy notif_rec_update on public.notification_recipients for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists notif_rec_insert on public.notification_recipients;
create policy notif_rec_insert on public.notification_recipients for insert to authenticated
  with check (public.is_active_admin());

drop policy if exists notif_pref_all on public.notification_preferences;
create policy notif_pref_all on public.notification_preferences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. Journal canonique : vue unifiée (audit_logs prioritaire + legacy)
-- ---------------------------------------------------------------------------
create or replace view public.v_audit_unified
with (security_invoker = true)
as
select
  a.id,
  a.actor_id as utilisateur_id,
  a.action,
  a.module,
  a.entity_type,
  a.entity_id::text as entity_id,
  a.result,
  a.sensitivity,
  a.created_at,
  'audit_logs'::text as source
from public.audit_logs a
union all
select
  j.id,
  j.utilisateur_id,
  j.action,
  coalesce((j.details->>'module')::text, 'legacy') as module,
  coalesce((j.details->>'entity_type')::text, null) as entity_type,
  nullif(j.details->>'entity_id', '') as entity_id,
  coalesce((j.details->>'result')::text, 'success') as result,
  'interne'::text as sensitivity,
  j.created_at,
  'journal_activite'::text as source
from public.journal_activite j;

grant select on public.v_audit_unified to authenticated;

-- Empêcher UPDATE/DELETE sur audit_logs via trigger (append-only applicatif)
create or replace function public.prevent_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs est append-only';
end;
$$;

drop trigger if exists trg_audit_logs_no_update on public.audit_logs;
create trigger trg_audit_logs_no_update
  before update or delete on public.audit_logs
  for each row execute function public.prevent_audit_mutation();

-- ---------------------------------------------------------------------------
-- 8. Stocks + logistique (socle Vague 2 — tables + RLS dès fondations)
-- ---------------------------------------------------------------------------
create table if not exists public.stock_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.stock_entrepots (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  province text,
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_articles (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  nom text not null,
  categorie_id uuid references public.stock_categories(id),
  unite_code text references public.ref_unites(code),
  seuil_min numeric not null default 0,
  seuil_max numeric,
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_mouvements (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.stock_articles(id),
  entrepot_id uuid not null references public.stock_entrepots(id),
  type text not null check (type in ('entree','sortie','transfert','retour','ajustement','reservation')),
  quantite numeric not null check (quantite > 0),
  sens int not null check (sens in (-1, 1)),
  reference text,
  lot text,
  expires_at date,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create or replace view public.v_stock_disponibles
with (security_invoker = true)
as
select
  m.article_id,
  m.entrepot_id,
  sum(m.quantite * m.sens)::numeric as quantite_disponible
from public.stock_mouvements m
group by m.article_id, m.entrepot_id;

create table if not exists public.logistique_demandes (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  titre text not null,
  statut text not null default 'brouillon'
    check (statut in ('brouillon','soumis','approuve','rejete','commande','recu','annule')),
  demandeur_id uuid references auth.users(id),
  projet_id uuid,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.logistique_vehicules (
  id uuid primary key default gen_random_uuid(),
  immatriculation text not null unique,
  type text not null default 'autre',
  statut text not null default 'disponible',
  kilometrage numeric not null default 0,
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.logistique_missions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  vehicule_id uuid references public.logistique_vehicules(id),
  titre text not null,
  statut text not null default 'planifiee',
  date_debut date,
  date_fin date,
  province text,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

select public._afd_replace_admin_policies('stock_categories', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('stock_entrepots', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('stock_articles', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('stock_mouvements', 'stocks:read', 'stocks:write');
select public._afd_replace_admin_policies('logistique_demandes', 'logistique:read', 'logistique:write');
select public._afd_replace_admin_policies('logistique_vehicules', 'logistique:read', 'logistique:write');
select public._afd_replace_admin_policies('logistique_missions', 'logistique:read', 'logistique:write');

grant select on public.v_stock_disponibles to authenticated;
