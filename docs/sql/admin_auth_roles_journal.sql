-- Phase auth admin — non destructive.
-- Complète les rôles organisationnels AFD, permissions applicatives,
-- journal d'activité et politiques de profil nécessaires à la connexion.

-- ---------------------------------------------------------------------------
-- Rôles organisationnels (alignés sur src/config/roles.ts)
-- ---------------------------------------------------------------------------
insert into roles (nom, description) values
  ('super_admin', 'Administration complète'),
  ('direction_generale', 'Direction générale'),
  ('secretariat', 'Secrétariat'),
  ('charge_programmes', 'Chargé(e) de programmes'),
  ('coordination_urgences', 'Coordination urgences'),
  ('coordination_sante', 'Coordination santé'),
  ('coordination_developpement', 'Coordination développement'),
  ('coordination_meal', 'Coordination MEAL'),
  ('logistique', 'Logistique'),
  ('ressources_humaines', 'Ressources humaines'),
  ('finance', 'Finance'),
  ('communication', 'Communication'),
  ('lecture_partenaire', 'Lecture partenaire')
on conflict (nom) do nothing;

-- ---------------------------------------------------------------------------
-- Permissions applicatives (alignées sur src/config/permissions.ts)
-- ---------------------------------------------------------------------------
insert into permissions (nom, description) values
  ('dashboard:read', 'Accéder au tableau de bord'),
  ('programmes:read', 'Lire les programmes'),
  ('programmes:write', 'Modifier les programmes'),
  ('projets:read', 'Lire les projets'),
  ('projets:write', 'Modifier les projets'),
  ('activites:read', 'Lire les activités'),
  ('activites:write', 'Modifier les activités'),
  ('beneficiaires:read', 'Lire les bénéficiaires'),
  ('beneficiaires:write', 'Modifier les bénéficiaires'),
  ('indicateurs:read', 'Lire les indicateurs'),
  ('indicateurs:write', 'Modifier les indicateurs'),
  ('finances:read', 'Lire les finances'),
  ('finances:write', 'Modifier les finances'),
  ('dons:read', 'Lire les dons'),
  ('dons:write', 'Modifier les dons'),
  ('payments:read', 'Lire les paiements'),
  ('payments:manage', 'Gérer les paiements'),
  ('actualites:read', 'Lire les actualités'),
  ('actualites:write', 'Modifier les actualités'),
  ('mediatheque:read', 'Lire la médiathèque'),
  ('mediatheque:write', 'Modifier la médiathèque'),
  ('newsletter:read', 'Lire la newsletter'),
  ('newsletter:write', 'Modifier la newsletter'),
  ('newsletter:send', 'Envoyer la newsletter'),
  ('messages:read', 'Lire les messages'),
  ('messages:write', 'Traiter les messages'),
  ('adhesions:read', 'Lire les adhésions'),
  ('adhesions:write', 'Traiter les adhésions'),
  ('partenaires:read', 'Lire les partenaires'),
  ('partenaires:write', 'Modifier les partenaires'),
  ('equipe:read', 'Lire l’équipe'),
  ('equipe:write', 'Modifier l’équipe'),
  ('statistiques:read', 'Lire les statistiques'),
  ('rapports:read', 'Lire les rapports'),
  ('rapports:write', 'Générer des rapports'),
  ('rapports:export', 'Exporter des rapports'),
  ('utilisateurs:read', 'Lire les utilisateurs'),
  ('utilisateurs:write', 'Modifier les utilisateurs'),
  ('roles:manage', 'Gérer les rôles'),
  ('parametres:manage', 'Gérer les paramètres'),
  ('journal:read', 'Lire le journal d’activité')
on conflict (nom) do nothing;

-- Super admin : toutes les permissions applicatives
insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
cross join permissions p
where r.nom = 'super_admin'
  and p.nom like '%:%'
on conflict do nothing;

-- Direction générale (échantillon large)
insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','programmes:read','programmes:write','projets:read','projets:write',
  'activites:read','beneficiaires:read','indicateurs:read','finances:read','dons:read',
  'payments:read','actualites:read','actualites:write','newsletter:read','messages:read',
  'adhesions:read','partenaires:read','partenaires:write','equipe:read','statistiques:read',
  'rapports:read','rapports:write','rapports:export','utilisateurs:read','journal:read'
)
where r.nom = 'direction_generale'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','messages:read','messages:write','adhesions:read','adhesions:write',
  'partenaires:read','equipe:read','actualites:read'
)
where r.nom = 'secretariat'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','programmes:read','programmes:write','projets:read','projets:write',
  'activites:read','activites:write','beneficiaires:read','indicateurs:read','indicateurs:write',
  'statistiques:read','rapports:read','rapports:write'
)
where r.nom = 'charge_programmes'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','indicateurs:read','indicateurs:write','beneficiaires:read',
  'statistiques:read','rapports:read','rapports:write','rapports:export'
)
where r.nom = 'coordination_meal'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','finances:read','finances:write','dons:read','dons:write',
  'payments:read','payments:manage','rapports:read','rapports:export'
)
where r.nom = 'finance'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','actualites:read','actualites:write','mediatheque:read','mediatheque:write',
  'newsletter:read','newsletter:write','newsletter:send','messages:read'
)
where r.nom = 'communication'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','equipe:read','equipe:write','utilisateurs:read'
)
where r.nom = 'ressources_humaines'
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','programmes:read','projets:read','statistiques:read','rapports:read'
)
where r.nom = 'lecture_partenaire'
on conflict do nothing;

-- Coordinations / logistique (droits opérationnels de base)
insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','programmes:read','projets:read','projets:write',
  'activites:read','activites:write','beneficiaires:read','indicateurs:read','rapports:read'
)
where r.nom in (
  'coordination_urgences','coordination_sante','coordination_developpement'
)
on conflict do nothing;

insert into roles_permissions (role_id, permission_id)
select r.id, p.id
from roles r
join permissions p on p.nom in (
  'dashboard:read','projets:read','activites:read','rapports:read'
)
where r.nom = 'logistique'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Mise à jour du profil (dernière connexion) par le titulaire
-- ---------------------------------------------------------------------------
drop policy if exists "Profil admin met à jour sa dernière connexion" on profils_administrateurs;
create policy "Profil admin met à jour sa dernière connexion"
on profils_administrateurs for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Journal d'activité (événements auth / admin — sans secrets)
-- ---------------------------------------------------------------------------
create table if not exists journal_activite (
  id uuid primary key default gen_random_uuid(),
  utilisateur_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists journal_activite_created_at_idx
  on journal_activite (created_at desc);

create index if not exists journal_activite_utilisateur_idx
  on journal_activite (utilisateur_id);

alter table journal_activite enable row level security;

drop policy if exists "Admins lisent le journal" on journal_activite;
create policy "Admins lisent le journal"
on journal_activite for select to authenticated
using (public.has_permission('journal:read') or public.has_role('super_admin'));

drop policy if exists "Admins actifs journalisent" on journal_activite;
create policy "Admins actifs journalisent"
on journal_activite for insert to authenticated
with check (
  public.is_active_admin()
  and (utilisateur_id is null or utilisateur_id = auth.uid())
);

-- Fonction d'écriture journal (security definer) pour tentatives refusées
create or replace function public.log_admin_activity(
  p_action text,
  p_details jsonb default '{}'::jsonb,
  p_utilisateur_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.journal_activite (utilisateur_id, action, details)
  values (
    coalesce(p_utilisateur_id, auth.uid()),
    p_action,
    coalesce(p_details, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.log_admin_activity(text, jsonb, uuid) from public;
grant execute on function public.log_admin_activity(text, jsonb, uuid) to authenticated;
grant execute on function public.log_admin_activity(text, jsonb, uuid) to anon;
