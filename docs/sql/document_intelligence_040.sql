-- OCR Document Intelligence — migration non destructive (040).
-- Pipeline d'import intelligent : stockage privé, file OCR, extraction, révision, approbation.
-- PRÉREQUIS : has_permission / has_role (20260715_001), set_updated_at, journal_activite (005).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types énumérés (text checks) — statuts métier OCR
-- ---------------------------------------------------------------------------

-- documents_importes.status
-- uploaded → queued → processing → ocr_complete → extraction_complete → review_pending
-- → reviewed → approved | rejected → applied → archived | error

-- ocr_jobs.status : queued | claimed | processing | completed | failed | cancelled

-- ---------------------------------------------------------------------------
-- Bucket Storage privé OCR
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents-ocr-prives',
  'documents-ocr-prives',
  false,
  52428800, -- 50 Mo
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/tiff',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "OCR privé — lecture authentifiée" on storage.objects;
create policy "OCR privé — lecture authentifiée"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents-ocr-prives'
  and public.has_permission('ocr.view')
);

drop policy if exists "OCR privé — upload authentifié" on storage.objects;
create policy "OCR privé — upload authentifié"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents-ocr-prives'
  and public.has_permission('ocr.upload')
  and name !~ '(^|/)\.{1,2}(/|$)'
);

drop policy if exists "OCR privé — mise à jour authentifiée" on storage.objects;
create policy "OCR privé — mise à jour authentifiée"
on storage.objects for update to authenticated
using (
  bucket_id = 'documents-ocr-prives'
  and (
    public.has_permission('ocr.process')
    or public.has_permission('ocr.manage_models')
  )
)
with check (
  bucket_id = 'documents-ocr-prives'
  and (
    public.has_permission('ocr.process')
    or public.has_permission('ocr.manage_models')
  )
);

drop policy if exists "OCR privé — suppression super admin" on storage.objects;
create policy "OCR privé — suppression super admin"
on storage.objects for delete to authenticated
using (
  bucket_id = 'documents-ocr-prives'
  and public.has_role('super_admin')
);

-- ---------------------------------------------------------------------------
-- Table principale : documents importés
-- ---------------------------------------------------------------------------
create table if not exists public.documents_importes (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  type_document text not null default 'autre',
  module_source text,
  module_cible text
    check (module_cible is null or module_cible in (
      'finances', 'budgets', 'depenses', 'stocks', 'logistique', 'projets',
      'activites', 'beneficiaires', 'indicateurs', 'rapports', 'documents', 'autre'
    )),
  programme_id uuid,
  projet_id uuid,
  province_id uuid,
  periode_debut date,
  periode_fin date,
  bucket text not null default 'documents-ocr-prives',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint,
  page_count integer,
  language text default 'fr',
  status text not null default 'uploaded'
    check (status in (
      'uploaded', 'security_check', 'queued', 'processing', 'extracted',
      'needs_review', 'inconsistent', 'suspicious', 'approved', 'rejected',
      'applying', 'applied', 'failed', 'archived'
    )),
  processing_progress integer not null default 0
    check (processing_progress >= 0 and processing_progress <= 100),
  ocr_provider text,
  hash_sha256 text,
  duplicate_of_id uuid references public.documents_importes(id) on delete set null,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  applied_at timestamptz,
  archived_at timestamptz,
  classification_sensibilite text not null default 'interne'
    check (classification_sensibilite in (
      'public', 'interne', 'sensible', 'confidentiel', 'strictement_confidentiel'
    )),
  provenance_source text,
  devise text default 'USD',
  organisation_id text,
  notes text,
  error_message text,
  integrity_status text not null default 'pending'
    check (integrity_status in ('pending', 'verified', 'suspicious', 'failed')),
  provenance_confidence numeric(5, 4)
    check (provenance_confidence is null or (provenance_confidence >= 0 and provenance_confidence <= 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_importes_hash_sha256_idx
  on public.documents_importes (hash_sha256)
  where hash_sha256 is not null;
create index if not exists documents_importes_status_idx
  on public.documents_importes (status);
create index if not exists documents_importes_created_at_idx
  on public.documents_importes (created_at desc);
create index if not exists documents_importes_module_cible_idx
  on public.documents_importes (module_cible, status);
create index if not exists documents_importes_duplicate_idx
  on public.documents_importes (duplicate_of_id)
  where duplicate_of_id is not null;

-- ---------------------------------------------------------------------------
-- File de jobs OCR
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_jobs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued', 'claimed', 'processing', 'completed', 'failed', 'cancelled')),
  provider text,
  priority integer not null default 0,
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  error_message text,
  progress integer not null default 0
    check (progress >= 0 and progress <= 100),
  payload jsonb not null default '{}'::jsonb,
  result_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ocr_jobs_document_id_idx on public.ocr_jobs (document_id);
create index if not exists ocr_jobs_status_priority_idx
  on public.ocr_jobs (status, priority desc, queued_at asc)
  where status in ('queued', 'claimed', 'processing');
create index if not exists ocr_jobs_created_at_idx on public.ocr_jobs (created_at desc);

-- ---------------------------------------------------------------------------
-- Résultats OCR : pages, blocs, tableaux
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  job_id uuid references public.ocr_jobs(id) on delete set null,
  page_number integer not null check (page_number >= 1),
  width_px integer,
  height_px integer,
  rotation_degrees integer not null default 0,
  image_storage_path text,
  text_content text,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  status text not null default 'extracted'
    check (status in ('pending', 'extracted', 'reviewed', 'error')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (document_id, page_number)
);

create index if not exists ocr_pages_document_id_idx on public.ocr_pages (document_id);

create table if not exists public.ocr_blocs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  page_id uuid not null references public.ocr_pages(id) on delete cascade,
  block_type text not null default 'paragraph'
    check (block_type in ('paragraph', 'heading', 'list', 'table', 'figure', 'signature', 'stamp', 'other')),
  bbox jsonb not null default '{}'::jsonb,
  text_content text,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ocr_blocs_document_id_idx on public.ocr_blocs (document_id);
create index if not exists ocr_blocs_page_id_idx on public.ocr_blocs (page_id);

create table if not exists public.ocr_tables (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  page_id uuid references public.ocr_pages(id) on delete set null,
  table_index integer not null default 0,
  row_count integer,
  col_count integer,
  headers jsonb not null default '[]'::jsonb,
  cells jsonb not null default '[]'::jsonb,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  bbox jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ocr_tables_document_id_idx on public.ocr_tables (document_id);

-- ---------------------------------------------------------------------------
-- Extraction structurée et normalisation
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_modeles_extraction (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  module_cible text not null
    check (module_cible in ('finance', 'stock', 'activite', 'beneficiaires', 'rapports', 'autre')),
  version text not null default '1.0.0',
  definition jsonb not null default '{}'::jsonb,
  actif boolean not null default true,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ocr_champs_extraits (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  job_id uuid references public.ocr_jobs(id) on delete set null,
  modele_id uuid references public.ocr_modeles_extraction(id) on delete set null,
  field_key text not null,
  field_label text,
  raw_value text,
  value_type text not null default 'text'
    check (value_type in ('text', 'number', 'date', 'currency', 'boolean', 'json')),
  page_number integer,
  bbox jsonb not null default '{}'::jsonb,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  source_block_id uuid references public.ocr_blocs(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ocr_champs_extraits_document_id_idx
  on public.ocr_champs_extraits (document_id);
create index if not exists ocr_champs_extraits_field_key_idx
  on public.ocr_champs_extraits (document_id, field_key);

create table if not exists public.ocr_valeurs_normalisees (
  id uuid primary key default gen_random_uuid(),
  champ_id uuid not null references public.ocr_champs_extraits(id) on delete cascade,
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  normalized_value text,
  normalized_number numeric,
  normalized_date date,
  normalized_type text not null default 'text'
    check (normalized_type in ('text', 'number', 'date', 'currency', 'boolean', 'json')),
  unit text,
  currency text,
  validation_status text not null default 'pending'
    check (validation_status in ('pending', 'valid', 'invalid', 'manual_override')),
  validation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ocr_valeurs_normalisees_document_id_idx
  on public.ocr_valeurs_normalisees (document_id);
create index if not exists ocr_valeurs_normalisees_champ_id_idx
  on public.ocr_valeurs_normalisees (champ_id);

-- ---------------------------------------------------------------------------
-- Règles de validation et anomalies
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_regles_validation (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  nom text not null,
  module_cible text not null
    check (module_cible in ('finance', 'stock', 'activite', 'beneficiaires', 'rapports', 'autre')),
  rule_type text not null default 'arithmetic'
    check (rule_type in ('arithmetic', 'range', 'required', 'cross_field', 'custom')),
  expression jsonb not null default '{}'::jsonb,
  severity text not null default 'warning'
    check (severity in ('info', 'warning', 'error', 'critical')),
  actif boolean not null default true,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ocr_anomalies (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  regle_id uuid references public.ocr_regles_validation(id) on delete set null,
  champ_id uuid references public.ocr_champs_extraits(id) on delete set null,
  anomaly_type text not null default 'validation'
    check (anomaly_type in ('validation', 'integrity', 'duplicate', 'format', 'provenance', 'other')),
  message text not null,
  severity text not null default 'warning'
    check (severity in ('info', 'warning', 'error', 'critical')),
  status text not null default 'open'
    check (status in ('open', 'acknowledged', 'resolved', 'ignored')),
  details jsonb not null default '{}'::jsonb,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ocr_anomalies_document_id_idx on public.ocr_anomalies (document_id);
create index if not exists ocr_anomalies_status_idx on public.ocr_anomalies (status);

-- ---------------------------------------------------------------------------
-- Révisions, approbations, applications
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_revisions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  revision_number integer not null default 1,
  author_id uuid references auth.users(id) on delete set null,
  changes jsonb not null default '{}'::jsonb,
  comment text,
  created_at timestamptz not null default now(),
  unique (document_id, revision_number)
);

create index if not exists ocr_revisions_document_id_idx on public.ocr_revisions (document_id);

create table if not exists public.ocr_approbations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  approver_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  comment text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ocr_approbations_document_id_idx on public.ocr_approbations (document_id);

create table if not exists public.ocr_applications (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  applied_by uuid references auth.users(id) on delete set null,
  target_module text not null,
  target_table text,
  applied_rows integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'applied', 'partial', 'failed', 'rolled_back')),
  rollback_data jsonb not null default '{}'::jsonb,
  error_message text,
  applied_at timestamptz,
  rolled_back_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ocr_applications_document_id_idx on public.ocr_applications (document_id);
create index if not exists ocr_applications_status_idx on public.ocr_applications (status);

-- ---------------------------------------------------------------------------
-- Empreintes, signatures, provenance, versions
-- ---------------------------------------------------------------------------
create table if not exists public.document_fingerprints (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  hash_sha256 text not null,
  hash_md5 text,
  perceptual_hash text,
  algorithm text not null default 'sha256',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists document_fingerprints_document_id_idx
  on public.document_fingerprints (document_id);
create index if not exists document_fingerprints_hash_sha256_idx
  on public.document_fingerprints (hash_sha256);

create table if not exists public.document_signatures (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  signature_type text not null default 'manuscrite'
    check (signature_type in ('manuscrite', 'electronique', 'tampon', 'autre')),
  signer_name text,
  signed_at timestamptz,
  bbox jsonb not null default '{}'::jsonb,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  verified boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists document_signatures_document_id_idx
  on public.document_signatures (document_id);

create table if not exists public.document_provenance (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  source_type text not null default 'upload'
    check (source_type in ('upload', 'email', 'scan', 'api', 'import_batch', 'autre')),
  source_ref text,
  confidence numeric(5, 4)
    check (confidence is null or (confidence >= 0 and confidence <= 1)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists document_provenance_document_id_idx
  on public.document_provenance (document_id);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  version_number integer not null default 1,
  storage_path text not null,
  hash_sha256 text,
  mime_type text,
  size_bytes bigint,
  created_by uuid references auth.users(id) on delete set null,
  comment text,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create index if not exists document_versions_document_id_idx
  on public.document_versions (document_id);

-- ---------------------------------------------------------------------------
-- Imports de données vers modules cibles
-- ---------------------------------------------------------------------------
create table if not exists public.imports_donnees (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  application_id uuid references public.ocr_applications(id) on delete set null,
  module_cible text not null,
  status text not null default 'draft'
    check (status in ('draft', 'validated', 'applied', 'failed', 'rolled_back')),
  row_count integer not null default 0,
  error_count integer not null default 0,
  applied_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists imports_donnees_document_id_idx on public.imports_donnees (document_id);
create index if not exists imports_donnees_status_idx on public.imports_donnees (status);

create table if not exists public.imports_donnees_lignes (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.imports_donnees(id) on delete cascade,
  document_id uuid not null references public.documents_importes(id) on delete cascade,
  line_number integer not null,
  target_table text,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'applied', 'skipped', 'error')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists imports_donnees_lignes_import_id_idx
  on public.imports_donnees_lignes (import_id);
create index if not exists imports_donnees_lignes_document_id_idx
  on public.imports_donnees_lignes (document_id);

-- ---------------------------------------------------------------------------
-- Notifications OCR
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents_importes(id) on delete cascade,
  type text not null default 'info'
    check (type in ('info', 'review_required', 'approved', 'rejected', 'applied', 'error')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ocr_notifications_user_id_idx
  on public.ocr_notifications (user_id, created_at desc);
create index if not exists ocr_notifications_document_id_idx
  on public.ocr_notifications (document_id);

-- ---------------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------------
drop trigger if exists documents_importes_set_updated_at on public.documents_importes;
create trigger documents_importes_set_updated_at
before update on public.documents_importes
for each row execute function public.set_updated_at();

drop trigger if exists ocr_jobs_set_updated_at on public.ocr_jobs;
create trigger ocr_jobs_set_updated_at
before update on public.ocr_jobs
for each row execute function public.set_updated_at();

drop trigger if exists ocr_pages_set_updated_at on public.ocr_pages;
create trigger ocr_pages_set_updated_at
before update on public.ocr_pages
for each row execute function public.set_updated_at();

drop trigger if exists ocr_valeurs_normalisees_set_updated_at on public.ocr_valeurs_normalisees;
create trigger ocr_valeurs_normalisees_set_updated_at
before update on public.ocr_valeurs_normalisees
for each row execute function public.set_updated_at();

drop trigger if exists ocr_modeles_extraction_set_updated_at on public.ocr_modeles_extraction;
create trigger ocr_modeles_extraction_set_updated_at
before update on public.ocr_modeles_extraction
for each row execute function public.set_updated_at();

drop trigger if exists ocr_regles_validation_set_updated_at on public.ocr_regles_validation;
create trigger ocr_regles_validation_set_updated_at
before update on public.ocr_regles_validation
for each row execute function public.set_updated_at();

drop trigger if exists imports_donnees_set_updated_at on public.imports_donnees;
create trigger imports_donnees_set_updated_at
before update on public.imports_donnees
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Helpers RLS OCR
-- ---------------------------------------------------------------------------
create or replace function public._ocr_can_view_sensitive(p_classification text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(p_classification, 'interne') in ('public', 'interne')
    or public.has_permission('ocr.view_sensitive');
$$;

create or replace function public._ocr_document_visible(p_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.documents_importes d
    where d.id = p_document_id
      and public.has_permission('ocr.view')
      and public._ocr_can_view_sensitive(d.classification_sensibilite)
  );
$$;

revoke all on function public._ocr_can_view_sensitive(text) from public;
revoke all on function public._ocr_document_visible(uuid) from public;
grant execute on function public._ocr_can_view_sensitive(text) to authenticated;
grant execute on function public._ocr_document_visible(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS — activation
-- ---------------------------------------------------------------------------
alter table public.documents_importes enable row level security;
alter table public.ocr_jobs enable row level security;
alter table public.ocr_pages enable row level security;
alter table public.ocr_blocs enable row level security;
alter table public.ocr_tables enable row level security;
alter table public.ocr_champs_extraits enable row level security;
alter table public.ocr_valeurs_normalisees enable row level security;
alter table public.ocr_modeles_extraction enable row level security;
alter table public.ocr_regles_validation enable row level security;
alter table public.ocr_anomalies enable row level security;
alter table public.ocr_revisions enable row level security;
alter table public.ocr_approbations enable row level security;
alter table public.ocr_applications enable row level security;
alter table public.document_fingerprints enable row level security;
alter table public.document_signatures enable row level security;
alter table public.document_provenance enable row level security;
alter table public.document_versions enable row level security;
alter table public.imports_donnees enable row level security;
alter table public.imports_donnees_lignes enable row level security;
alter table public.ocr_notifications enable row level security;

-- documents_importes
drop policy if exists "OCR documents — lecture" on public.documents_importes;
create policy "OCR documents — lecture"
on public.documents_importes for select to authenticated
using (
  public.has_permission('ocr.view')
  and public._ocr_can_view_sensitive(classification_sensibilite)
);

drop policy if exists "OCR documents — upload" on public.documents_importes;
create policy "OCR documents — upload"
on public.documents_importes for insert to authenticated
with check (public.has_permission('ocr.upload'));

drop policy if exists "OCR documents — traitement" on public.documents_importes;
create policy "OCR documents — traitement"
on public.documents_importes for update to authenticated
using (
  public.has_permission('ocr.process')
  or public.has_permission('ocr.review')
  or public.has_permission('ocr.approve')
  or public.has_permission('ocr.apply')
  or public.has_permission('ocr.reject')
  or public.has_permission('ocr.verify_integrity')
)
with check (
  public.has_permission('ocr.process')
  or public.has_permission('ocr.review')
  or public.has_permission('ocr.approve')
  or public.has_permission('ocr.apply')
  or public.has_permission('ocr.reject')
  or public.has_permission('ocr.verify_integrity')
);

-- ocr_jobs
drop policy if exists "OCR jobs — lecture" on public.ocr_jobs;
create policy "OCR jobs — lecture"
on public.ocr_jobs for select to authenticated
using (public._ocr_document_visible(document_id));

drop policy if exists "OCR jobs — création" on public.ocr_jobs;
create policy "OCR jobs — création"
on public.ocr_jobs for insert to authenticated
with check (
  public.has_permission('ocr.upload') or public.has_permission('ocr.process')
);

drop policy if exists "OCR jobs — mise à jour worker" on public.ocr_jobs;
create policy "OCR jobs — mise à jour worker"
on public.ocr_jobs for update to authenticated
using (public.has_permission('ocr.process'))
with check (public.has_permission('ocr.process'));

-- Tables liées au document (lecture via visibilité document)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'ocr_pages', 'ocr_blocs', 'ocr_tables', 'ocr_champs_extraits',
    'ocr_valeurs_normalisees', 'ocr_anomalies', 'ocr_revisions',
    'document_fingerprints', 'document_signatures', 'document_provenance',
    'document_versions', 'imports_donnees', 'imports_donnees_lignes'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', 'OCR ' || tbl || ' — lecture', tbl);
    execute format(
      $p$
      create policy %I on public.%I for select to authenticated
      using (public._ocr_document_visible(document_id))
      $p$,
      'OCR ' || tbl || ' — lecture', tbl
    );

    execute format('drop policy if exists %I on public.%I', 'OCR ' || tbl || ' — écriture process', tbl);
    execute format(
      $p$
      create policy %I on public.%I for insert to authenticated
      with check (public.has_permission('ocr.process'))
      $p$,
      'OCR ' || tbl || ' — écriture process', tbl
    );

    execute format('drop policy if exists %I on public.%I', 'OCR ' || tbl || ' — update process', tbl);
    execute format(
      $p$
      create policy %I on public.%I for update to authenticated
      using (public.has_permission('ocr.process') or public.has_permission('ocr.review'))
      with check (public.has_permission('ocr.process') or public.has_permission('ocr.review'))
      $p$,
      'OCR ' || tbl || ' — update process', tbl
    );
  end loop;
end $$;

-- ocr_modeles_extraction
drop policy if exists "OCR modèles — lecture" on public.ocr_modeles_extraction;
create policy "OCR modèles — lecture"
on public.ocr_modeles_extraction for select to authenticated
using (public.has_permission('ocr.view') or public.has_permission('ocr.manage_models'));

drop policy if exists "OCR modèles — gestion" on public.ocr_modeles_extraction;
create policy "OCR modèles — gestion"
on public.ocr_modeles_extraction for all to authenticated
using (public.has_permission('ocr.manage_models'))
with check (public.has_permission('ocr.manage_models'));

-- ocr_regles_validation
drop policy if exists "OCR règles — lecture" on public.ocr_regles_validation;
create policy "OCR règles — lecture"
on public.ocr_regles_validation for select to authenticated
using (public.has_permission('ocr.view') or public.has_permission('ocr.manage_rules'));

drop policy if exists "OCR règles — gestion" on public.ocr_regles_validation;
create policy "OCR règles — gestion"
on public.ocr_regles_validation for all to authenticated
using (public.has_permission('ocr.manage_rules'))
with check (public.has_permission('ocr.manage_rules'));

-- ocr_approbations
drop policy if exists "OCR approbations — lecture" on public.ocr_approbations;
create policy "OCR approbations — lecture"
on public.ocr_approbations for select to authenticated
using (public._ocr_document_visible(document_id));

drop policy if exists "OCR approbations — création" on public.ocr_approbations;
create policy "OCR approbations — création"
on public.ocr_approbations for insert to authenticated
with check (
  public.has_permission('ocr.approve')
  or public.has_permission('ocr.reject')
);

drop policy if exists "OCR approbations — mise à jour" on public.ocr_approbations;
create policy "OCR approbations — mise à jour"
on public.ocr_approbations for update to authenticated
using (public.has_permission('ocr.approve') or public.has_permission('ocr.reject'))
with check (public.has_permission('ocr.approve') or public.has_permission('ocr.reject'));

-- ocr_applications
drop policy if exists "OCR applications — lecture" on public.ocr_applications;
create policy "OCR applications — lecture"
on public.ocr_applications for select to authenticated
using (public._ocr_document_visible(document_id));

drop policy if exists "OCR applications — écriture" on public.ocr_applications;
create policy "OCR applications — écriture"
on public.ocr_applications for insert to authenticated
with check (public.has_permission('ocr.apply'));

drop policy if exists "OCR applications — mise à jour" on public.ocr_applications;
create policy "OCR applications — mise à jour"
on public.ocr_applications for update to authenticated
using (
  public.has_permission('ocr.apply')
  or public.has_permission('ocr.rollback_import')
)
with check (
  public.has_permission('ocr.apply')
  or public.has_permission('ocr.rollback_import')
);

-- ocr_notifications
drop policy if exists "OCR notifications — lecture titulaire" on public.ocr_notifications;
create policy "OCR notifications — lecture titulaire"
on public.ocr_notifications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "OCR notifications — mise à jour titulaire" on public.ocr_notifications;
create policy "OCR notifications — mise à jour titulaire"
on public.ocr_notifications for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "OCR notifications — insertion système" on public.ocr_notifications;
create policy "OCR notifications — insertion système"
on public.ocr_notifications for insert to authenticated
with check (
  public.has_permission('ocr.process')
  or public.has_permission('ocr.review')
  or public.has_permission('ocr.approve')
);

-- ---------------------------------------------------------------------------
-- Permissions OCR
-- ---------------------------------------------------------------------------
insert into public.permissions (nom, description)
values
  ('ocr.view', 'Consulter les documents OCR et résultats d''extraction'),
  ('ocr.upload', 'Importer des documents pour traitement OCR'),
  ('ocr.process', 'Lancer et suivre le traitement OCR (worker)'),
  ('ocr.review', 'Réviser et corriger les extractions OCR'),
  ('ocr.approve', 'Approuver une extraction OCR validée'),
  ('ocr.apply', 'Appliquer les données OCR vers les modules cibles'),
  ('ocr.reject', 'Rejeter une extraction OCR'),
  ('ocr.manage_models', 'Gérer les modèles d''extraction OCR'),
  ('ocr.manage_rules', 'Gérer les règles de validation OCR'),
  ('ocr.view_sensitive', 'Consulter les documents OCR sensibles / confidentiels'),
  ('ocr.verify_integrity', 'Vérifier l''intégrité et la provenance des documents'),
  ('ocr.rollback_import', 'Annuler un import de données OCR appliqué')
on conflict (nom) do nothing;

-- Super admin : toutes les permissions ocr.*
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom = 'super_admin'
  and p.nom like 'ocr.%'
on conflict do nothing;

-- Finance : consultation, upload, révision, approbation, application
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in (
  'ocr.view', 'ocr.upload', 'ocr.review', 'ocr.approve', 'ocr.apply', 'ocr.verify_integrity'
)
where r.nom = 'finance'
on conflict do nothing;

-- Logistique : stock
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('ocr.view', 'ocr.upload', 'ocr.review')
where r.nom = 'logistique'
on conflict do nothing;

-- Chargé de programmes : activités
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('ocr.view', 'ocr.upload', 'ocr.review')
where r.nom = 'charge_programmes'
on conflict do nothing;

-- Coordination MEAL : lecture + révision
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('ocr.view', 'ocr.review')
where r.nom = 'coordination_meal'
on conflict do nothing;

-- Direction générale : vue élargie + approbation + données sensibles
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in (
  'ocr.view', 'ocr.review', 'ocr.approve', 'ocr.view_sensitive', 'ocr.verify_integrity'
)
where r.nom = 'direction_generale'
on conflict do nothing;

-- Administrateur : consultation et upload
insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('ocr.view', 'ocr.upload', 'ocr.review')
where r.nom = 'administrateur'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Seeds — modèles d'extraction
-- ---------------------------------------------------------------------------
insert into public.ocr_modeles_extraction (code, nom, module_cible, version, description, definition)
values
  (
    'finance_depenses_v1',
    'Rapport financier — dépenses',
    'finance',
    '1.0.0',
    'Extraction des lignes de dépenses, totaux et devise depuis rapports financiers',
    '{
      "fields": [
        {"key": "periode_debut", "label": "Période début", "type": "date", "required": true},
        {"key": "periode_fin", "label": "Période fin", "type": "date", "required": true},
        {"key": "devise", "label": "Devise", "type": "currency", "required": true},
        {"key": "montant_total", "label": "Montant total", "type": "number", "required": true},
        {"key": "lignes", "label": "Lignes de dépenses", "type": "json", "required": true,
         "schema": {"date": "date", "libelle": "text", "montant": "number", "categorie": "text"}}
      ],
      "target_tables": ["finances_depenses", "finances_budgets"],
      "language": ["fr", "en"]
    }'::jsonb
  ),
  (
    'stock_inventaire_v1',
    'Inventaire stock / logistique',
    'stock',
    '1.0.0',
    'Extraction des articles, quantités et mouvements depuis bons de livraison et inventaires',
    '{
      "fields": [
        {"key": "reference_document", "label": "Référence", "type": "text", "required": true},
        {"key": "date_mouvement", "label": "Date", "type": "date", "required": true},
        {"key": "entrepot", "label": "Entrepôt / site", "type": "text", "required": false},
        {"key": "lignes", "label": "Articles", "type": "json", "required": true,
         "schema": {"sku": "text", "designation": "text", "quantite": "number", "unite": "text", "type_mouvement": "text"}}
      ],
      "target_tables": ["stocks_mouvements"],
      "language": ["fr"]
    }'::jsonb
  ),
  (
    'activite_rapport_v1',
    'Rapport d''activité terrain',
    'activite',
    '1.0.0',
    'Extraction des participants et indicateurs depuis rapports d''activité',
    '{
      "fields": [
        {"key": "titre", "label": "Titre activité", "type": "text", "required": true},
        {"key": "date_activite", "label": "Date", "type": "date", "required": true},
        {"key": "province", "label": "Province", "type": "text", "required": false},
        {"key": "lieu", "label": "Lieu", "type": "text", "required": false},
        {"key": "femmes", "label": "Femmes", "type": "number", "required": false},
        {"key": "hommes", "label": "Hommes", "type": "number", "required": false},
        {"key": "enfants", "label": "Enfants", "type": "number", "required": false},
        {"key": "jeunes", "label": "Jeunes", "type": "number", "required": false},
        {"key": "total_participants", "label": "Total participants", "type": "number", "required": true}
      ],
      "target_tables": ["activites"],
      "language": ["fr"]
    }'::jsonb
  )
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- Seeds — règles de validation arithmétique
-- ---------------------------------------------------------------------------
insert into public.ocr_regles_validation (code, nom, module_cible, rule_type, severity, description, expression)
values
  (
    'finance_somme_lignes_total',
    'Finance — somme des lignes = montant total',
    'finance',
    'arithmetic',
    'error',
    'Vérifie que la somme des montants des lignes correspond au total déclaré',
    '{
      "left": {"op": "sum", "field": "lignes.montant"},
      "operator": "==",
      "right": {"field": "montant_total"},
      "tolerance": 0.01
    }'::jsonb
  ),
  (
    'finance_periode_coherente',
    'Finance — période cohérente',
    'finance',
    'cross_field',
    'warning',
    'La date de fin doit être postérieure ou égale à la date de début',
    '{
      "left": {"field": "periode_fin"},
      "operator": ">=",
      "right": {"field": "periode_debut"}
    }'::jsonb
  ),
  (
    'stock_quantite_positive',
    'Stock — quantités strictement positives',
    'stock',
    'range',
    'error',
    'Chaque quantité d''article doit être supérieure à zéro',
    '{
      "field": "lignes.quantite",
      "operator": ">",
      "value": 0
    }'::jsonb
  ),
  (
    'stock_balance_mouvements',
    'Stock — balance entrées / sorties',
    'stock',
    'arithmetic',
    'warning',
    'Vérifie la cohérence entrées - sorties = solde (si champs présents)',
    '{
      "left": {"op": "subtract", "fields": ["total_entrees", "total_sorties"]},
      "operator": "==",
      "right": {"field": "solde"},
      "tolerance": 0
    }'::jsonb
  ),
  (
    'activite_total_participants',
    'Activité — total participants cohérent',
    'activite',
    'arithmetic',
    'error',
    'Femmes + hommes + enfants + jeunes doit égaler le total déclaré',
    '{
      "left": {"op": "sum", "fields": ["femmes", "hommes", "enfants", "jeunes"]},
      "operator": "==",
      "right": {"field": "total_participants"},
      "tolerance": 0
    }'::jsonb
  ),
  (
    'activite_champs_requis',
    'Activité — champs obligatoires',
    'activite',
    'required',
    'error',
    'Titre et date d''activité sont obligatoires',
    '{
      "required_fields": ["titre", "date_activite", "total_participants"]
    }'::jsonb
  )
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- RPC — claim atomique du prochain job OCR (worker)
-- ---------------------------------------------------------------------------
create or replace function public.claim_ocr_job(
  p_worker_id text default null,
  p_provider text default null
)
returns public.ocr_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.ocr_jobs%rowtype;
begin
  if not (
    public.has_permission('ocr.process')
    or coalesce(auth.jwt() ->> 'role', '') = 'service_role'
  ) then
    raise exception 'Permission ocr.process requise pour claim_ocr_job';
  end if;

  select j.*
  into v_job
  from public.ocr_jobs j
  where j.status = 'queued'
    and j.attempts < j.max_attempts
    and (p_provider is null or j.provider = p_provider)
  order by j.priority desc, j.queued_at asc
  for update of j skip locked
  limit 1;

  if not found then
    return null;
  end if;

  update public.ocr_jobs
  set
    status = 'processing',
    started_at = coalesce(started_at, now()),
    attempts = attempts + 1,
    payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object(
      'claimed_by', p_worker_id,
      'claimed_at', now()
    ),
    updated_at = now()
  where id = v_job.id
  returning * into v_job;

  update public.documents_importes
  set
    status = case
      when status in ('uploaded', 'queued') then 'processing'
      else status
    end,
    processing_progress = greatest(processing_progress, 5),
    updated_at = now()
  where id = v_job.document_id;

  return v_job;
end;
$$;

revoke all on function public.claim_ocr_job(text, text) from public;
grant execute on function public.claim_ocr_job(text, text) to authenticated;
grant execute on function public.claim_ocr_job(text, text) to service_role;

-- ---------------------------------------------------------------------------
-- RPC — journalisation activité OCR (réutilise journal_activite)
-- ---------------------------------------------------------------------------
create or replace function public.log_ocr_activity(
  p_action text,
  p_details jsonb default '{}'::jsonb,
  p_document_id uuid default null,
  p_utilisateur_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_details jsonb;
begin
  v_details := coalesce(p_details, '{}'::jsonb);
  if p_document_id is not null then
    v_details := v_details || jsonb_build_object('document_id', p_document_id);
  end if;

  if to_regprocedure('public.log_admin_activity(text, jsonb, uuid)') is not null then
    perform public.log_admin_activity(
      'ocr.' || coalesce(p_action, 'event'),
      v_details,
      coalesce(p_utilisateur_id, auth.uid())
    );
  elsif to_regclass('public.journal_activite') is not null then
    insert into public.journal_activite (utilisateur_id, action, details)
    values (
      coalesce(p_utilisateur_id, auth.uid()),
      'ocr.' || coalesce(p_action, 'event'),
      v_details
    );
  end if;
end;
$$;

revoke all on function public.log_ocr_activity(text, jsonb, uuid, uuid) from public;
grant execute on function public.log_ocr_activity(text, jsonb, uuid, uuid) to authenticated;
grant execute on function public.log_ocr_activity(text, jsonb, uuid, uuid) to service_role;

