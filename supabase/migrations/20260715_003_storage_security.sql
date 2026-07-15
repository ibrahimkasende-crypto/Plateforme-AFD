-- Phase 4 — buckets et politiques Storage.
-- Ne rendre public que le bucket gallery, car l'interface actuelle utilise
-- getPublicUrl(). Les rapports restent privés et seront servis par URL signée.

insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('rapports-prives', 'rapports-prives', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Lecture publique galerie active" on storage.objects;
create policy "Lecture publique galerie"
on storage.objects for select to anon, authenticated
using (bucket_id = 'gallery');

create policy "Admins importent galerie"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'gallery'
  and public.has_permission('medias_gerer')
  and name !~ '(^|/)\.{1,2}(/|$)'
);

create policy "Admins modifient galerie"
on storage.objects for update to authenticated
using (bucket_id = 'gallery' and public.has_permission('medias_gerer'))
with check (bucket_id = 'gallery' and public.has_permission('medias_gerer'));

create policy "Admins suppriment galerie"
on storage.objects for delete to authenticated
using (bucket_id = 'gallery' and public.has_permission('medias_gerer'));

create policy "Utilisateurs autorisés lisent rapports privés"
on storage.objects for select to authenticated
using (
  bucket_id = 'rapports-prives'
  and public.has_permission('rapports_telecharger')
);

create policy "Utilisateurs autorisés importent rapports privés"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'rapports-prives'
  and public.has_permission('rapports_generer')
  and name !~ '(^|/)\.{1,2}(/|$)'
);

create policy "Utilisateurs autorisés suppriment rapports privés"
on storage.objects for delete to authenticated
using (
  bucket_id = 'rapports-prives'
  and public.has_role('super_admin')
);
