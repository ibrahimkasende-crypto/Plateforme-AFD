-- Fondations contenu dynamique AFD : témoignages, appels d'offres, pages CMS,
-- enquêtes, agents terrain. Non destructif.

-- ---------------------------------------------------------------------------
-- temoignages
-- ---------------------------------------------------------------------------
create table if not exists public.temoignages (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  display_name text not null,
  anonymized boolean not null default false,
  role_or_profile text,
  quote text not null,
  image_url text,
  media_id uuid references public.medias (id) on delete set null,
  projet_id uuid,
  province text,
  consent_status text not null default 'to-review'
    check (consent_status in ('approved', 'to-review', 'not-required', 'refused', 'absent')),
  active boolean not null default true,
  publie boolean not null default false,
  order_index integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists temoignages_public_idx
  on public.temoignages (publie, active, order_index)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- appels_offres
-- ---------------------------------------------------------------------------
create table if not exists public.appels_offres (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  slug text not null unique,
  resume text,
  description text,
  procedure text,
  contact_email text,
  localisation text,
  date_publication timestamptz,
  date_limite timestamptz,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'ouvert', 'cloture', 'suspendu', 'archive')),
  publie boolean not null default false,
  document_principal_path text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists appels_offres_public_idx
  on public.appels_offres (publie, statut, date_limite desc)
  where deleted_at is null;

create table if not exists public.appels_offres_documents (
  id uuid primary key default gen_random_uuid(),
  appel_offre_id uuid not null references public.appels_offres (id) on delete cascade,
  titre text not null,
  storage_path text not null,
  filename text,
  mime_type text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pages / sections_pages (CMS institutionnel)
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  route text not null unique,
  titre text not null,
  slug text,
  surtitre text,
  resume text,
  description_seo text,
  image_og_media_id uuid references public.medias (id) on delete set null,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'en_revision', 'approuve', 'programme', 'publie', 'depublie', 'archive')),
  publie boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.sections_pages (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type_section text not null default 'contenu',
  titre text,
  sous_titre text,
  contenu text,
  media_id uuid references public.medias (id) on delete set null,
  ordre integer not null default 0,
  active boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sections_pages_page_ordre_idx
  on public.sections_pages (page_id, ordre);

-- ---------------------------------------------------------------------------
-- agents_terrain
-- ---------------------------------------------------------------------------
create table if not exists public.agents_terrain (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  matricule text,
  full_name text not null,
  fonction text,
  telephone text,
  province text,
  territoire text,
  programme_id uuid,
  projet_id uuid,
  superviseur_id uuid references public.agents_terrain (id) on delete set null,
  actif boolean not null default true,
  disponibilite text,
  date_affectation date,
  notes_internes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- enquêtes dynamiques
-- ---------------------------------------------------------------------------
create table if not exists public.enquetes (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  slug text not null unique,
  description text,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'publiee', 'cloturee', 'archivee')),
  visibilite text not null default 'privee'
    check (visibilite in ('publique', 'privee', 'agents')),
  date_ouverture timestamptz,
  date_cloture timestamptz,
  projet_id uuid,
  province text,
  consentement_requis boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.questions_enquete (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes (id) on delete cascade,
  type_question text not null
    check (type_question in (
      'texte_court', 'texte_long', 'nombre', 'date', 'telephone', 'email',
      'choix_unique', 'choix_multiple', 'liste', 'oui_non', 'note', 'echelle',
      'fichier', 'photo', 'localisation'
    )),
  libelle text not null,
  aide text,
  obligatoire boolean not null default false,
  ordre integer not null default 0,
  configuration jsonb not null default '{}'::jsonb,
  condition_affichage jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.options_questions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions_enquete (id) on delete cascade,
  libelle text not null,
  valeur text not null,
  ordre integer not null default 0
);

create table if not exists public.reponses_enquete (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes (id) on delete cascade,
  agent_id uuid references public.agents_terrain (id) on delete set null,
  projet_id uuid,
  province text,
  repondant_anonyme boolean not null default true,
  statut text not null default 'soumise'
    check (statut in ('brouillon', 'soumise', 'validee', 'rejetee')),
  consentement boolean not null default false,
  localisation jsonb,
  submitted_at timestamptz default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.reponses_questions (
  id uuid primary key default gen_random_uuid(),
  reponse_enquete_id uuid not null references public.reponses_enquete (id) on delete cascade,
  question_id uuid not null references public.questions_enquete (id) on delete cascade,
  valeur_texte text,
  valeur_nombre numeric,
  valeur_json jsonb,
  fichier_path text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.temoignages enable row level security;
alter table public.appels_offres enable row level security;
alter table public.appels_offres_documents enable row level security;
alter table public.pages enable row level security;
alter table public.sections_pages enable row level security;
alter table public.agents_terrain enable row level security;
alter table public.enquetes enable row level security;
alter table public.questions_enquete enable row level security;
alter table public.options_questions enable row level security;
alter table public.reponses_enquete enable row level security;
alter table public.reponses_questions enable row level security;

drop policy if exists "Lecture temoignages publies" on public.temoignages;
create policy "Lecture temoignages publies"
on public.temoignages for select to anon, authenticated
using (
  publie = true
  and active = true
  and deleted_at is null
  and consent_status in ('approved', 'not-required')
);

drop policy if exists "Admins gèrent temoignages" on public.temoignages;
create policy "Admins gèrent temoignages"
on public.temoignages for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_permission('actualites:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_permission('actualites:write')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture appels offres publies" on public.appels_offres;
create policy "Lecture appels offres publies"
on public.appels_offres for select to anon, authenticated
using (publie = true and deleted_at is null and statut in ('ouvert', 'cloture'));

drop policy if exists "Admins gèrent appels offres" on public.appels_offres;
create policy "Admins gèrent appels offres"
on public.appels_offres for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture docs AO publics" on public.appels_offres_documents;
create policy "Lecture docs AO publics"
on public.appels_offres_documents for select to anon, authenticated
using (
  exists (
    select 1 from public.appels_offres a
    where a.id = appel_offre_id
      and a.publie = true
      and a.deleted_at is null
  )
);

drop policy if exists "Admins gèrent docs AO" on public.appels_offres_documents;
create policy "Admins gèrent docs AO"
on public.appels_offres_documents for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture pages publiees" on public.pages;
create policy "Lecture pages publiees"
on public.pages for select to anon, authenticated
using (publie = true and deleted_at is null);

drop policy if exists "Admins gèrent pages" on public.pages;
create policy "Admins gèrent pages"
on public.pages for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture sections pages publiees" on public.sections_pages;
create policy "Lecture sections pages publiees"
on public.sections_pages for select to anon, authenticated
using (
  active = true
  and exists (
    select 1 from public.pages p
    where p.id = page_id and p.publie = true and p.deleted_at is null
  )
);

drop policy if exists "Admins gèrent sections pages" on public.sections_pages;
create policy "Admins gèrent sections pages"
on public.sections_pages for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture enquetes publiques" on public.enquetes;
create policy "Lecture enquetes publiques"
on public.enquetes for select to anon, authenticated
using (
  deleted_at is null
  and statut = 'publiee'
  and visibilite = 'publique'
  and (date_ouverture is null or date_ouverture <= now())
  and (date_cloture is null or date_cloture >= now())
);

drop policy if exists "Admins gèrent enquetes" on public.enquetes;
create policy "Admins gèrent enquetes"
on public.enquetes for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Lecture questions enquetes publiques" on public.questions_enquete;
create policy "Lecture questions enquetes publiques"
on public.questions_enquete for select to anon, authenticated
using (
  exists (
    select 1 from public.enquetes e
    where e.id = enquete_id
      and e.statut = 'publiee'
      and e.visibilite = 'publique'
      and e.deleted_at is null
  )
);

drop policy if exists "Lecture options questions publiques" on public.options_questions;
create policy "Lecture options questions publiques"
on public.options_questions for select to anon, authenticated
using (
  exists (
    select 1
    from public.questions_enquete q
    join public.enquetes e on e.id = q.enquete_id
    where q.id = question_id
      and e.statut = 'publiee'
      and e.visibilite = 'publique'
      and e.deleted_at is null
  )
);

-- Soumission publique des réponses (insert only) pour enquêtes publiques
drop policy if exists "Public soumet reponses enquete" on public.reponses_enquete;
create policy "Public soumet reponses enquete"
on public.reponses_enquete for insert to anon, authenticated
with check (
  exists (
    select 1 from public.enquetes e
    where e.id = enquete_id
      and e.statut = 'publiee'
      and e.visibilite = 'publique'
      and e.deleted_at is null
  )
);

drop policy if exists "Public soumet reponses questions" on public.reponses_questions;
create policy "Public soumet reponses questions"
on public.reponses_questions for insert to anon, authenticated
with check (
  exists (
    select 1
    from public.reponses_enquete r
    join public.enquetes e on e.id = r.enquete_id
    where r.id = reponse_enquete_id
      and e.statut = 'publiee'
      and e.visibilite = 'publique'
  )
);

drop policy if exists "Admins lisent reponses enquete" on public.reponses_enquete;
create policy "Admins lisent reponses enquete"
on public.reponses_enquete for select to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Admins lisent reponses questions" on public.reponses_questions;
create policy "Admins lisent reponses questions"
on public.reponses_questions for select to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

drop policy if exists "Admins gèrent agents" on public.agents_terrain;
create policy "Admins gèrent agents"
on public.agents_terrain for all to authenticated
using (
  public.has_permission('equipe_gerer')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('equipe_gerer')
  or public.has_role('super_admin')
);

-- Permissions app (alignées sur src/config/permissions.ts)
insert into public.permissions (nom, description)
values
  ('enquetes:read', 'Lire les enquêtes'),
  ('enquetes:write', 'Gérer les enquêtes'),
  ('agents:read', 'Lire les agents'),
  ('agents:write', 'Gérer les agents'),
  ('pages:write', 'Gérer les pages CMS'),
  ('temoignages:write', 'Gérer les témoignages'),
  ('appels-offres:read', 'Lire les appels d’offres'),
  ('appels-offres:write', 'Gérer les appels d’offres'),
  ('histoires:read', 'Lire les histoires d’impact'),
  ('histoires:write', 'Gérer les histoires d’impact'),
  ('opportunites:read', 'Lire les opportunités'),
  ('opportunites:write', 'Modifier les opportunités'),
  ('documents:read', 'Lire les documents'),
  ('documents:write', 'Modifier les documents'),
  ('candidatures:read', 'Lire les candidatures'),
  ('candidatures:write', 'Traiter les candidatures')
on conflict (nom) do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom = 'super_admin'
  and p.nom in (
    'enquetes:read', 'enquetes:write', 'agents:read', 'agents:write',
    'pages:write', 'temoignages:write', 'appels-offres:read', 'appels-offres:write',
    'histoires:read', 'histoires:write'
  )
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in (
  'enquetes:read', 'enquetes:write', 'agents:read', 'agents:write',
  'pages:write', 'temoignages:write', 'appels-offres:read', 'appels-offres:write',
  'histoires:read', 'histoires:write'
)
where r.nom in ('administrateur', 'direction_generale')
on conflict do nothing;
