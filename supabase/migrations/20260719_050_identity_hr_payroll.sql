-- Identité étendue, RBAC, périmètres, RH et Paie (non destructif).
-- PRÉREQUIS : profils_administrateurs, roles, permissions, journal_activite.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Buckets privés
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('admin-avatars', 'admin-avatars', false, 5242880,
   array['image/jpeg','image/png','image/webp']::text[]),
  ('hr-private', 'hr-private', false, 52428800,
   array['application/pdf','image/jpeg','image/png','image/webp',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]),
  ('hr-payslips-private', 'hr-payslips-private', false, 20971520,
   array['application/pdf']::text[])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Rôles système étendus (réutilise public.roles.nom)
-- ---------------------------------------------------------------------------
alter table public.roles add column if not exists code text;
alter table public.roles add column if not exists niveau integer not null default 50;
alter table public.roles add column if not exists systeme boolean not null default false;
alter table public.roles add column if not exists actif boolean not null default true;
alter table public.roles add column if not exists updated_at timestamptz not null default now();

update public.roles set code = nom where code is null;

insert into public.roles (nom, code, description, niveau, systeme, actif)
values
  ('platform_owner', 'platform_owner', 'Propriétaire technique principal', 1000, true, true),
  ('super_admin', 'super_admin', 'Super administrateur', 900, true, true),
  ('administrateur', 'administrateur', 'Administrateur général', 800, true, true),
  ('responsable_module', 'responsable_module', 'Responsable de module', 700, false, true),
  ('employe', 'employe', 'Employé', 200, false, true),
  ('agent_terrain', 'agent_terrain', 'Agent terrain', 150, false, true),
  ('auditeur', 'auditeur', 'Auditeur lecture seule', 120, false, true),
  ('partenaire_lecture', 'partenaire_lecture', 'Partenaire lecture', 50, false, true),
  ('utilisateur_public', 'utilisateur_public', 'Utilisateur public', 10, false, true)
on conflict (nom) do update set
  code = excluded.code,
  niveau = excluded.niveau,
  systeme = excluded.systeme,
  description = coalesce(public.roles.description, excluded.description);

-- ---------------------------------------------------------------------------
-- Profils étendus
-- ---------------------------------------------------------------------------
alter table public.profils_administrateurs
  add column if not exists nom text,
  add column if not exists postnom text,
  add column if not exists prenom text,
  add column if not exists nom_affichage text,
  add column if not exists email_professionnel text,
  add column if not exists telephone text,
  add column if not exists avatar_bucket text default 'admin-avatars',
  add column if not exists avatar_path text,
  add column if not exists fonction text,
  add column if not exists departement_id uuid,
  add column if not exists employe_id uuid,
  add column if not exists statut_compte text not null default 'active',
  add column if not exists doit_configurer_mfa boolean not null default false,
  add column if not exists cree_par uuid references auth.users(id) on delete set null,
  add column if not exists archived_at timestamptz;

do $$ begin
  alter table public.profils_administrateurs
    add constraint profils_statut_compte_check
    check (statut_compte in ('invited','pending','active','suspended','disabled','archived'));
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Permissions granulaires IAM / RH / Paie
-- ---------------------------------------------------------------------------
insert into public.permissions (nom, description) values
  ('users.view','Voir les utilisateurs'),
  ('users.invite','Inviter des utilisateurs'),
  ('users.create_admin','Créer un administrateur'),
  ('users.create_super_admin','Créer un super administrateur'),
  ('users.edit','Modifier un utilisateur'),
  ('users.suspend','Suspendre un compte'),
  ('users.disable','Désactiver un compte'),
  ('users.archive','Archiver un compte'),
  ('users.assign_roles','Attribuer des rôles'),
  ('users.assign_permissions','Attribuer des permissions'),
  ('users.revoke_sessions','Révoquer des sessions'),
  ('users.view_security','Voir la sécurité utilisateur'),
  ('users.view_audit','Voir l''audit utilisateur'),
  ('hr.view','Voir le module RH'),
  ('hr.view_private','Voir données RH privées'),
  ('hr.manage_employees','Gérer le personnel'),
  ('hr.manage_contracts','Gérer les contrats'),
  ('hr.manage_attendance','Gérer les présences'),
  ('hr.manage_leave','Gérer les congés'),
  ('hr.manage_performance','Gérer la performance'),
  ('hr.manage_training','Gérer les formations'),
  ('hr.manage_recruitment','Gérer le recrutement'),
  ('hr.manage_discipline','Gérer la discipline'),
  ('hr.manage_offboarding','Gérer les départs'),
  ('payroll.view','Voir la paie'),
  ('payroll.calculate','Calculer la paie'),
  ('payroll.manage_components','Gérer les composants salariaux'),
  ('payroll.review_hr','Révision RH paie'),
  ('payroll.review_finance','Révision Finance paie'),
  ('payroll.approve','Approuver la paie'),
  ('payroll.mark_paid','Marquer payé'),
  ('payroll.close','Clôturer une période'),
  ('payroll.reverse','Annuler / reverse une paie'),
  ('payroll.view_salary','Voir les salaires'),
  ('payroll.export','Exporter la paie'),
  ('payroll.manage_rules','Gérer les règles salariales'),
  ('hr_documents.view','Voir documents RH'),
  ('hr_documents.upload','Uploader documents RH'),
  ('hr_documents.download','Télécharger documents RH'),
  ('hr_documents.archive','Archiver documents RH'),
  ('hr_documents.delete','Supprimer documents RH')
on conflict (nom) do nothing;

-- Accorder aux platform_owner / super_admin toutes les nouvelles perms
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('platform_owner','super_admin')
  and (
    p.nom like 'users.%' or p.nom like 'hr.%' or p.nom like 'payroll.%' or p.nom like 'hr_documents.%'
  )
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in (
  'hr.view','hr.view_private','hr.manage_employees','hr.manage_contracts',
  'hr.manage_attendance','hr.manage_leave','hr.manage_recruitment',
  'hr.manage_training','hr.manage_performance','hr.manage_offboarding',
  'hr_documents.view','hr_documents.upload','hr_documents.download',
  'payroll.view','payroll.review_hr','users.view','users.invite'
)
where r.nom in ('ressources_humaines','administrateur')
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in (
  'payroll.view','payroll.calculate','payroll.review_finance','payroll.approve',
  'payroll.mark_paid','payroll.close','payroll.view_salary','payroll.export',
  'payroll.manage_components','payroll.manage_rules'
)
where r.nom = 'finance'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Périmètres d'accès
-- ---------------------------------------------------------------------------
create table if not exists public.access_scopes (
  id uuid primary key default gen_random_uuid(),
  scope_type text not null check (scope_type in (
    'organisation','departement','programme','projet','province','bureau','equipe','module','confidentialite'
  )),
  scope_ref text not null,
  label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (scope_type, scope_ref)
);

create table if not exists public.user_access_scopes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope_id uuid not null references public.access_scopes(id) on delete cascade,
  effect text not null default 'allow' check (effect in ('allow','deny')),
  created_at timestamptz not null default now(),
  unique (user_id, scope_id, effect)
);

create table if not exists public.role_default_scopes (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.roles(id) on delete cascade,
  scope_id uuid not null references public.access_scopes(id) on delete cascade,
  effect text not null default 'allow' check (effect in ('allow','deny')),
  unique (role_id, scope_id, effect)
);

create table if not exists public.user_permission_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  effect text not null check (effect in ('allow','deny')),
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, permission_id)
);

create table if not exists public.admin_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role_code text not null,
  invited_by uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  statut text not null default 'pending'
    check (statut in ('pending','accepted','expired','revoked','failed')),
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.privileged_access_requests (
  id uuid primary key default gen_random_uuid(),
  target_role text not null,
  target_email text not null,
  requested_by uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  statut text not null default 'pending'
    check (statut in ('pending','approved','rejected','expired','cancelled')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

create table if not exists public.privileged_access_approvals (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.privileged_access_requests(id) on delete cascade,
  approver_id uuid not null references auth.users(id) on delete cascade,
  decision text not null check (decision in ('approved','rejected')),
  comment text,
  mfa_aal text,
  created_at timestamptz not null default now(),
  unique (request_id, approver_id)
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  severity text not null default 'info',
  details jsonb not null default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text,
  action text not null,
  module text not null,
  entity_type text,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  reason text,
  result text not null default 'success',
  sensitivity text not null default 'interne',
  ip inet,
  user_agent text,
  session_id text,
  request_id text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_actor_id_idx on public.audit_logs (actor_id);
create index if not exists audit_logs_module_idx on public.audit_logs (module, action);

create table if not exists public.profile_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text default 'fr',
  theme text default 'system',
  notifications jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RH — départements / postes / employés
-- ---------------------------------------------------------------------------
create table if not exists public.hr_departements (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  nom text not null,
  description text,
  parent_id uuid references public.hr_departements(id) on delete set null,
  responsable_employe_id uuid,
  centre_cout text,
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hr_postes (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  titre text not null,
  departement_id uuid references public.hr_departements(id) on delete set null,
  niveau text,
  categorie text,
  description text,
  responsabilites text,
  competences text,
  salaire_indicatif numeric,
  devise text default 'USD',
  actif boolean not null default true,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hr_employes (
  id uuid primary key default gen_random_uuid(),
  matricule text unique,
  user_id uuid unique references auth.users(id) on delete set null,
  nom text not null,
  postnom text,
  prenom text not null,
  nom_affichage text,
  email text,
  telephone text,
  genre text,
  date_naissance date,
  adresse text,
  contact_urgence text,
  nationalite text,
  cnss_id text,
  fiscal_id text,
  avatar_bucket text default 'hr-private',
  avatar_path text,
  departement_id uuid references public.hr_departements(id) on delete set null,
  poste_id uuid references public.hr_postes(id) on delete set null,
  superieur_id uuid references public.hr_employes(id) on delete set null,
  province text,
  programme_id uuid,
  projet_id uuid,
  date_embauche date,
  type_contrat text,
  statut text not null default 'actif'
    check (statut in ('actif','essai','suspendu','inactif','parti')),
  categorie_pro text,
  centre_cout text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

alter table public.hr_departements
  drop constraint if exists hr_departements_responsable_employe_id_fkey;
alter table public.hr_departements
  add constraint hr_departements_responsable_employe_id_fkey
  foreign key (responsable_employe_id) references public.hr_employes(id) on delete set null;

alter table public.profils_administrateurs
  drop constraint if exists profils_administrateurs_employe_id_fkey;
alter table public.profils_administrateurs
  add constraint profils_administrateurs_employe_id_fkey
  foreign key (employe_id) references public.hr_employes(id) on delete set null;

create table if not exists public.hr_contrats (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  reference text,
  type_contrat text not null,
  poste_id uuid references public.hr_postes(id) on delete set null,
  date_debut date not null,
  date_fin date,
  periode_essai_fin date,
  salaire_base numeric not null default 0,
  devise text not null default 'USD',
  horaire text,
  avantages jsonb not null default '[]'::jsonb,
  clauses text,
  document_path text,
  statut text not null default 'actif'
    check (statut in ('brouillon','actif','expire','resilie','renouvele')),
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hr_presences (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  date_jour date not null,
  heure_entree time,
  heure_sortie time,
  pause_minutes integer not null default 0,
  statut text not null default 'present'
    check (statut in ('present','absent','retard','mission','teletravail','conge','ferie')),
  heures_sup numeric not null default 0,
  commentaire text,
  valide_par uuid references auth.users(id) on delete set null,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  unique (employe_id, date_jour)
);

create table if not exists public.hr_conges (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  type_conge text not null,
  date_debut date not null,
  date_fin date not null,
  jours numeric not null,
  motif text,
  piece_path text,
  statut text not null default 'demande'
    check (statut in ('demande','approuve_n1','approuve_rh','rejete','annule')),
  approuve_par uuid references auth.users(id) on delete set null,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hr_soldes_conges (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  type_conge text not null,
  annee integer not null,
  acquis numeric not null default 0,
  pris numeric not null default 0,
  report numeric not null default 0,
  unique (employe_id, type_conge, annee)
);

create table if not exists public.hr_recrutements (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  poste_id uuid references public.hr_postes(id) on delete set null,
  departement_id uuid references public.hr_departements(id) on delete set null,
  responsable_id uuid references auth.users(id) on delete set null,
  date_limite date,
  statut text not null default 'brouillon'
    check (statut in ('brouillon','ouvert','cloture','annule')),
  description text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_candidatures_rh (
  id uuid primary key default gen_random_uuid(),
  recrutement_id uuid not null references public.hr_recrutements(id) on delete cascade,
  nom text not null,
  email text,
  telephone text,
  cv_path text,
  lettre_path text,
  note numeric,
  statut text not null default 'recue'
    check (statut in ('recue','preselection','entretien','offre','accepte','refuse','embauche')),
  commentaires text,
  employe_converti_id uuid references public.hr_employes(id) on delete set null,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_onboarding_taches (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  titre text not null,
  responsable_id uuid references auth.users(id) on delete set null,
  date_limite date,
  statut text not null default 'a_faire'
    check (statut in ('a_faire','en_cours','fait','bloque')),
  preuve_path text,
  commentaire text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_performance_cycles (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  date_debut date,
  date_fin date,
  statut text not null default 'ouvert',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_evaluations (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references public.hr_performance_cycles(id) on delete cascade,
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  evaluateur_id uuid references auth.users(id) on delete set null,
  note numeric,
  commentaire text,
  statut text not null default 'brouillon',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_formations (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  formateur text,
  date_debut date,
  date_fin date,
  cout numeric,
  devise text default 'USD',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_formation_participants (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references public.hr_formations(id) on delete cascade,
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  present boolean not null default false,
  certificat_path text,
  unique (formation_id, employe_id)
);

create table if not exists public.hr_equipements (
  id uuid primary key default gen_random_uuid(),
  inventaire text unique,
  type_equipement text not null,
  employe_id uuid references public.hr_employes(id) on delete set null,
  date_attribution date,
  etat text not null default 'bon',
  date_restitution date,
  document_path text,
  commentaire text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_discipline (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  categorie text not null,
  date_fait date,
  description text,
  statut text not null default 'ouvert',
  decision text,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_departs (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  type_depart text not null,
  date_effet date not null,
  checklist jsonb not null default '[]'::jsonb,
  statut text not null default 'en_cours',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.hr_documents (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  type_document text not null,
  bucket text not null default 'hr-private',
  storage_path text not null,
  visibilite text not null default 'rh',
  hash_sha256 text,
  uploaded_by uuid references auth.users(id) on delete set null,
  expires_at date,
  statut text not null default 'actif',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Paie
-- ---------------------------------------------------------------------------
create table if not exists public.salary_components (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  kind text not null check (kind in ('earning','deduction','employer_charge')),
  taxable boolean not null default true,
  contributory boolean not null default true,
  fixed_or_variable text not null default 'variable',
  formula text,
  priority integer not null default 100,
  ceiling numeric,
  floor numeric,
  currency text default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_compensation (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  component_id uuid not null references public.salary_components(id) on delete cascade,
  amount numeric not null default 0,
  currency text not null default 'USD',
  effective_from date not null,
  effective_to date,
  unique (employe_id, component_id, effective_from)
);

create table if not exists public.legal_payroll_rules (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null default 'CD',
  organisme text,
  code text not null,
  nom text not null,
  rule_type text not null,
  formula text,
  rate numeric,
  brackets jsonb,
  ceiling numeric,
  floor numeric,
  currency text default 'CDF',
  effective_from date not null,
  effective_to date,
  source_title text,
  source_reference text,
  source_document_id text,
  statut_validation text not null default 'draft'
    check (statut_validation in ('draft','under_review','verified','expired','replaced')),
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (code, effective_from)
);

create table if not exists public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  date_debut date not null,
  date_fin date not null,
  statut text not null default 'draft'
    check (statut in (
      'draft','collecting_data','calculated','hr_review','finance_review',
      'awaiting_approval','approved','payment_ready','partially_paid','paid',
      'closed','reversed','cancelled'
    )),
  currency text not null default 'USD',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.payroll_periods(id) on delete cascade,
  statut text not null default 'draft',
  calculated_at timestamptz,
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_run_employees (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.payroll_runs(id) on delete cascade,
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  brut numeric not null default 0,
  retenues numeric not null default 0,
  net numeric not null default 0,
  cout_employeur numeric not null default 0,
  currency text not null default 'USD',
  anomalies jsonb not null default '[]'::jsonb,
  statut text not null default 'calculated',
  unique (run_id, employe_id)
);

create table if not exists public.payroll_lines (
  id uuid primary key default gen_random_uuid(),
  run_employee_id uuid not null references public.payroll_run_employees(id) on delete cascade,
  component_code text not null,
  kind text not null,
  base_amount numeric,
  rate numeric,
  amount numeric not null,
  formula_used text,
  rule_id uuid references public.legal_payroll_rules(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.payslips (
  id uuid primary key default gen_random_uuid(),
  run_employee_id uuid not null references public.payroll_run_employees(id) on delete cascade,
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  period_id uuid not null references public.payroll_periods(id) on delete cascade,
  bucket text not null default 'hr-payslips-private',
  storage_path text,
  reference text,
  brut numeric not null,
  net numeric not null,
  currency text not null,
  generated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  demo_batch_id text
);

create table if not exists public.payroll_payments (
  id uuid primary key default gen_random_uuid(),
  period_id uuid not null references public.payroll_periods(id) on delete cascade,
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  amount numeric not null,
  currency text not null,
  mode text not null default 'bank',
  reference text,
  preuve_path text,
  statut text not null default 'pending'
    check (statut in ('pending','paid','failed','cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_advances (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'USD',
  statut text not null default 'demande',
  monthly_deduction numeric,
  balance numeric,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.employee_loans (
  id uuid primary key default gen_random_uuid(),
  employe_id uuid not null references public.hr_employes(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'USD',
  monthly_deduction numeric not null,
  balance numeric not null,
  statut text not null default 'actif',
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

-- Seeds composants + règles démo (non verified = non officielles)
insert into public.salary_components (code, nom, kind, taxable, contributory, fixed_or_variable, formula, priority)
values
  ('BASE','Salaire de base','earning', true, true, 'fixed', 'base', 10),
  ('TRANSPORT','Allocation transport','earning', true, false, 'fixed', 'fixed', 20),
  ('OVERTIME','Heures supplémentaires','earning', true, true, 'variable', 'hours * hourly_rate * 1.5', 30),
  ('CNSS_EE','Cotisation sociale employé (paramétrable)','deduction', false, true, 'variable', 'brut * rate', 200),
  ('TAX_EE','Retenue fiscale (paramétrable)','deduction', false, false, 'variable', 'taxable * rate', 210),
  ('ADVANCE','Remboursement avance','deduction', false, false, 'variable', 'advance', 220),
  ('CNSS_ER','Cotisation sociale employeur (paramétrable)','employer_charge', false, true, 'variable', 'brut * rate', 300)
on conflict (code) do nothing;

insert into public.legal_payroll_rules (
  jurisdiction, organisme, code, nom, rule_type, formula, rate, currency,
  effective_from, source_title, source_reference, statut_validation
) values
  ('CD','DEMO','DEMO_CNSS_EE','Règle démo cotisation employé','social','brut * rate', 0.035, 'CDF',
   '2026-01-01','Configuration de démonstration AFD','DEMO-NOT-LEGAL','draft'),
  ('CD','DEMO','DEMO_TAX','Règle démo retenue fiscale','tax','taxable * rate', 0.10, 'CDF',
   '2026-01-01','Configuration de démonstration AFD','DEMO-NOT-LEGAL','draft'),
  ('CD','DEMO','DEMO_CNSS_ER','Règle démo cotisation employeur','employer','brut * rate', 0.09, 'CDF',
   '2026-01-01','Configuration de démonstration AFD','DEMO-NOT-LEGAL','draft'),
  ('CD','DEMO','DEMO_OT','Règle démo heures supplémentaires','overtime','hours * hourly * 1.5', 1.5, 'USD',
   '2026-01-01','Configuration de démonstration AFD','DEMO-NOT-LEGAL','draft')
on conflict (code, effective_from) do nothing;

-- ---------------------------------------------------------------------------
-- RPC audit append-only
-- ---------------------------------------------------------------------------
create or replace function public.append_audit_log(
  p_action text,
  p_module text,
  p_entity_type text default null,
  p_entity_id text default null,
  p_old jsonb default null,
  p_new jsonb default null,
  p_reason text default null,
  p_result text default 'success',
  p_sensitivity text default 'interne'
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.audit_logs (
    actor_id, action, module, entity_type, entity_id,
    old_values, new_values, reason, result, sensitivity
  ) values (
    auth.uid(), p_action, p_module, p_entity_type, p_entity_id,
    p_old, p_new, p_reason, p_result, p_sensitivity
  ) returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.append_audit_log(text,text,text,text,jsonb,jsonb,text,text,text) from public;
grant execute on function public.append_audit_log(text,text,text,text,jsonb,jsonb,text,text,text) to authenticated;

-- Empêcher UPDATE/DELETE audit_logs via trigger
create or replace function public.deny_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_logs est append-only';
end;
$$;

drop trigger if exists audit_logs_no_update on public.audit_logs;
create trigger audit_logs_no_update
before update or delete on public.audit_logs
for each row execute function public.deny_audit_mutation();

-- Compteur platform_owner actifs
create or replace function public.count_active_platform_owners()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.utilisateurs_roles ur
  join public.roles r on r.id = ur.role_id
  join public.profils_administrateurs pa on pa.id = ur.utilisateur_id
  where r.nom = 'platform_owner'
    and pa.actif = true
    and coalesce(pa.statut_compte, 'active') = 'active';
$$;

-- ---------------------------------------------------------------------------
-- RLS (aperçu sécurisé)
-- ---------------------------------------------------------------------------
alter table public.audit_logs enable row level security;
alter table public.hr_employes enable row level security;
alter table public.hr_contrats enable row level security;
alter table public.hr_presences enable row level security;
alter table public.hr_conges enable row level security;
alter table public.payroll_periods enable row level security;
alter table public.payslips enable row level security;
alter table public.admin_invitations enable row level security;
alter table public.hr_departements enable row level security;
alter table public.hr_postes enable row level security;

drop policy if exists "audit_logs_select" on public.audit_logs;
create policy "audit_logs_select" on public.audit_logs for select to authenticated
using (
  public.has_permission('users.view_audit')
  or public.has_permission('journal:read')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or actor_id = auth.uid()
);

drop policy if exists "audit_logs_insert" on public.audit_logs;
create policy "audit_logs_insert" on public.audit_logs for insert to authenticated
with check (actor_id = auth.uid() or actor_id is null);

drop policy if exists "hr_employes_select" on public.hr_employes;
create policy "hr_employes_select" on public.hr_employes for select to authenticated
using (
  public.has_permission('hr.view')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or user_id = auth.uid()
);

drop policy if exists "hr_employes_write" on public.hr_employes;
create policy "hr_employes_write" on public.hr_employes for all to authenticated
using (
  public.has_permission('hr.manage_employees')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
)
with check (
  public.has_permission('hr.manage_employees')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "payslips_select" on public.payslips;
create policy "payslips_select" on public.payslips for select to authenticated
using (
  public.has_permission('payroll.view_salary')
  or public.has_permission('payroll.view')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or employe_id in (select id from public.hr_employes where user_id = auth.uid())
);

drop policy if exists "payroll_periods_admin" on public.payroll_periods;
create policy "payroll_periods_admin" on public.payroll_periods for all to authenticated
using (
  public.has_permission('payroll.view')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
)
with check (
  public.has_permission('payroll.calculate')
  or public.has_permission('payroll.approve')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "hr_dept_all" on public.hr_departements;
create policy "hr_dept_all" on public.hr_departements for all to authenticated
using (public.has_permission('hr.view') or public.has_role('super_admin') or public.has_role('platform_owner'))
with check (public.has_permission('hr.manage_employees') or public.has_role('super_admin') or public.has_role('platform_owner'));

drop policy if exists "hr_postes_all" on public.hr_postes;
create policy "hr_postes_all" on public.hr_postes for all to authenticated
using (public.has_permission('hr.view') or public.has_role('super_admin') or public.has_role('platform_owner'))
with check (public.has_permission('hr.manage_employees') or public.has_role('super_admin') or public.has_role('platform_owner'));

drop policy if exists "invitations_admin" on public.admin_invitations;
create policy "invitations_admin" on public.admin_invitations for all to authenticated
using (public.has_permission('users.invite') or public.has_role('super_admin') or public.has_role('platform_owner'))
with check (public.has_permission('users.invite') or public.has_role('super_admin') or public.has_role('platform_owner'));

-- Storage policies avatars / HR
drop policy if exists "admin avatars read own" on storage.objects;
create policy "admin avatars read own" on storage.objects for select to authenticated
using (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.has_permission('users.view')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
  )
);

drop policy if exists "admin avatars write own" on storage.objects;
create policy "admin avatars write own" on storage.objects for insert to authenticated
with check (
  bucket_id = 'admin-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "hr private read" on storage.objects;
create policy "hr private read" on storage.objects for select to authenticated
using (
  bucket_id in ('hr-private','hr-payslips-private')
  and (
    public.has_permission('hr_documents.view')
    or public.has_permission('payroll.view_salary')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
  )
);

drop policy if exists "hr private write" on storage.objects;
create policy "hr private write" on storage.objects for insert to authenticated
with check (
  bucket_id in ('hr-private','hr-payslips-private')
  and (
    public.has_permission('hr_documents.upload')
    or public.has_permission('payroll.calculate')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
  )
);
