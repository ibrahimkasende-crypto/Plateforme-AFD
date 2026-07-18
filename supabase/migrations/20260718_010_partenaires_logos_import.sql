-- Import officiel des partenaires affichés sur afd-rdc.org
-- (section « Ils nous font confiance » / « Nos partenaires »).
-- Ne crée pas de partenaires inventés. Désactive les seeds historiques absents du site.

-- ---------------------------------------------------------------------------
-- Enrichissement table partenaires (non destructif)
-- ---------------------------------------------------------------------------
alter table public.partenaires
  add column if not exists acronyme text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists website_url text,
  add column if not exists logo_media_id uuid references public.medias (id) on delete set null,
  add column if not exists publie boolean not null default true,
  add column if not exists mise_en_avant boolean not null default false,
  add column if not exists source_url text,
  add column if not exists source_imported_at timestamptz,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz;

create unique index if not exists partenaires_slug_unique_idx
  on public.partenaires (slug)
  where slug is not null and deleted_at is null;

create index if not exists partenaires_public_idx
  on public.partenaires (active, publie, "order")
  where deleted_at is null;

-- source_url optionnel sur medias
alter table public.medias
  add column if not exists source_url text;

-- ---------------------------------------------------------------------------
-- RLS public : actifs + publiés + non supprimés
-- ---------------------------------------------------------------------------
drop policy if exists "Public partenaires actifs" on public.partenaires;
create policy "Public partenaires actifs"
on public.partenaires for select to anon, authenticated
using (
  active = true
  and coalesce(publie, true) = true
  and deleted_at is null
);

-- ---------------------------------------------------------------------------
-- Storage write pour admins (bucket partenaires)
-- ---------------------------------------------------------------------------
drop policy if exists "Admins gèrent partenaires storage" on storage.objects;
create policy "Admins gèrent partenaires storage"
on storage.objects for all to authenticated
using (
  bucket_id = 'partenaires'
  and (
    public.has_permission('partenaires_gerer')
    or public.has_permission('medias_gerer')
    or public.has_role('super_admin')
  )
)
with check (
  bucket_id = 'partenaires'
  and (
    public.has_permission('partenaires_gerer')
    or public.has_permission('medias_gerer')
    or public.has_role('super_admin')
  )
);

-- ---------------------------------------------------------------------------
-- Désactiver les seeds historiques absents de afd-rdc.org
-- ---------------------------------------------------------------------------
update public.partenaires
set
  active = false,
  publie = false,
  updated_at = now()
where name in (
  'UNICEF',
  'ONU Femmes',
  'OMS',
  'Union Européenne',
  'USAID',
  'OCHA',
  'CARE'
)
and deleted_at is null;

-- ---------------------------------------------------------------------------
-- Upsert des 13 partenaires officiels (logos locaux en attendant upload Storage)
-- ---------------------------------------------------------------------------
insert into public.partenaires (
  id, name, acronyme, slug, logo_url, category, "order",
  active, publie, description, website_url, source_url, source_imported_at, updated_at
) values
(
  '4a552a59-f9cc-4460-8778-f98ec923762e',
  'MINISTERE DE LA SANTE PUBLIQUE, HYGIENE ET PREVOYANCE SOCIALE',
  null,
  'ministere-de-la-sante-publique-hygiene-et-prevoyance-sociale',
  '/images/afd/partenaires/ministere-de-la-sante-publique-hygiene-et-prevoyance-sociale.png',
  'gouvernement', 1, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '1c2acb41-c94d-460e-8d3d-6152c383cd58',
  'CHWID', 'CHWID', 'chwid',
  '/images/afd/partenaires/chwid.png',
  'international', 2, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  'e7b13e31-0713-45ea-8d3b-f57004814c09',
  'CARITAS', 'CARITAS', 'caritas',
  '/images/afd/partenaires/caritas.png',
  'international', 3, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  'e8e880a3-9231-428c-8fe2-808b4fee5691',
  'ROJAF', 'ROJAF', 'rojaf',
  '/images/afd/partenaires/rojaf.png',
  'ong', 4, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '287ee040-9586-49d8-bbf8-9ca2dbc16eb6',
  'CASAMED', 'CASAMED', 'casamed',
  '/images/afd/partenaires/casamed.png',
  'ong', 5, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '1fa6f63c-7472-4406-9a18-51f44e73c99a',
  'IMPACT SANTE AFRIQUE', null, 'impact-sante-afrique',
  '/images/afd/partenaires/impact-sante-afrique.png',
  'international', 6, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  'e513d056-8cca-4a37-8e3c-140ae32c81fa',
  'CS4ME', 'CS4ME', 'cs4me',
  '/images/afd/partenaires/cs4me.png',
  'ong', 7, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '6fa930fb-f968-4933-a872-be3ee585559c',
  'UAF', 'UAF', 'uaf',
  '/images/afd/partenaires/uaf.png',
  'international', 8, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '83201d07-3ad8-4698-abc3-36253a5c3c01',
  'RACOJ', 'RACOJ', 'racoj',
  '/images/afd/partenaires/racoj.png',
  'ong', 9, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '5735e51b-f31c-46b2-b479-0296166d961b',
  'PSDS', 'PSDS', 'psds',
  '/images/afd/partenaires/psds.png',
  'ong', 10, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '375bf99d-5cd9-49f0-b1fd-036d47061c99',
  'ALLEVIATE', 'ALLEVIATE', 'alleviate',
  '/images/afd/partenaires/alleviate.png',
  'international', 11, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '6e2ee100-6149-4656-9d68-19db8d9b9cf0',
  'PNSR', 'PNSR', 'pnsr',
  '/images/afd/partenaires/pnsr.png',
  'ong', 12, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
),
(
  '11ef7127-9483-4055-a261-e2dab8c40b40',
  'SI JEUNESSE SAVAIT', null, 'si-jeunesse-savait',
  '/images/afd/partenaires/si-jeunesse-savait.png',
  'ong', 13, true, true, null, null,
  'https://afd-rdc.org/', now(), now()
)
on conflict (id) do update set
  name = excluded.name,
  acronyme = excluded.acronyme,
  slug = excluded.slug,
  logo_url = coalesce(public.partenaires.logo_url, excluded.logo_url),
  category = excluded.category,
  "order" = excluded."order",
  active = true,
  publie = true,
  deleted_at = null,
  source_url = excluded.source_url,
  source_imported_at = coalesce(public.partenaires.source_imported_at, excluded.source_imported_at),
  updated_at = now();
