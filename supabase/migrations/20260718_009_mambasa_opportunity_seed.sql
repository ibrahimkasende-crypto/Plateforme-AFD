-- Seed offre Mambasa (contenu vérifié depuis afd-rdc.org / offres_emploi)
-- Upsert par slug pour éviter les doublons.

insert into public.opportunites (
  id,
  titre,
  slug,
  reference,
  type,
  departement,
  localisation,
  mode_travail,
  type_contrat,
  duree,
  description,
  responsabilites,
  profil_recherche,
  competences,
  niveau_etudes,
  experience,
  conditions,
  pieces_requises,
  methode_candidature,
  url_externe,
  email_candidature,
  date_publication,
  date_limite,
  statut,
  publie,
  candidatures_spontanees_autorisees
)
values (
  '2bac6964-f1be-4069-8b56-783dd57fb093',
  'Chef de projet basé à MAMBASA et Officier Santé nutrition basé aussi à MAMBASA',
  'chef-de-projet-base-a-mambasa',
  null,
  'emploi',
  null,
  'MAMBASA',
  null,
  null,
  null,
  'Recrutement des postes : Chef de projet basé à MAMBASA et Officier Santé nutrition basé aussi à MAMBASA. Consultez le document officiel de l’offre pour le détail des missions et du profil.',
  null,
  null,
  '{}',
  null,
  null,
  null,
  '{}',
  'formulaire',
  null,
  'ressourceshumainesafd871@gmail.com',
  '2026-07-16T22:56:18.063+00:00',
  null,
  'ouverte',
  true,
  false
)
on conflict (slug) do update set
  titre = excluded.titre,
  localisation = excluded.localisation,
  description = excluded.description,
  email_candidature = excluded.email_candidature,
  date_publication = excluded.date_publication,
  methode_candidature = excluded.methode_candidature,
  publie = excluded.publie,
  statut = excluded.statut,
  updated_at = now();

-- Attache un fichier de candidature (métadonnées + chemins) sans élargir l’UPDATE public.
create or replace function public.attach_candidature_document(
  p_candidature_id uuid,
  p_kind text,
  p_nom_fichier text,
  p_chemin_storage text,
  p_type_mime text,
  p_taille_octets bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('cv', 'lettre', 'autre') then
    raise exception 'kind invalide';
  end if;

  if not exists (
    select 1
    from public.candidatures c
    where c.id = p_candidature_id
      and c.deleted_at is null
      and c.created_at > now() - interval '2 hours'
  ) then
    raise exception 'candidature introuvable ou expirée';
  end if;

  insert into public.documents_candidature (
    candidature_id, nom_fichier, chemin_storage, type_mime, taille_octets
  ) values (
    p_candidature_id, p_nom_fichier, p_chemin_storage, p_type_mime, p_taille_octets
  );

  if p_kind = 'cv' then
    update public.candidatures
    set cv_storage_path = p_chemin_storage, updated_at = now()
    where id = p_candidature_id;
  elsif p_kind = 'lettre' then
    update public.candidatures
    set lettre_storage_path = p_chemin_storage, updated_at = now()
    where id = p_candidature_id;
  end if;
end;
$$;

revoke all on function public.attach_candidature_document(uuid, text, text, text, text, bigint) from public;
grant execute on function public.attach_candidature_document(uuid, text, text, text, text, bigint) to anon, authenticated;
