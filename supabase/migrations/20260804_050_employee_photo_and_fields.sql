-- Colonnes employé étendues + politiques photo HR
alter table public.hr_employes
  add column if not exists deuxieme_prenom text,
  add column if not exists email_personnel text,
  add column if not exists telephone_secondaire text,
  add column if not exists commune text,
  add column if not exists ville text,
  add column if not exists pays text default 'RD Congo',
  add column if not exists service text,
  add column if not exists fonction text,
  add column if not exists bureau text,
  add column if not exists province_affectation text,
  add column if not exists territoire_affectation text,
  add column if not exists date_fin date,
  add column if not exists biographie text,
  add column if not exists competences text[] not null default '{}',
  add column if not exists langues text[] not null default '{}';

-- Autoriser les gestionnaires RH à écrire les photos employés
drop policy if exists "hr private write manage employees" on storage.objects;
create policy "hr private write manage employees"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'hr-private'
  and (
    public.has_permission('hr.manage_employees')
    or public.has_permission('hr_documents.upload')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_role('admin_principal')
    or public.has_role('administrateur')
  )
);

drop policy if exists "hr private update manage employees" on storage.objects;
create policy "hr private update manage employees"
on storage.objects for update to authenticated
using (
  bucket_id = 'hr-private'
  and (
    public.has_permission('hr.manage_employees')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_role('admin_principal')
  )
)
with check (
  bucket_id = 'hr-private'
  and (
    public.has_permission('hr.manage_employees')
    or public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_role('admin_principal')
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
