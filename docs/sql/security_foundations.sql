-- Phase 4 — fondations de sécurité non destructives.
-- PRÉREQUIS OBLIGATOIRE : sauvegarde PostgreSQL + Storage et validation du
-- schéma réel de l'instance cible. Cette migration ne supprime aucune donnée.

create extension if not exists pgcrypto;

create table if not exists profils_administrateurs (
  id uuid primary key references auth.users(id) on delete cascade,
  nom_complet text,
  email text not null,
  photo_url text,
  actif boolean not null default true,
  derniere_connexion timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compatibilité avec l'ancienne table administrateurs (si elle existe).
-- Sur les projets où cette table n'a jamais été créée, on ignore silencieusement.
do $$
begin
  if to_regclass('public.administrateurs') is not null then
    insert into profils_administrateurs (id, email, actif)
    select id, email, est_admin
    from public.administrateurs
    on conflict (id) do nothing;
  end if;
end $$;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists roles_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists utilisateurs_roles (
  utilisateur_id uuid not null references profils_administrateurs(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (utilisateur_id, role_id)
);

insert into roles (nom, description) values
  ('super_admin', 'Administration complète, rôles et paramètres critiques'),
  ('administrateur', 'Gestion générale des contenus'),
  ('editeur', 'Création et modification de contenus'),
  ('communication', 'Actualités et médias'),
  ('suivi_evaluation', 'Indicateurs et rapports'),
  ('finance_lecture', 'Consultation financière')
on conflict (nom) do nothing;

insert into permissions (nom, description) values
  ('contenus_consulter', 'Consulter les contenus non publics'),
  ('contenus_creer', 'Créer des contenus'),
  ('contenus_modifier', 'Modifier des contenus'),
  ('contenus_publier', 'Publier des contenus'),
  ('contenus_supprimer', 'Supprimer des contenus'),
  ('programmes_gerer', 'Gérer les programmes'),
  ('projets_gerer', 'Gérer les projets'),
  ('actualites_gerer', 'Gérer les actualités'),
  ('medias_gerer', 'Gérer les médias'),
  ('equipe_gerer', 'Gérer l’équipe'),
  ('partenaires_gerer', 'Gérer les partenaires'),
  ('messages_consulter', 'Consulter les messages'),
  ('adhesions_gerer', 'Gérer les adhésions'),
  ('dons_consulter', 'Consulter les intentions de don'),
  ('paiements_valider', 'Valider un paiement après preuve'),
  ('statistiques_consulter', 'Consulter les statistiques'),
  ('rapports_generer', 'Générer des rapports'),
  ('rapports_telecharger', 'Télécharger des rapports'),
  ('utilisateurs_gerer', 'Gérer les utilisateurs'),
  ('roles_gerer', 'Gérer les rôles'),
  ('parametres_gerer', 'Gérer les paramètres'),
  ('journal_consulter', 'Consulter le journal')
on conflict (nom) do nothing;

-- Attribution initiale contrôlée : les anciens administrateurs actifs
-- reçoivent le rôle administrateur, jamais super_admin.
insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
cross join permissions p
where r.nom = 'super_admin'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'contenus_consulter', 'contenus_creer', 'contenus_modifier',
  'contenus_publier', 'programmes_gerer', 'projets_gerer',
  'actualites_gerer', 'medias_gerer', 'equipe_gerer',
  'partenaires_gerer', 'messages_consulter', 'adhesions_gerer',
  'dons_consulter', 'statistiques_consulter', 'rapports_generer',
  'rapports_telecharger', 'parametres_gerer'
)
where r.nom = 'administrateur'
on conflict do nothing;

insert into utilisateurs_roles (utilisateur_id, role_id)
select pa.id, r.id
from profils_administrateurs pa
join roles r on r.nom = 'administrateur'
where pa.actif
on conflict do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profils_administrateurs_set_updated_at on profils_administrateurs;
create trigger profils_administrateurs_set_updated_at
before update on profils_administrateurs
for each row execute function public.set_updated_at();

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
    where pa.id = auth.uid() and pa.actif
  );
$$;

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
      and r.nom = role_name
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

revoke all on function public.is_active_admin() from public;
revoke all on function public.has_role(text) from public;
revoke all on function public.has_permission(text) from public;
grant execute on function public.is_active_admin() to authenticated;
grant execute on function public.has_role(text) to authenticated;
grant execute on function public.has_permission(text) to authenticated;

alter table profils_administrateurs enable row level security;
alter table roles enable row level security;
alter table permissions enable row level security;
alter table roles_permissions enable row level security;
alter table utilisateurs_roles enable row level security;

create policy "Profil administrateur lisible par son titulaire"
on profils_administrateurs for select to authenticated
using (id = auth.uid());

create policy "Super admin gère les profils"
on profils_administrateurs for all to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

create policy "Admins actifs lisent les rôles"
on roles for select to authenticated
using (public.is_active_admin());

create policy "Super admin gère les rôles"
on roles for all to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

create policy "Admins actifs lisent les permissions"
on permissions for select to authenticated
using (public.is_active_admin());

create policy "Super admin gère les permissions"
on permissions for all to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

create policy "Admins actifs lisent les associations de rôles"
on roles_permissions for select to authenticated
using (public.is_active_admin());

create policy "Super admin gère les associations de rôles"
on roles_permissions for all to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

create policy "Admins actifs lisent les rôles utilisateurs"
on utilisateurs_roles for select to authenticated
using (public.is_active_admin());

create policy "Super admin gère les rôles utilisateurs"
on utilisateurs_roles for all to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

