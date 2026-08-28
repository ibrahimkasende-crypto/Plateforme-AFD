-- =============================================================================
-- Dons : virement bancaire AFD (coordonnées, preuves, références, historique)
-- Additive uniquement — ne détruit aucune donnée existante.
-- =============================================================================

-- 0) Table dons (création si absente — schémas locaux incomplets)
create table if not exists public.dons (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  donor_email text not null,
  donor_phone text,
  amount numeric not null check (amount > 0),
  currency text default 'USD',
  payment_method text not null default 'bank_transfer',
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.dons enable row level security;
alter table public.dons
  add column if not exists reference text,
  add column if not exists donor_country text,
  add column if not exists message text,
  add column if not exists is_anonymous boolean not null default false,
  add column if not exists support_type text,
  add column if not exists user_id uuid,
  add column if not exists beneficiary_account text,
  add column if not exists bank_name text,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid,
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid,
  add column if not exists rejection_reason text,
  add column if not exists updated_at timestamptz default now();

create unique index if not exists dons_reference_uidx
  on public.dons (reference)
  where reference is not null;

create index if not exists dons_status_idx on public.dons (status);
create index if not exists dons_payment_method_idx on public.dons (payment_method);
create index if not exists dons_created_at_idx on public.dons (created_at desc);

-- 2) Séquence / génération de référence AFD-DON-YYYY-NNNNNN
create sequence if not exists public.dons_reference_seq;

create or replace function public.next_don_reference()
returns text
language plpgsql
as $$
declare
  n bigint;
  y text := to_char(timezone('utc', now()), 'YYYY');
begin
  n := nextval('public.dons_reference_seq');
  return 'AFD-DON-' || y || '-' || lpad(n::text, 6, '0');
end;
$$;

grant execute on function public.next_don_reference() to anon, authenticated, service_role;

-- 3) Historique des statuts
create table if not exists public.dons_status_history (
  id uuid primary key default gen_random_uuid(),
  don_id uuid not null references public.dons(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists dons_status_history_don_idx
  on public.dons_status_history (don_id, created_at desc);

alter table public.dons_status_history enable row level security;

drop policy if exists "Admins lisent historique dons" on public.dons_status_history;
create policy "Admins lisent historique dons"
on public.dons_status_history for select to authenticated
using (
  public.has_permission('dons:read')
  or public.has_permission('dons_consulter')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "Admins écrivent historique dons" on public.dons_status_history;
create policy "Admins écrivent historique dons"
on public.dons_status_history for insert to authenticated
with check (
  public.has_permission('dons:write')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

-- 4) Preuves de virement
create table if not exists public.dons_preuves (
  id uuid primary key default gen_random_uuid(),
  don_id uuid not null references public.dons(id) on delete cascade,
  storage_path text not null,
  original_filename text,
  mime_type text,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists dons_preuves_don_idx on public.dons_preuves (don_id, uploaded_at desc);

alter table public.dons_preuves enable row level security;

drop policy if exists "Admins lisent preuves dons" on public.dons_preuves;
create policy "Admins lisent preuves dons"
on public.dons_preuves for select to authenticated
using (
  public.has_permission('dons:read')
  or public.has_permission('dons_consulter')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "Service insert preuves dons" on public.dons_preuves;
drop policy if exists "Admins insert preuves dons" on public.dons_preuves;
-- Inserts via service_role (bypass) ; policy authenticated limitée aux admins
create policy "Admins insert preuves dons"
on public.dons_preuves for insert to authenticated
with check (
  public.has_permission('dons:write')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

-- 5) Coordonnées bancaires administrables (une ligne active)
create table if not exists public.dons_coordonnees_bancaires (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null default 'Equity Banque Commerciale du Congo SA (Equity BCDC)',
  account_holder text not null default 'ASBL ALLIANCE DES FEMMES POUR LE DEVELOPPEMENT',
  account_usd text not null default '00011050233200275289929',
  account_cdf text not null default '00011050233200275377520',
  swift text not null default 'BCDCCDKI',
  usd_enabled boolean not null default true,
  cdf_enabled boolean not null default true,
  instructions text,
  correspondent_usd_bank text default 'Citibank New York',
  correspondent_usd_address text default '399 Park Avenue, New York, NY 10043, USA',
  correspondent_usd_swift text default 'CITIUS33',
  correspondent_eur_bank text default 'Citibank London',
  correspondent_eur_address text default 'Canada Square, Canary Wharf, London E14 5LB, GB',
  correspondent_eur_swift text default 'CITIGB2L',
  eur_note text default 'Veuillez contacter l''AFD avant tout virement en EUR afin de confirmer le compte bénéficiaire et les instructions applicables.',
  is_active boolean not null default true,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.dons_coordonnees_bancaires enable row level security;

-- Lecture publique des coordonnées (nécessaires pour le virement)
drop policy if exists "Public lit coordonnees bancaires actives" on public.dons_coordonnees_bancaires;
create policy "Public lit coordonnees bancaires actives"
on public.dons_coordonnees_bancaires for select to anon, authenticated
using (is_active = true);

drop policy if exists "Admins autorises gerent coordonnees bancaires" on public.dons_coordonnees_bancaires;
create policy "Admins autorises gerent coordonnees bancaires"
on public.dons_coordonnees_bancaires for all to authenticated
using (
  public.has_permission('dons:bank_settings')
  or public.has_permission('parametres:manage')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
)
with check (
  public.has_permission('dons:bank_settings')
  or public.has_permission('parametres:manage')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
  or public.has_role('admin_principal_it')
);

-- Seed si vide
insert into public.dons_coordonnees_bancaires (
  bank_name,
  account_holder,
  account_usd,
  account_cdf,
  swift,
  usd_enabled,
  cdf_enabled,
  instructions,
  is_active
)
select
  'Equity Banque Commerciale du Congo SA (Equity BCDC)',
  'ASBL ALLIANCE DES FEMMES POUR LE DEVELOPPEMENT',
  '00011050233200275289929',
  '00011050233200275377520',
  'BCDCCDKI',
  true,
  true,
  'Utilisez la référence de don AFD comme communication du virement lorsque votre banque le permet.',
  true
where not exists (
  select 1 from public.dons_coordonnees_bancaires where is_active = true
);

-- 6) Bucket Storage privé pour preuves
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dons-preuves',
  'dons-preuves',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins lisent preuves storage dons" on storage.objects;
create policy "Admins lisent preuves storage dons"
on storage.objects for select to authenticated
using (
  bucket_id = 'dons-preuves'
  and (
    public.has_permission('dons:read')
    or public.has_permission('dons_consulter')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
  )
);

drop policy if exists "Admins upload preuves storage dons" on storage.objects;
create policy "Admins upload preuves storage dons"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'dons-preuves'
  and (
    public.has_permission('dons:write')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
  )
);

-- Uploads publics passent par service_role côté serveur (bypass RLS storage).

-- 7) RLS dons — alignement donor_email + virement + update admin
drop policy if exists "Soumission publique intention de don limitée" on public.dons;
create policy "Soumission publique intention de don limitée"
on public.dons for insert to anon, authenticated
with check (
  status in ('pending', 'intent')
  and amount > 0
  and coalesce(currency, '') in ('USD', 'CDF')
  and payment_method in ('bank_transfer', 'virement', 'card', 'intent')
  and (
    (donor_email is not null and char_length(donor_email) between 5 and 254)
    or (
      -- compatibilité schémas legacy éventuels
      true
    )
  )
);

drop policy if exists "Admins lisent intentions de don" on public.dons;
create policy "Admins lisent intentions de don"
on public.dons for select to authenticated
using (
  public.has_permission('dons:read')
  or public.has_permission('dons_consulter')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

drop policy if exists "Admins mettent a jour dons" on public.dons;
create policy "Admins mettent a jour dons"
on public.dons for update to authenticated
using (
  public.has_permission('dons:write')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
)
with check (
  public.has_permission('dons:write')
  or public.has_role('super_admin')
  or public.has_role('platform_owner')
);

comment on table public.dons_coordonnees_bancaires is
  'Coordonnées bancaires officielles AFD pour dons par virement (administrables).';
comment on table public.dons_preuves is
  'Preuves de virement (Storage privé dons-preuves).';
comment on table public.dons_status_history is
  'Historique des changements de statut des dons.';
