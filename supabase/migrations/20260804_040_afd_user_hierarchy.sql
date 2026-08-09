-- Hiérarchie comptes AFD (mono-organisation) :
-- Super Admin → Administrateur principal (unique) → agents / modules / lecture.
-- Idempotent. Ne crée pas de multi-tenant.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Rôles hiérarchiques AFD
-- ---------------------------------------------------------------------------
insert into public.roles (nom, description) values
  ('admin_principal', 'Administrateur principal AFD — gestion quotidienne des comptes'),
  ('admin_module', 'Administrateur de module (RH, Finance, Logistique, etc.)'),
  ('responsable', 'Responsable de projet / programme / département / province'),
  ('agent', 'Agent opérationnel AFD'),
  ('lecture_seule', 'Consultation uniquement')
on conflict (nom) do update set
  description = excluded.description;

-- Alias : administrateur historique = admin_principal pour les nouveaux flux
-- (on conserve la ligne administrateur pour compatibilité)

-- Permissions users étendues
insert into public.permissions (nom, description) values
  ('users.view', 'Voir les utilisateurs'),
  ('users.create', 'Créer des utilisateurs'),
  ('users.update', 'Modifier des utilisateurs'),
  ('users.invite', 'Inviter des utilisateurs'),
  ('users.suspend', 'Suspendre un compte'),
  ('users.activate', 'Réactiver un compte'),
  ('users.archive', 'Archiver un compte'),
  ('users.assign_role', 'Attribuer un rôle'),
  ('users.assign_module', 'Attribuer des modules'),
  ('users.assign_project', 'Attribuer des projets'),
  ('users.view_audit', 'Voir l’audit utilisateurs'),
  ('users.manage_principal', 'Créer / remplacer l’Administrateur principal'),
  ('users.create_admin', 'Créer un administrateur (principal ou module)'),
  ('users.create_super_admin', 'Créer un super administrateur')
on conflict (nom) do nothing;

-- Attribuer permissions aux rôles critiques
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('super_admin', 'platform_owner')
  and p.nom in (
    'users.view','users.create','users.update','users.invite','users.suspend',
    'users.activate','users.archive','users.assign_role','users.assign_module',
    'users.assign_project','users.view_audit','users.manage_principal',
    'users.create_admin','users.create_super_admin',
    'utilisateurs:read','utilisateurs:write'
  )
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('admin_principal', 'administrateur')
  and p.nom in (
    'users.view','users.create','users.update','users.invite','users.suspend',
    'users.activate','users.archive','users.assign_role','users.assign_module',
    'users.assign_project','users.view_audit','users.create_admin',
    'utilisateurs:read','utilisateurs:write'
  )
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Colonnes profil étendues (sans doublon)
-- ---------------------------------------------------------------------------
alter table public.profils_administrateurs
  add column if not exists prenom text,
  add column if not exists deuxieme_prenom text,
  add column if not exists nom_famille text,
  add column if not exists postnom text,
  add column if not exists sexe text,
  add column if not exists date_naissance date,
  add column if not exists nationalite text,
  add column if not exists matricule text,
  add column if not exists email_personnel text,
  add column if not exists telephone_secondaire text,
  add column if not exists adresse text,
  add column if not exists commune text,
  add column if not exists ville text,
  add column if not exists province text,
  add column if not exists pays text default 'RD Congo',
  add column if not exists departement text,
  add column if not exists service text,
  add column if not exists poste text,
  add column if not exists type_agent text,
  add column if not exists type_contrat text,
  add column if not exists date_entree date,
  add column if not exists date_fin date,
  add column if not exists superieur_id uuid references public.profils_administrateurs(id) on delete set null,
  add column if not exists bureau text,
  add column if not exists province_affectation text,
  add column if not exists territoire_affectation text,
  add column if not exists biographie text,
  add column if not exists competences text[] not null default '{}',
  add column if not exists langues text[] not null default '{}',
  add column if not exists niveau_confidentialite text default 'interne',
  add column if not exists compte_expire_le timestamptz,
  add column if not exists statut_compte text default 'active',
  add column if not exists justification_statut text,
  add column if not exists remplace_par uuid references public.profils_administrateurs(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profils_statut_compte_check'
  ) then
    alter table public.profils_administrateurs
      add constraint profils_statut_compte_check
      check (statut_compte in (
        'invited','pending','pending_activation','active','suspended','disabled','expired','archived'
      ));
  end if;
end $$;

create unique index if not exists profils_administrateurs_matricule_unique
  on public.profils_administrateurs (matricule)
  where matricule is not null;

-- ---------------------------------------------------------------------------
-- Types d’agents (source centrale)
-- ---------------------------------------------------------------------------
create table if not exists public.employment_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.employment_types (code, label, order_index) values
  ('employe_permanent', 'Employé permanent', 10),
  ('employe_temporaire', 'Employé temporaire', 20),
  ('consultant', 'Consultant', 30),
  ('volontaire', 'Volontaire', 40),
  ('stagiaire', 'Stagiaire', 50),
  ('agent_terrain', 'Agent terrain', 60),
  ('superviseur_terrain', 'Superviseur terrain', 70),
  ('responsable_projet', 'Responsable de projet', 80),
  ('responsable_programme', 'Responsable de programme', 90),
  ('responsable_rh', 'Responsable RH', 100),
  ('responsable_finance', 'Responsable finance', 110),
  ('responsable_logistique', 'Responsable logistique', 120),
  ('responsable_meal', 'Responsable MEAL', 130),
  ('responsable_communication', 'Responsable communication', 140),
  ('administrateur_systeme', 'Administrateur système', 150),
  ('auditeur', 'Auditeur', 160),
  ('partenaire_externe', 'Partenaire externe', 170)
on conflict (code) do update set label = excluded.label;

alter table public.employment_types enable row level security;
grant select on table public.employment_types to authenticated;
drop policy if exists "Lecture employment_types" on public.employment_types;
create policy "Lecture employment_types"
on public.employment_types for select to authenticated using (active = true);

-- ---------------------------------------------------------------------------
-- Historique Administrateur principal
-- ---------------------------------------------------------------------------
create table if not exists public.admin_principal_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profils_administrateurs(id) on delete cascade,
  action text not null check (action in (
    'created','invited','activated','suspended','reactivated','replaced','archived'
  )),
  actor_id uuid references public.profils_administrateurs(id) on delete set null,
  justification text,
  previous_user_id uuid references public.profils_administrateurs(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_principal_history enable row level security;
grant select, insert on table public.admin_principal_history to authenticated;
drop policy if exists "Lecture historique admin principal" on public.admin_principal_history;
create policy "Lecture historique admin principal"
on public.admin_principal_history for select to authenticated
using (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_permission('users.manage_principal')
  or public.has_permission('users.view_audit')
);

drop policy if exists "Insert historique admin principal" on public.admin_principal_history;
create policy "Insert historique admin principal"
on public.admin_principal_history for insert to authenticated
with check (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_permission('users.manage_principal')
);

-- ---------------------------------------------------------------------------
-- Un seul Administrateur principal actif
-- ---------------------------------------------------------------------------
create or replace function public.count_active_admin_principals()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.utilisateurs_roles ur
  join public.roles r on r.id = ur.role_id
  join public.profils_administrateurs p on p.id = ur.utilisateur_id
  where r.nom in ('admin_principal', 'administrateur')
    and coalesce(p.actif, true) = true
    and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending')
    and coalesce(p.actif, true) = true;
$$;

grant execute on function public.count_active_admin_principals() to authenticated, service_role;

create or replace function public.enforce_single_admin_principal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  role_name text;
  active_count integer;
begin
  select nom into role_name from public.roles where id = new.role_id;
  if role_name is null or role_name not in ('admin_principal', 'administrateur') then
    return new;
  end if;

  select public.count_active_admin_principals() into active_count;

  -- Si update du même user, ne pas compter double
  if tg_op = 'UPDATE' and old.utilisateur_id = new.utilisateur_id then
    return new;
  end if;

  if exists (
    select 1
    from public.utilisateurs_roles ur
    join public.roles r on r.id = ur.role_id
    join public.profils_administrateurs p on p.id = ur.utilisateur_id
    where r.nom in ('admin_principal', 'administrateur')
      and ur.utilisateur_id <> new.utilisateur_id
      and coalesce(p.actif, true) = true
      and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending')
      and coalesce(p.actif, true) = true
  ) then
    raise exception 'Un seul Administrateur principal actif est autorisé.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_single_admin_principal on public.utilisateurs_roles;
create trigger trg_enforce_single_admin_principal
before insert or update on public.utilisateurs_roles
for each row execute function public.enforce_single_admin_principal();

-- ---------------------------------------------------------------------------
-- Historique statuts compte
-- ---------------------------------------------------------------------------
create table if not exists public.user_status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profils_administrateurs(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_id uuid references public.profils_administrateurs(id) on delete set null,
  justification text,
  created_at timestamptz not null default now()
);

alter table public.user_status_history enable row level security;
grant select, insert on table public.user_status_history to authenticated;

drop policy if exists "Lecture user_status_history" on public.user_status_history;
create policy "Lecture user_status_history"
on public.user_status_history for select to authenticated
using (
  auth.uid() = user_id
  or public.has_permission('users.view_audit')
  or public.has_permission('utilisateurs:read')
);

drop policy if exists "Insert user_status_history" on public.user_status_history;
create policy "Insert user_status_history"
on public.user_status_history for insert to authenticated
with check (
  public.has_permission('users.suspend')
  or public.has_permission('users.activate')
  or public.has_permission('utilisateurs:write')
);

comment on function public.count_active_admin_principals is
  'Nombre d’Administrateurs principaux actifs (admin_principal / administrateur).';
