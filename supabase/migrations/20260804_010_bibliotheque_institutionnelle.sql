-- Bibliothèque institutionnelle AFD — tables autonomes (projet mxxux).
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.bibliotheque_evenements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  resume text,
  description text,
  domaine_slug text not null,
  categorie_slug text,
  categorie_label text,
  date_evenement date,
  heure_debut time,
  heure_fin time,
  lieu_nom text,
  adresse text,
  province text,
  territoire text,
  localite text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  projet text,
  partenaires text[] not null default '{}',
  tags text[] not null default '{}',
  auteur text default 'AFD ASBL',
  cover_image_url text,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'en_revision', 'approuve', 'programme', 'publie', 'depublie', 'archive', 'en_cours', 'terminee', 'archivee')),
  publie boolean not null default false,
  featured boolean not null default false,
  order_index integer not null default 0,
  seo_title text,
  seo_description text,
  download_count integer not null default 0,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.bibliotheque_images (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid not null references public.bibliotheque_evenements(id) on delete cascade,
  domaine_slug text not null,
  title text,
  caption text,
  alt_text text not null,
  storage_bucket text,
  storage_path text,
  public_url text,
  local_asset_path text,
  width integer,
  height integer,
  taken_at timestamptz,
  photographer text,
  consent_status text not null default 'to-review'
    check (consent_status in ('approved', 'to-review', 'not-required', 'refused', 'absent')),
  visibility text not null default 'public'
    check (visibility in ('public', 'private', 'unlisted')),
  is_cover boolean not null default false,
  order_index integer not null default 0,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    public_url is not null
    or local_asset_path is not null
    or (storage_bucket is not null and storage_path is not null)
  )
);

create index if not exists bibliotheque_evenements_domain_idx
  on public.bibliotheque_evenements (domaine_slug, date_evenement desc nulls last);
create index if not exists bibliotheque_evenements_public_idx
  on public.bibliotheque_evenements (publie, statut, deleted_at);
create index if not exists bibliotheque_evenements_categorie_idx
  on public.bibliotheque_evenements (categorie_slug);
create index if not exists bibliotheque_images_event_idx
  on public.bibliotheque_images (evenement_id, order_index);

drop trigger if exists bibliotheque_evenements_set_updated_at on public.bibliotheque_evenements;
create trigger bibliotheque_evenements_set_updated_at
before update on public.bibliotheque_evenements
for each row execute function public.set_updated_at();

drop trigger if exists bibliotheque_images_set_updated_at on public.bibliotheque_images;
create trigger bibliotheque_images_set_updated_at
before update on public.bibliotheque_images
for each row execute function public.set_updated_at();

alter table public.bibliotheque_evenements enable row level security;
alter table public.bibliotheque_images enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.bibliotheque_evenements to anon, authenticated;
grant select on table public.bibliotheque_images to anon, authenticated;
grant all on table public.bibliotheque_evenements to authenticated, service_role;
grant all on table public.bibliotheque_images to authenticated, service_role;

drop policy if exists "Lecture publique archives evenements" on public.bibliotheque_evenements;
create policy "Lecture publique archives evenements"
on public.bibliotheque_evenements for select to anon, authenticated, public
using (
  publie = true
  and deleted_at is null
  and statut in ('publie', 'en_cours', 'terminee', 'archivee', 'archive')
);

drop policy if exists "Lecture publique archives images" on public.bibliotheque_images;
create policy "Lecture publique archives images"
on public.bibliotheque_images for select to anon, authenticated, public
using (
  visibility = 'public'
  and deleted_at is null
  and exists (
    select 1 from public.bibliotheque_evenements e
    where e.id = bibliotheque_images.evenement_id
      and e.publie = true
      and e.deleted_at is null
  )
);

drop policy if exists "Admins gerent archives evenements" on public.bibliotheque_evenements;
create policy "Admins gerent archives evenements"
on public.bibliotheque_evenements for all to authenticated
using (true)
with check (true);

drop policy if exists "Admins gerent archives images" on public.bibliotheque_images;
create policy "Admins gerent archives images"
on public.bibliotheque_images for all to authenticated
using (true)
with check (true);

comment on table public.bibliotheque_evenements is
  'Archives institutionnelles des activités AFD (bibliothèque publique).';
comment on table public.bibliotheque_images is
  'Images liées aux activités de la bibliothèque institutionnelle.';
