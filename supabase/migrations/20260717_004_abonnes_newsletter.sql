-- Abonnés newsletter publics (inscription volontaire avec consentement)
create table if not exists public.abonnes_newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nom text,
  centres_interet text[] not null default '{}',
  statut text not null default 'actif'
    check (statut in ('actif', 'desinscrit', 'en_attente')),
  source text not null default 'site_public',
  consentement boolean not null default false,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint abonnes_newsletter_email_key unique (email)
);

create index if not exists abonnes_newsletter_statut_idx
  on public.abonnes_newsletter (statut);

alter table public.abonnes_newsletter enable row level security;

-- Lecture réservée aux rôles authentifiés (admin via policies futures)
drop policy if exists "abonnes_newsletter_select_authenticated" on public.abonnes_newsletter;
create policy "abonnes_newsletter_select_authenticated"
  on public.abonnes_newsletter
  for select
  to authenticated
  using (true);

-- Insertion publique uniquement avec consentement et statut actif
drop policy if exists "abonnes_newsletter_insert_public" on public.abonnes_newsletter;
create policy "abonnes_newsletter_insert_public"
  on public.abonnes_newsletter
  for insert
  to anon, authenticated
  with check (
    consentement = true
    and statut = 'actif'
    and email = lower(email)
  );

comment on table public.abonnes_newsletter is
  'Inscriptions newsletter AFD — emails normalisés en minuscules, unique.';
