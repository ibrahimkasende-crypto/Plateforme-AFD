-- Complément non destructif : colonnes candidatures, storage policies, niveaux confidentialité.

alter table candidatures
  add column if not exists pays text,
  add column if not exists ville text,
  add column if not exists niveau_etudes text,
  add column if not exists experience text,
  add column if not exists domaine_souhaite text,
  add column if not exists note_interne text,
  add column if not exists responsable_id uuid,
  add column if not exists lettre_storage_path text;

alter table documents
  drop constraint if exists documents_niveau_confidentialite_check;

alter table documents
  add constraint documents_niveau_confidentialite_check
  check (niveau_confidentialite in ('public','interne','partenaire','confidentiel','restreint'));

alter table documents
  add column if not exists langue text default 'fr',
  add column if not exists annee integer,
  add column if not exists auteur text,
  add column if not exists couverture_path text,
  add column if not exists nombre_pages integer,
  add column if not exists programme_id uuid,
  add column if not exists projet_id uuid,
  add column if not exists telechargements_count bigint not null default 0;

create table if not exists departements (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists categories_opportunites (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into departements (nom, slug) values
  ('Direction générale', 'direction-generale'),
  ('Programmes', 'programmes'),
  ('Ressources humaines', 'ressources-humaines'),
  ('Administration et finance', 'administration-finance'),
  ('Communication', 'communication'),
  ('MEAL', 'meal')
on conflict (slug) do nothing;

insert into categories_opportunites (nom, slug) values
  ('Emploi', 'emploi'),
  ('Stage', 'stage'),
  ('Volontariat', 'volontariat'),
  ('Consultance', 'consultance'),
  ('Appel à candidatures', 'appel-candidatures'),
  ('Appel à manifestation d’intérêt', 'ami'),
  ('Formation', 'formation'),
  ('Recrutement de prestataire', 'prestataire')
on conflict (slug) do nothing;

alter table departements enable row level security;
alter table categories_opportunites enable row level security;

drop policy if exists "Départements publics" on departements;
create policy "Départements publics" on departements for select to anon, authenticated using (true);
drop policy if exists "Catégories opportunités publiques" on categories_opportunites;
create policy "Catégories opportunités publiques" on categories_opportunites for select to anon, authenticated using (true);
drop policy if exists "Admins gèrent les départements" on departements;
create policy "Admins gèrent les départements" on departements for all to authenticated
using (public.is_active_admin()) with check (public.is_active_admin());
drop policy if exists "Admins gèrent catégories opportunités" on categories_opportunites;
create policy "Admins gèrent catégories opportunités" on categories_opportunites for all to authenticated
using (public.is_active_admin()) with check (public.is_active_admin());

-- Insert public anonyme pour stats de téléchargement
drop policy if exists "Insert téléchargements anonymes" on telechargements_documents;
create policy "Insert téléchargements anonymes" on telechargements_documents
for insert to anon, authenticated
with check (
  exists (
    select 1 from documents d
    where d.id = document_id
      and d.publie = true
      and d.niveau_confidentialite = 'public'
      and d.deleted_at is null
  )
);

-- Storage policies (buckets déjà créés dans 006)
drop policy if exists "Public lit documents-publics" on storage.objects;
create policy "Public lit documents-publics" on storage.objects
for select to anon, authenticated
using (bucket_id = 'documents-publics');

drop policy if exists "Admins gèrent documents-publics" on storage.objects;
create policy "Admins gèrent documents-publics" on storage.objects
for all to authenticated
using (bucket_id = 'documents-publics' and public.is_active_admin())
with check (bucket_id = 'documents-publics' and public.is_active_admin());

drop policy if exists "Admins gèrent documents-prives" on storage.objects;
create policy "Admins gèrent documents-prives" on storage.objects
for all to authenticated
using (bucket_id = 'documents-prives' and public.is_active_admin())
with check (bucket_id = 'documents-prives' and public.is_active_admin());

drop policy if exists "Admins gèrent candidatures-privees" on storage.objects;
create policy "Admins gèrent candidatures-privees" on storage.objects
for all to authenticated
using (bucket_id = 'candidatures-privees' and public.is_active_admin())
with check (bucket_id = 'candidatures-privees' and public.is_active_admin());

-- Dépôt CV par le public : insert uniquement dans candidatures/{id}/...
drop policy if exists "Public dépose candidatures" on storage.objects;
create policy "Public dépose candidatures" on storage.objects
for insert to anon, authenticated
with check (
  bucket_id = 'candidatures-privees'
  and (storage.foldername(name))[1] = 'candidatures'
);

