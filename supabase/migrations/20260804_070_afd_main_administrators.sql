-- Administrateurs principaux Direction + IT (deux rôles distincts, un actif chacun).
-- Remplace la contrainte « un seul admin_principal ».
-- Idempotent. Sans secrets / mots de passe.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Colonnes sécurité mot de passe
-- ---------------------------------------------------------------------------
alter table public.profils_administrateurs
  add column if not exists must_change_password boolean not null default false,
  add column if not exists password_changed_at timestamptz,
  add column if not exists temporary_password_issued_at timestamptz,
  add column if not exists prenom text,
  add column if not exists nom_famille text,
  add column if not exists telephone text,
  add column if not exists fonction text,
  add column if not exists statut_compte text default 'active';

-- ---------------------------------------------------------------------------
-- Rôles AFD (codes stricts, pas de texte libre)
-- ---------------------------------------------------------------------------
insert into public.roles (nom, description) values
  ('super_admin', 'Super administrateur — accès de secours et secrets'),
  ('admin_principal_direction', 'Administrateur principal — Direction'),
  ('admin_principal_it', 'Administratrice principale — IT'),
  ('admin_principal', 'Administrateur principal (legacy — migrer vers direction/IT)'),
  ('admin_module', 'Administrateur de module'),
  ('responsable', 'Responsable de projet / programme / département'),
  ('agent', 'Agent opérationnel AFD'),
  ('agent_terrain', 'Agent terrain'),
  ('auditeur', 'Auditeur'),
  ('lecture_seule', 'Consultation uniquement')
on conflict (nom) do update set
  description = excluded.description;

-- ---------------------------------------------------------------------------
-- Permissions complémentaires (si absentes)
-- ---------------------------------------------------------------------------
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
  ('users.manage_principal', 'Remplacer les administrateurs principaux'),
  ('users.create_admin', 'Créer un administrateur'),
  ('users.create_super_admin', 'Créer un super administrateur'),
  ('users.revoke_sessions', 'Révoquer les sessions'),
  ('users.view_security', 'Consulter la sécurité comptes'),
  ('parametres:manage', 'Paramètres fonctionnels'),
  ('journal:read', 'Consulter les journaux'),
  ('notifications:manage', 'Gérer les notifications')
on conflict (nom) do nothing;

-- Super admin : permissions critiques
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('super_admin', 'platform_owner')
  and p.nom in (
    'users.view','users.create','users.update','users.invite','users.suspend',
    'users.activate','users.archive','users.assign_role','users.assign_module',
    'users.assign_project','users.view_audit','users.manage_principal',
    'users.create_admin','users.create_super_admin','users.revoke_sessions',
    'users.view_security','utilisateurs:read','utilisateurs:write',
    'parametres:manage','journal:read','notifications:manage'
  )
on conflict do nothing;

-- Direction : supervision + agents + consultation large + approbation contenus
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom = 'admin_principal_direction'
  and p.nom in (
    'dashboard:read',
    'programmes:read','projets:read','activites:read','beneficiaires:read',
    'indicateurs:read','finances:read','dons:read','payments:read',
    'actualites:read','actualites:write','archives:read','archives:write','archives:publish',
    'mediatheque:read','newsletter:read','messages:read','adhesions:read',
    'partenaires:read','opportunites:read','documents:read','rapports:read','rapports:write','rapports:export',
    'statistiques:read','equipe:read','hr.view','hr.manage_employees',
    'logistique:read','stocks:read','enquetes:read',
    'utilisateurs:read','utilisateurs:write',
    'users.view','users.invite','users.create','users.update','users.create_admin',
    'users.edit','users.suspend','users.activate','users.archive',
    'users.assign_role','users.assign_module','users.assign_project','users.view_audit',
    'journal:read','notifications:manage'
  )
on conflict do nothing;

-- IT : administration opérationnelle étendue (sans secrets / super_admin)
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom = 'admin_principal_it'
  and p.nom in (
    'dashboard:read',
    'programmes:read','programmes:write','projets:read','projets:write',
    'activites:read','activites:write','beneficiaires:read','beneficiaires:write',
    'indicateurs:read','indicateurs:write','finances:read',
    'actualites:read','actualites:write','archives:read','archives:write','archives:publish',
    'mediatheque:read','mediatheque:write','newsletter:read','newsletter:write',
    'messages:read','messages:write','adhesions:read','adhesions:write',
    'partenaires:read','partenaires:write','opportunites:read','opportunites:write',
    'candidatures:read','candidatures:write','documents:read','documents:write',
    'rapports:read','rapports:write','rapports:export','statistiques:read',
    'enquetes:read','enquetes:write','equipe:read','equipe:write',
    'hr.view','hr.manage_employees','logistique:read','logistique:write',
    'stocks:read','stocks:write',
    'utilisateurs:read','utilisateurs:write',
    'users.view','users.invite','users.create','users.update','users.create_admin',
    'users.edit','users.suspend','users.activate','users.archive',
    'users.assign_role','users.assign_module','users.assign_project',
    'users.revoke_sessions','users.view_security','users.view_audit',
    'parametres:manage','journal:read','notifications:manage','pages:write'
  )
on conflict do nothing;

-- Conserver aussi les perms legacy admin_principal (alignées Direction)
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('admin_principal', 'administrateur')
  and p.nom in (
    'dashboard:read','utilisateurs:read','utilisateurs:write',
    'users.view','users.invite','users.create','users.update','users.create_admin',
    'users.edit','users.suspend','users.activate','users.archive',
    'users.assign_role','users.assign_module','users.assign_project','users.view_audit',
    'hr.view','hr.manage_employees','journal:read'
  )
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Unicité : un Direction actif + un IT actif (plus un seul principal global)
-- ---------------------------------------------------------------------------
create or replace function public.count_active_role_holders(p_role_noms text[])
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
  where r.nom = any (p_role_noms)
    and coalesce(p.actif, true) = true
    and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending');
$$;

grant execute on function public.count_active_role_holders(text[]) to authenticated, service_role;

-- Compat : compte les deux sièges principaux (direction + IT + legacy)
create or replace function public.count_active_admin_principals()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select public.count_active_role_holders(array[
    'admin_principal_direction',
    'admin_principal_it',
    'admin_principal',
    'administrateur'
  ]);
$$;

grant execute on function public.count_active_admin_principals() to authenticated, service_role;

create or replace function public.enforce_unique_principal_seats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  role_name text;
begin
  select nom into role_name from public.roles where id = new.role_id;
  if role_name is null then
    return new;
  end if;

  if role_name = 'admin_principal_direction' then
    if exists (
      select 1
      from public.utilisateurs_roles ur
      join public.roles r on r.id = ur.role_id
      join public.profils_administrateurs p on p.id = ur.utilisateur_id
      where r.nom = 'admin_principal_direction'
        and ur.utilisateur_id <> new.utilisateur_id
        and coalesce(p.actif, true) = true
        and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending')
    ) then
      raise exception 'Un seul Administrateur principal Direction actif est autorisé.';
    end if;
  elsif role_name = 'admin_principal_it' then
    if exists (
      select 1
      from public.utilisateurs_roles ur
      join public.roles r on r.id = ur.role_id
      join public.profils_administrateurs p on p.id = ur.utilisateur_id
      where r.nom = 'admin_principal_it'
        and ur.utilisateur_id <> new.utilisateur_id
        and coalesce(p.actif, true) = true
        and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending')
    ) then
      raise exception 'Une seule Administratrice principale IT active est autorisée.';
    end if;
  elsif role_name = 'super_admin' then
    if exists (
      select 1
      from public.utilisateurs_roles ur
      join public.roles r on r.id = ur.role_id
      join public.profils_administrateurs p on p.id = ur.utilisateur_id
      where r.nom = 'super_admin'
        and ur.utilisateur_id <> new.utilisateur_id
        and coalesce(p.actif, true) = true
        and coalesce(p.statut_compte, 'active') in ('active', 'invited', 'pending')
    ) then
      raise exception 'Un seul Super Administrateur actif est autorisé.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_single_admin_principal on public.utilisateurs_roles;
drop trigger if exists trg_enforce_unique_principal_seats on public.utilisateurs_roles;
create trigger trg_enforce_unique_principal_seats
before insert or update on public.utilisateurs_roles
for each row execute function public.enforce_unique_principal_seats();

-- Historique statut compte (si table absente)
create table if not exists public.user_status_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profils_administrateurs(id) on delete cascade,
  previous_status text,
  new_status text not null,
  reason text,
  actor_id uuid references public.profils_administrateurs(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.user_status_history enable row level security;

drop policy if exists "Lecture historique statut super/principal" on public.user_status_history;
create policy "Lecture historique statut super/principal"
on public.user_status_history for select to authenticated
using (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_direction')
  or public.has_role('admin_principal_it')
  or public.has_permission('users.view_audit')
);

drop policy if exists "Insert historique statut" on public.user_status_history;
create policy "Insert historique statut"
on public.user_status_history for insert to authenticated
with check (
  public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_direction')
  or public.has_role('admin_principal_it')
  or public.has_permission('users.update')
);
