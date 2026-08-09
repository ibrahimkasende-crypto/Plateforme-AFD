-- Extension bibliothèque : vidéos + index recherche
create table if not exists public.bibliotheque_videos (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid references public.bibliotheque_evenements(id) on delete set null,
  title text not null,
  description text,
  provider text not null default 'youtube'
    check (provider in ('youtube', 'vimeo', 'hosted', 'external')),
  embed_url text,
  external_url text,
  thumbnail_url text,
  duration_seconds integer,
  domaine_slug text,
  projet text,
  publie boolean not null default false,
  is_public boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    embed_url is not null
    or external_url is not null
  )
);

create index if not exists bibliotheque_videos_public_idx
  on public.bibliotheque_videos (publie, is_public, deleted_at);

drop trigger if exists bibliotheque_videos_set_updated_at on public.bibliotheque_videos;
create trigger bibliotheque_videos_set_updated_at
before update on public.bibliotheque_videos
for each row execute function public.set_updated_at();

alter table public.bibliotheque_videos enable row level security;

grant select on table public.bibliotheque_videos to anon, authenticated;
grant all on table public.bibliotheque_videos to authenticated, service_role;

drop policy if exists "Lecture publique bibliotheque videos" on public.bibliotheque_videos;
create policy "Lecture publique bibliotheque videos"
on public.bibliotheque_videos for select to anon, authenticated, public
using (
  publie = true
  and is_public = true
  and deleted_at is null
);

drop policy if exists "Admins gerent bibliotheque videos" on public.bibliotheque_videos;
create policy "Admins gerent bibliotheque videos"
on public.bibliotheque_videos for all to authenticated
using (true)
with check (true);

comment on table public.bibliotheque_videos is
  'Vidéos institutionnelles (YouTube/Vimeo/hébergées) pour la vidéothèque.';
