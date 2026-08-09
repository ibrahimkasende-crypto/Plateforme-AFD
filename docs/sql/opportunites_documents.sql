-- Copie pratique de la migration 20260718_006_opportunites_documents.sql.
create extension if not exists pgcrypto;
create table if not exists opportunites (
  id uuid primary key default gen_random_uuid(), titre text not null, slug text not null unique, reference text unique,
  type text not null default 'emploi', departement text, localisation text, mode_travail text, type_contrat text, duree text,
  description text not null, responsabilites text, profil_recherche text, competences text[] not null default '{}',
  niveau_etudes text, experience text, conditions text, pieces_requises text[] not null default '{}',
  methode_candidature text not null default 'formulaire', url_externe text, email_candidature text,
  date_publication timestamptz, date_limite timestamptz, statut text not null default 'brouillon'
    check (statut in ('brouillon','ouverte','bientot_cloturee','cloturee','suspendue','pourvue')),
  publie boolean not null default false, candidatures_spontanees_autorisees boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz
);
create table if not exists candidatures (
  id uuid primary key default gen_random_uuid(), opportunite_id uuid references opportunites(id) on delete set null,
  est_spontanee boolean not null default false, prenom text not null, nom text not null, email text not null, telephone text,
  localisation text, lettre_motivation text not null, cv_storage_path text, statut text not null default 'reçue'
    check (statut in ('reçue','en_examen','retenue','refusee','archivee')),
  consentement boolean not null default false, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
  constraint candidature_consentement_check check (consentement = true),
  constraint candidature_cible_check check ((est_spontanee = true and opportunite_id is null) or (est_spontanee = false and opportunite_id is not null))
);
create table if not exists documents_candidature (
  id uuid primary key default gen_random_uuid(), candidature_id uuid not null references candidatures(id) on delete cascade,
  nom_fichier text not null, chemin_storage text not null, type_mime text, taille_octets bigint, created_at timestamptz not null default now()
);
create table if not exists categories_documents (
  id uuid primary key default gen_random_uuid(), nom text not null unique, slug text not null unique, description text, created_at timestamptz not null default now()
);
create table if not exists documents (
  id uuid primary key default gen_random_uuid(), titre text not null, slug text not null unique, description text, type text not null default 'document',
  categorie_id uuid references categories_documents(id) on delete set null, fichier_storage_path text not null, nom_fichier text, type_mime text,
  taille_octets bigint, niveau_confidentialite text not null default 'public' check (niveau_confidentialite in ('public','interne','restreint')),
  publie boolean not null default false, date_publication timestamptz, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), deleted_at timestamptz
);
create table if not exists telechargements_documents (
  id uuid primary key default gen_random_uuid(), document_id uuid not null references documents(id) on delete cascade,
  telecharge_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb
);
create index if not exists opportunites_public_index on opportunites (publie, statut, date_publication desc) where deleted_at is null;
create index if not exists documents_public_index on documents (publie, niveau_confidentialite, date_publication desc) where deleted_at is null;
create index if not exists candidatures_opportunite_index on candidatures (opportunite_id, created_at desc);
drop trigger if exists opportunites_set_updated_at on opportunites;
create trigger opportunites_set_updated_at before update on opportunites for each row execute function public.set_updated_at();
drop trigger if exists candidatures_set_updated_at on candidatures;
create trigger candidatures_set_updated_at before update on candidatures for each row execute function public.set_updated_at();
drop trigger if exists documents_set_updated_at on documents;
create trigger documents_set_updated_at before update on documents for each row execute function public.set_updated_at();
insert into categories_documents (nom, slug, description) values
  ('Rapports', 'rapports', 'Rapports institutionnels et thématiques'),
  ('Politiques', 'politiques', 'Politiques et documents de référence'),
  ('Publications', 'publications', 'Publications institutionnelles') on conflict (slug) do nothing;
alter table opportunites enable row level security;
alter table candidatures enable row level security;
alter table documents_candidature enable row level security;
alter table documents enable row level security;
alter table telechargements_documents enable row level security;
alter table categories_documents enable row level security;
create policy "Opportunités publiées accessibles publiquement" on opportunites for select to anon, authenticated using (publie = true and deleted_at is null and statut in ('ouverte','bientot_cloturee','cloturee','suspendue','pourvue'));
create policy "Candidatures publiques créables" on candidatures for insert to anon, authenticated with check (
  consentement = true and deleted_at is null and (
    est_spontanee = true or exists (
      select 1 from opportunites o where o.id = opportunite_id and o.publie = true and o.deleted_at is null
      and o.statut in ('ouverte', 'bientot_cloturee') and (o.date_limite is null or o.date_limite >= now())
    )
  )
);
create policy "Documents publics accessibles publiquement" on documents for select to anon, authenticated using (publie = true and niveau_confidentialite = 'public' and deleted_at is null);
create policy "Catégories publiques accessibles" on categories_documents for select to anon, authenticated using (true);
create policy "Admins gèrent les opportunités" on opportunites for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admins gèrent les candidatures" on candidatures for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admins gèrent les documents de candidature" on documents_candidature for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admins gèrent les documents" on documents for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admins gèrent les téléchargements" on telechargements_documents for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admins gèrent les catégories" on categories_documents for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
insert into storage.buckets (id, name, public) values
  ('candidatures-privees', 'candidatures-privees', false),
  ('documents-publics', 'documents-publics', true),
  ('documents-prives', 'documents-prives', false) on conflict (id) do nothing;

