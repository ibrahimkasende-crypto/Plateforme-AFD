-- Bucket public pour la banque d'images AFD (site + bibliothèque)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'afd-media',
  'afd-media',
  true,
  15728640,
  array['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique
drop policy if exists "afd media public read" on storage.objects;
create policy "afd media public read"
on storage.objects for select
to public
using (bucket_id = 'afd-media');

-- Écriture réservée service / admins
drop policy if exists "afd media admin write" on storage.objects;
create policy "afd media admin write"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'afd-media'
  and (
    public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_role('admin_principal')
    or public.has_permission('archives:write')
    or public.has_permission('mediatheque:write')
  )
);

drop policy if exists "afd media admin update" on storage.objects;
create policy "afd media admin update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'afd-media'
  and (
    public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_role('admin_principal')
    or public.has_permission('archives:write')
  )
)
with check (bucket_id = 'afd-media');

drop policy if exists "afd media admin delete" on storage.objects;
create policy "afd media admin delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'afd-media'
  and (
    public.has_role('super_admin')
    or public.has_role('platform_owner')
    or public.has_permission('archives:write')
  )
);
