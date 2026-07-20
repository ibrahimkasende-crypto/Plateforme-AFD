-- Policies Storage avatars admin — sans dépendre de has_permission
-- Chemin : {user_id}/processed/avatar.*  (ou legacy avatars/{user_id}/...)

drop policy if exists "admin avatars read own" on storage.objects;
create policy "admin avatars read own" on storage.objects
for select to authenticated
using (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

drop policy if exists "admin avatars write own" on storage.objects;
create policy "admin avatars write own" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

drop policy if exists "admin avatars update own" on storage.objects;
create policy "admin avatars update own" on storage.objects
for update to authenticated
using (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = auth.uid()::text
    )
  )
)
with check (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

drop policy if exists "admin avatars delete own" on storage.objects;
create policy "admin avatars delete own" on storage.objects
for delete to authenticated
using (
  bucket_id = 'admin-avatars'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = auth.uid()::text
    )
  )
);

-- Assurer le bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'admin-avatars',
  'admin-avatars',
  false,
  5242880,
  array['image/jpeg','image/png','image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
