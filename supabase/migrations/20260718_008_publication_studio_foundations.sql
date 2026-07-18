-- Studio de publication AFD — fondations non destructives
-- Tables : medias, domaines_intervention, chiffres_impact, histoires_impact,
--          journal_publication + buckets Storage métier

-- ---------------------------------------------------------------------------
-- medias
-- ---------------------------------------------------------------------------
create table if not exists public.medias (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  storage_path text not null,
  filename text not null,
  original_filename text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  caption text,
  credit text,
  consent_status text not null default 'to-review'
    check (consent_status in ('approved', 'to-review', 'not-required', 'refused')),
  visibility text not null default 'public'
    check (visibility in ('public', 'private', 'unlisted')),
  content_hash text,
  resource_type text,
  resource_id uuid,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (bucket, storage_path)
);

create index if not exists medias_bucket_idx on public.medias (bucket);
create index if not exists medias_created_at_idx on public.medias (created_at desc);
create index if not exists medias_content_hash_idx on public.medias (content_hash);

-- ---------------------------------------------------------------------------
-- domaines_intervention
-- ---------------------------------------------------------------------------
create table if not exists public.domaines_intervention (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  summary text,
  description text,
  challenge text,
  response text,
  priority_actions text[] not null default '{}',
  audiences text[] not null default '{}',
  expected_results text[] not null default '{}',
  keywords text[] not null default '{}',
  topics text[] not null default '{}',
  icon text,
  image_url text,
  image_alt text,
  media_id uuid references public.medias (id) on delete set null,
  order_index integer not null default 0,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'en_revision', 'approuve', 'programme', 'publie', 'depublie', 'archive')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  source text,
  migration_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz
);

create index if not exists domaines_intervention_status_idx
  on public.domaines_intervention (status, order_index);

-- ---------------------------------------------------------------------------
-- chiffres_impact
-- ---------------------------------------------------------------------------
create table if not exists public.chiffres_impact (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  value numeric,
  unit text,
  suffix text,
  description text,
  icon text,
  order_index integer not null default 0,
  active boolean not null default true,
  validated boolean not null default false,
  validation_source text,
  reference_period text,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- histoires_impact
-- ---------------------------------------------------------------------------
create table if not exists public.histoires_impact (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  media_id uuid references public.medias (id) on delete set null,
  person_or_community text,
  anonymized boolean not null default false,
  consent_status text not null default 'to-review'
    check (consent_status in ('approved', 'to-review', 'not-required', 'refused', 'absent')),
  location text,
  programme_id uuid,
  projet_id uuid,
  quote text,
  results text,
  author text,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'en_revision', 'approuve', 'programme', 'publie', 'depublie', 'archive')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ---------------------------------------------------------------------------
-- journal_publication
-- ---------------------------------------------------------------------------
create table if not exists public.journal_publication (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null,
  resource_id uuid,
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create index if not exists journal_publication_resource_idx
  on public.journal_publication (resource_type, resource_id, created_at desc);

-- Colonnes de migration éditoriale sur actualites (si absentes)
alter table public.actualites
  add column if not exists source text,
  add column if not exists migration_note text,
  add column if not exists legacy_id text,
  add column if not exists featured boolean default false,
  add column if not exists status text default 'publie',
  add column if not exists media_id uuid references public.medias (id) on delete set null;

-- Zones d’intervention enrichies (si table provinces/zones existe déjà, on crée zones_intervention)
create table if not exists public.zones_intervention (
  id uuid primary key default gen_random_uuid(),
  province text not null unique,
  main_locality text,
  svg_id text,
  color text,
  active boolean not null default true,
  summary text,
  image_url text,
  media_id uuid references public.medias (id) on delete set null,
  projects_count integer,
  activities_count integer,
  beneficiaries_count integer,
  sectors text[] not null default '{}',
  is_demo boolean not null default false,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'publie', 'archive')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS lecture publique
-- ---------------------------------------------------------------------------
alter table public.medias enable row level security;
alter table public.domaines_intervention enable row level security;
alter table public.chiffres_impact enable row level security;
alter table public.histoires_impact enable row level security;
alter table public.journal_publication enable row level security;
alter table public.zones_intervention enable row level security;

drop policy if exists "Lecture publique medias" on public.medias;
create policy "Lecture publique medias"
on public.medias for select to anon, authenticated
using (visibility = 'public' and deleted_at is null);

drop policy if exists "Lecture domaines publies" on public.domaines_intervention;
create policy "Lecture domaines publies"
on public.domaines_intervention for select to anon, authenticated
using (status = 'publie' and deleted_at is null);

drop policy if exists "Lecture chiffres valides" on public.chiffres_impact;
create policy "Lecture chiffres valides"
on public.chiffres_impact for select to anon, authenticated
using (active = true and validated = true);

drop policy if exists "Lecture histoires publiees" on public.histoires_impact;
create policy "Lecture histoires publiees"
on public.histoires_impact for select to anon, authenticated
using (
  published = true
  and status = 'publie'
  and deleted_at is null
  and consent_status in ('approved', 'not-required')
);

drop policy if exists "Lecture zones publiees" on public.zones_intervention;
create policy "Lecture zones publiees"
on public.zones_intervention for select to anon, authenticated
using (status = 'publie' and active = true);

-- Admins : gestion via permissions existantes lorsque disponibles
drop policy if exists "Admins gerent medias" on public.medias;
create policy "Admins gerent medias"
on public.medias for all to authenticated
using (
  public.has_permission('medias_gerer')
  or public.has_permission('mediatheque:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('medias_gerer')
  or public.has_permission('mediatheque:write')
  or public.has_role('super_admin')
);

drop policy if exists "Admins gerent domaines" on public.domaines_intervention;
create policy "Admins gerent domaines"
on public.domaines_intervention for all to authenticated
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

drop policy if exists "Admins gerent chiffres" on public.chiffres_impact;
create policy "Admins gerent chiffres"
on public.chiffres_impact for all to authenticated
using (
  public.has_permission('statistiques:read')
  or public.has_permission('indicateurs:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('indicateurs:write')
  or public.has_role('super_admin')
);

drop policy if exists "Admins gerent histoires" on public.histoires_impact;
create policy "Admins gerent histoires"
on public.histoires_impact for all to authenticated
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

drop policy if exists "Admins gerent zones" on public.zones_intervention;
create policy "Admins gerent zones"
on public.zones_intervention for all to authenticated
using (
  public.has_permission('contenus_modifier')
  or public.has_permission('programmes:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('contenus_modifier')
  or public.has_permission('programmes:write')
  or public.has_role('super_admin')
);

drop policy if exists "Admins lisent journal publication" on public.journal_publication;
create policy "Admins lisent journal publication"
on public.journal_publication for select to authenticated
using (
  public.has_permission('journal:read')
  or public.has_role('super_admin')
);

drop policy if exists "Admins ecrivent journal publication" on public.journal_publication;
create policy "Admins ecrivent journal publication"
on public.journal_publication for insert to authenticated
with check (
  public.has_permission('actualites:write')
  or public.has_permission('contenus_modifier')
  or public.has_role('super_admin')
);

-- ---------------------------------------------------------------------------
-- Buckets Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('site-public', 'site-public', true),
  ('programmes', 'programmes', true),
  ('projets', 'projets', true),
  ('actualites', 'actualites', true),
  ('histoires-impact', 'histoires-impact', true),
  ('zones-intervention', 'zones-intervention', true),
  ('equipe', 'equipe', true),
  ('partenaires', 'partenaires', true),
  ('opportunites', 'opportunites', true),
  ('appels-offres', 'appels-offres', true),
  ('documents-publics', 'documents-publics', true),
  ('rapports-publics', 'rapports-publics', true),
  ('documents-prives', 'documents-prives', false),
  ('candidatures-privees', 'candidatures-privees', false)
on conflict (id) do update set public = excluded.public;

-- Politiques lecture publique pour buckets publics
do $$
declare
  b text;
begin
  foreach b in array array[
    'site-public', 'programmes', 'projets', 'actualites', 'histoires-impact',
    'zones-intervention', 'equipe', 'partenaires', 'opportunites', 'appels-offres',
    'documents-publics', 'rapports-publics'
  ]
  loop
    execute format('drop policy if exists %I on storage.objects', 'Lecture publique ' || b);
    execute format(
      'create policy %I on storage.objects for select to anon, authenticated using (bucket_id = %L)',
      'Lecture publique ' || b, b
    );
  end loop;
end $$;
