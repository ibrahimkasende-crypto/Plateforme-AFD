-- Demandes d'adhésion publiques (table membres + RLS insert anonyme).
create table if not exists public.membres (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  gender text not null,
  motivation text not null,
  member_type text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.membres enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.membres to anon, authenticated;
grant select, update on table public.membres to authenticated;
grant all on table public.membres to service_role;

drop policy if exists "Insert membres" on public.membres;
create policy "Insert membres"
on public.membres
for insert
to anon, authenticated, public
with check (true);

drop policy if exists "Admin lit les adhesions" on public.membres;
create policy "Admin lit les adhesions"
on public.membres
for select
to authenticated
using (
  public.has_permission('adhesions:read')
  or public.has_permission('adhesions_gerer')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "Admin met a jour les adhesions" on public.membres;
create policy "Admin met a jour les adhesions"
on public.membres
for update
to authenticated
using (
  public.has_permission('adhesions:write')
  or public.has_permission('adhesions_gerer')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
)
with check (
  public.has_permission('adhesions:write')
  or public.has_permission('adhesions_gerer')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

create index if not exists membres_status_created_idx
  on public.membres (status, created_at desc);

create index if not exists membres_email_idx
  on public.membres (lower(email));

comment on table public.membres is
  'Demandes d''adhésion soumises via le site public.';
