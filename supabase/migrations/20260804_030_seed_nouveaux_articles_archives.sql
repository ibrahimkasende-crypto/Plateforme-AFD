-- Nouveaux lots d'actualites et d'archives terrain classes depuis le dossier Nauveau.
-- Migration idempotente: peut etre relancee sans dupliquer les fiches.
-- Bootstrap: cree public.actualites si absente (projet mxxux partiel).

create extension if not exists pgcrypto;

create table if not exists public.actualites (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  image_url text,
  author text default 'AFD ASBL',
  category text default 'general',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  source text,
  migration_note text,
  legacy_id text,
  featured boolean default false,
  status text default 'publie'
);

alter table public.actualites enable row level security;

grant select on table public.actualites to anon, authenticated;
grant all on table public.actualites to authenticated, service_role;

drop policy if exists "Public actualites publiees" on public.actualites;
create policy "Public actualites publiees"
on public.actualites for select to anon, authenticated, public
using (published = true and coalesce(status, 'publie') <> 'brouillon');

drop policy if exists "Admins gerent actualites" on public.actualites;
create policy "Admins gerent actualites"
on public.actualites for all to authenticated
using (true)
with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists actualites_set_updated_at on public.actualites;
create trigger actualites_set_updated_at
before update on public.actualites
for each row execute function public.set_updated_at();

alter table public.actualites
  add column if not exists status text default 'publie',
  add column if not exists featured boolean default false,
  add column if not exists source text,
  add column if not exists migration_note text;

alter table public.bibliotheque_evenements
  add column if not exists actualite_id uuid references public.actualites(id) on delete set null,
  add column if not exists categorie_slug text,
  add column if not exists categorie_label text,
  add column if not exists projet text,
  add column if not exists partenaires text[] not null default '{}',
  add column if not exists download_count integer not null default 0;

insert into public.actualites (
  slug, title, excerpt, content, image_url, category, published, published_at,
  author, status, featured, source, migration_note
) values
  (
    'sensibilisation-sante-intime-femmes-gogynax',
    'Sante intime des femmes : une sensibilisation axee sur la prevention et la dignite',
    'L''AFD documente une seance d''information consacree a la sante intime des femmes, avec des echanges communautaires autour de la prevention, de la dignite et de l''acces a des produits adaptes.',
    'Cette activite met en avant la sante intime des femmes comme un enjeu de prevention, de dignite et d''acces a l''information. Les images montrent une rencontre avec les participantes, des echanges en salle et la presentation de supports Gogynax lies a la prevention des infections. La date et le lieu exacts doivent etre confirmes dans le dashboard.',
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_004.jpeg',
    'Sante',
    true,
    '2026-08-04 08:00:00+00',
    'AFD ASBL',
    'publie',
    true,
    'rapport-terrain-afd',
    'Lot photo renomme depuis Nauveau/18-25; date et lieu exacts a confirmer.'
  ),
  (
    'mobilisation-osc-revision-loi-sante-publique',
    'L''AFD participe a la mobilisation des OSC sur la loi relative a la sante publique',
    'L''AFD ASBL a pris part a une mobilisation des organisations de la societe civile sur la revision de l''article 81, alinea 2, afin de soutenir des dispositions plus realistes et accessibles.',
    'Lors d''une matinee organisee par la CGND avec Si Jeunesse Savait, les OSC ont echange sur la modification de la loi relative a la sante publique. L''enjeu principal portait sur l''acces aux methodes de contraception non reversibles dans les zones ou les medecins specialises sont peu disponibles.',
    '/assets/Banque des images AFD - Classees/21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg',
    'Plaidoyer',
    true,
    '2026-08-03 08:00:00+00',
    'AFD ASBL',
    'publie',
    false,
    'rapport-terrain-afd',
    'Lot photo renomme depuis Nauveau/17.'
  ),
  (
    'suivi-evaluation-mve-dps-tshopo',
    'Suivi et evaluation de la MVE : l''AFD participe a la coordination sanitaire a la DPS Tshopo',
    'Le 1er aout 2026, l''AFD a pris part a une reunion de suivi et d''evaluation de la maladie a virus Ebola a la Division provinciale de la sante de la Tshopo.',
    'La reunion de suivi et d''evaluation de la MVE a permis de revenir sur la situation epidemiologique, les problemes identifies, les recommandations, les echantillons en laboratoire et les fiches d''investigation. L''AFD poursuit son engagement dans la prevention communautaire et la circulation d''informations fiables.',
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_001.jpeg',
    'Sante',
    true,
    '2026-08-01 08:00:00+00',
    'AFD ASBL',
    'publie',
    true,
    'rapport-terrain-afd',
    'Lot photo renomme depuis Nauveau/5-8.'
  ),
  (
    'formation-enqueteurs-cap-rentree-scolaire-kinshasa',
    'Formation des enqueteurs CAP pour faciliter le retour a l''ecole',
    'Le 27 juillet 2026 a Kinshasa, le consortium AFD, CSDI et AJDP a forme onze enqueteurs sur le formulaire de l''enquete CAP liee aux besoins d''appui a la rentree scolaire.',
    'La formation a permis de renforcer les capacites des enqueteurs avant la collecte prevue dans les sites de Maluku, Pakadjuma/Nsele et Lutendele/Mont-Ngafula. L''objectif est d''identifier les besoins reels des enfants deplaces afin de soutenir leur retour a l''ecole des la rentree 2026-2027.',
    '/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_001.jpeg',
    'Education',
    true,
    '2026-07-27 08:00:00+00',
    'Daniella AWA',
    'publie',
    true,
    'rapport-terrain-afd',
    'Lot photo renomme depuis Nauveau/9-16.'
  ),
  (
    'preparation-enquete-cap-rentree-scolaire-enfants-deplaces',
    'Des grandes reflexions se preparent pour l''education des enfants deplaces',
    'Le 20 juillet 2026, l''AFD a accueilli AJDP et CSDI pour preparer l''outil de collecte de l''enquete CAP sur les besoins d''appui a la rentree scolaire des enfants deplaces.',
    'L''AFD, AJDP et CSDI ont harmonise les indicateurs cles et finalise un questionnaire adapte aux realites du terrain. L''enquete permettra de documenter les besoins prioritaires des familles deplacees en fournitures scolaires, frais d''acces et appui psychosocial.',
    '/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_002.jpeg',
    'Education',
    true,
    '2026-07-20 08:00:00+00',
    'Daniella AWA',
    'publie',
    false,
    'rapport-terrain-afd',
    'Lot photo renomme depuis Nauveau/1-4.'
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  published = excluded.published,
  published_at = excluded.published_at,
  author = excluded.author,
  status = excluded.status,
  featured = excluded.featured,
  source = excluded.source,
  migration_note = excluded.migration_note,
  updated_at = now();

insert into public.bibliotheque_evenements (
  slug, titre, resume, description, domaine_slug, actualite_id, categorie_slug,
  categorie_label, date_evenement, heure_debut, lieu_nom, adresse, province,
  territoire, localite, projet, partenaires, tags, cover_image_url, statut,
  publie, featured, source, published_at
) values
  (
    'preparation-enquete-cap-rentree-scolaire-enfants-deplaces',
    'Preparation de l''enquete CAP sur les besoins d''appui a la rentree scolaire',
    'Seance de travail AFD, AJDP et CSDI autour de l''outil de collecte destine aux sites de Lutendele, Pakadjuma et Nsele.',
    'Le 20 juillet 2026, l''AFD a accueilli AJDP et CSDI dans ses locaux afin d''harmoniser les indicateurs cles et de finaliser le questionnaire de l''enquete CAP.',
    'femmes-reponse-humanitaire-urgence',
    (select id from public.actualites where slug = 'preparation-enquete-cap-rentree-scolaire-enfants-deplaces'),
    'education',
    'Education',
    '2026-07-20',
    null,
    'Locaux de l''AFD Kinshasa',
    'Kinshasa',
    'Kinshasa',
    null,
    'Kinshasa',
    'Enquete CAP rentree scolaire 2026-2027',
    array['AJDP','CSDI'],
    array['Education','Enquete CAP','Rentree scolaire','Deplaces'],
    '/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_002.jpeg',
    'publie',
    true,
    true,
    'nouveau-afd-2026',
    '2026-07-20 08:00:00+00'
  ),
  (
    'formation-enqueteurs-cap-rentree-scolaire-kinshasa',
    'Formation des enqueteurs CAP pour l''appui a la rentree scolaire 2026-2027',
    'Onze enqueteurs, dont cinq femmes, ont ete formes a l''utilisation du formulaire CAP pour documenter les besoins des enfants deplaces.',
    'Le 27 juillet 2026, a la CONEPT RDC a Kinshasa, le consortium AFD, CSDI et AJDP a organise une session de formation sur le formulaire de l''enquete CAP.',
    'femmes-reponse-humanitaire-urgence',
    (select id from public.actualites where slug = 'formation-enqueteurs-cap-rentree-scolaire-kinshasa'),
    'education',
    'Education',
    '2026-07-27',
    null,
    'Salle de reunion de la CONEPT RDC',
    'Kinshasa',
    'Kinshasa',
    null,
    'Kinshasa',
    'Projet de renforcement de l''acces a l''education des enfants deplaces en RDC',
    array['AJDP','CSDI'],
    array['Formation','Enqueteurs','Education','Enfants deplaces'],
    '/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_001.jpeg',
    'publie',
    true,
    true,
    'nouveau-afd-2026',
    '2026-07-27 08:00:00+00'
  ),
  (
    'suivi-evaluation-mve-dps-tshopo',
    'Suivi et evaluation de la MVE a la Division provinciale de la sante de la Tshopo',
    'Participation de l''AFD a une reunion de coordination sanitaire sur la situation epidemiologique et les recommandations de prevention.',
    'Le 1er aout 2026, l''AFD a participe a une reunion de suivi et d''evaluation de la maladie a virus Ebola dans la salle de reunion de la Division provinciale de la sante de la Tshopo.',
    'sante-maternelle-infantile',
    (select id from public.actualites where slug = 'suivi-evaluation-mve-dps-tshopo'),
    'sante',
    'Sante',
    '2026-08-01',
    null,
    'Division provinciale de la sante de la Tshopo',
    'Kisangani',
    'Tshopo',
    null,
    'Kisangani',
    'Prevention et suivi communautaire MVE',
    array['Division provinciale de la sante de la Tshopo','Medecins Sans Frontieres'],
    array['MVE','Ebola','Sante publique','Prevention'],
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_001.jpeg',
    'publie',
    true,
    true,
    'nouveau-afd-2026',
    '2026-08-01 08:00:00+00'
  ),
  (
    'mobilisation-osc-revision-loi-sante-publique',
    'Mobilisation des OSC sur la revision de la loi relative a la sante publique',
    'L''AFD a pris part aux echanges sur l''article 81, alinea 2, afin de soutenir une disposition plus realiste et accessible.',
    'L''AFD ASBL a participe a une matinee de mobilisation des organisations de la societe civile organisee par la CGND avec Si Jeunesse Savait.',
    'protection-vbg-droits-femmes',
    (select id from public.actualites where slug = 'mobilisation-osc-revision-loi-sante-publique'),
    'plaidoyer',
    'Plaidoyer',
    '2026-08-03',
    null,
    'Kinshasa',
    null,
    'Kinshasa',
    null,
    'Kinshasa',
    'Plaidoyer sante publique et droits des femmes',
    array['CGND','Si Jeunesse Savait'],
    array['Plaidoyer','Sante publique','Droits des femmes','OSC'],
    '/assets/Banque des images AFD - Classees/21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg',
    'publie',
    true,
    false,
    'nouveau-afd-2026',
    '2026-08-03 08:00:00+00'
  ),
  (
    'sensibilisation-sante-intime-femmes-gogynax',
    'Sensibilisation sur la sante intime et la dignite des femmes',
    'Seance d''information aupres des femmes autour de la sante intime, de la prevention et de l''acces a des produits adaptes.',
    'Cette archive regroupe les images d''une sensibilisation consacree a la sante intime des femmes. La date et le lieu exacts doivent etre confirmes dans le dashboard avant publication officielle definitive.',
    'sante-maternelle-infantile',
    (select id from public.actualites where slug = 'sensibilisation-sante-intime-femmes-gogynax'),
    'sante',
    'Sante',
    null,
    null,
    'Lieu a confirmer',
    null,
    null,
    null,
    null,
    'Sante intime et dignite des femmes',
    array['Gogynax'],
    array['Sante intime','Femmes','Prevention','Dignite'],
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_004.jpeg',
    'publie',
    true,
    true,
    'nouveau-afd-2026',
    '2026-08-04 08:00:00+00'
  )
on conflict (slug) do update set
  titre = excluded.titre,
  resume = excluded.resume,
  description = excluded.description,
  domaine_slug = excluded.domaine_slug,
  actualite_id = excluded.actualite_id,
  categorie_slug = excluded.categorie_slug,
  categorie_label = excluded.categorie_label,
  date_evenement = excluded.date_evenement,
  heure_debut = excluded.heure_debut,
  lieu_nom = excluded.lieu_nom,
  adresse = excluded.adresse,
  province = excluded.province,
  territoire = excluded.territoire,
  localite = excluded.localite,
  projet = excluded.projet,
  partenaires = excluded.partenaires,
  tags = excluded.tags,
  cover_image_url = excluded.cover_image_url,
  statut = excluded.statut,
  publie = excluded.publie,
  featured = excluded.featured,
  source = excluded.source,
  published_at = excluded.published_at,
  updated_at = now();

delete from public.bibliotheque_images
where source = 'nouveau-afd-2026'
  and evenement_id in (
    select id from public.bibliotheque_evenements
    where slug in (
      'preparation-enquete-cap-rentree-scolaire-enfants-deplaces',
      'formation-enqueteurs-cap-rentree-scolaire-kinshasa',
      'suivi-evaluation-mve-dps-tshopo',
      'mobilisation-osc-revision-loi-sante-publique',
      'sensibilisation-sante-intime-femmes-gogynax'
    )
  );

with image_seed(event_slug, domaine_slug, title, caption, alt_text, local_asset_path, is_cover, order_index, taken_at) as (
  values
    ('preparation-enquete-cap-rentree-scolaire-enfants-deplaces','femmes-reponse-humanitaire-urgence','Preparation enquete CAP','AFD, AJDP et CSDI harmonisent l''outil de collecte.','Seance de travail sur l''enquete CAP pour la rentree scolaire des enfants deplaces.','/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_001.jpeg',false,1,'2026-07-20 09:00:00+00'::timestamptz),
    ('preparation-enquete-cap-rentree-scolaire-enfants-deplaces','femmes-reponse-humanitaire-urgence','Preparation enquete CAP','AFD, AJDP et CSDI harmonisent l''outil de collecte.','Seance de travail sur l''enquete CAP pour la rentree scolaire des enfants deplaces.','/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_002.jpeg',true,2,'2026-07-20 09:00:00+00'::timestamptz),
    ('preparation-enquete-cap-rentree-scolaire-enfants-deplaces','femmes-reponse-humanitaire-urgence','Preparation enquete CAP','AFD, AJDP et CSDI harmonisent l''outil de collecte.','Seance de travail sur l''enquete CAP pour la rentree scolaire des enfants deplaces.','/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_003.jpeg',false,3,'2026-07-20 09:00:00+00'::timestamptz),
    ('preparation-enquete-cap-rentree-scolaire-enfants-deplaces','femmes-reponse-humanitaire-urgence','Preparation enquete CAP','AFD, AJDP et CSDI harmonisent l''outil de collecte.','Seance de travail sur l''enquete CAP pour la rentree scolaire des enfants deplaces.','/assets/Banque des images AFD - Classees/02_education/afd_education_preparation_enquete_cap_enfants_deplaces_kinshasa_2026_004.jpeg',false,4,'2026-07-20 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_001.jpeg',true,1,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_002.jpeg',false,2,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_003.jpeg',false,3,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_004.jpeg',false,4,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_005.jpeg',false,5,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_006.jpeg',false,6,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_007.jpeg',false,7,'2026-07-27 09:00:00+00'::timestamptz),
    ('formation-enqueteurs-cap-rentree-scolaire-kinshasa','femmes-reponse-humanitaire-urgence','Formation enqueteurs CAP','Session de formation sur le formulaire d''enquete CAP.','Formation des enqueteurs sur le formulaire CAP a Kinshasa.','/assets/Banque des images AFD - Classees/02_education/afd_education_formation_enqueteurs_cap_enfants_deplaces_kinshasa_2026_008.jpeg',false,8,'2026-07-27 09:00:00+00'::timestamptz),
    ('suivi-evaluation-mve-dps-tshopo','sante-maternelle-infantile','Suivi MVE a la DPS Tshopo','Reunion de coordination sanitaire autour de la prevention et de la surveillance de la MVE.','Reunion de suivi et d''evaluation de la MVE a la DPS Tshopo.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_001.jpeg',true,1,'2026-08-01 09:00:00+00'::timestamptz),
    ('suivi-evaluation-mve-dps-tshopo','sante-maternelle-infantile','Suivi MVE a la DPS Tshopo','Reunion de coordination sanitaire autour de la prevention et de la surveillance de la MVE.','Reunion de suivi et d''evaluation de la MVE a la DPS Tshopo.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_002.jpeg',false,2,'2026-08-01 09:00:00+00'::timestamptz),
    ('suivi-evaluation-mve-dps-tshopo','sante-maternelle-infantile','Suivi MVE a la DPS Tshopo','Reunion de coordination sanitaire autour de la prevention et de la surveillance de la MVE.','Reunion de suivi et d''evaluation de la MVE a la DPS Tshopo.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_003.jpeg',false,3,'2026-08-01 09:00:00+00'::timestamptz),
    ('suivi-evaluation-mve-dps-tshopo','sante-maternelle-infantile','Suivi MVE a la DPS Tshopo','Reunion de coordination sanitaire autour de la prevention et de la surveillance de la MVE.','Reunion de suivi et d''evaluation de la MVE a la DPS Tshopo.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_reunion_suivi_evaluation_mve_dps_tshopo_2026_004.jpeg',false,4,'2026-08-01 09:00:00+00'::timestamptz),
    ('mobilisation-osc-revision-loi-sante-publique','protection-vbg-droits-femmes','Mobilisation OSC sante publique','Participation de l''AFD a une mobilisation autour de la loi relative a la sante publique.','Representants presents lors d''une mobilisation d''OSC a Kinshasa.','/assets/Banque des images AFD - Classees/21_plaidoyer/afd_plaidoyer_mobilisation_osc_loi_sante_publique_kinshasa_2026_001.jpeg',true,1,'2026-08-03 09:00:00+00'::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_001.jpeg',false,1,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_002.jpeg',false,2,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_003.jpeg',false,3,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_004.jpeg',true,4,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_005.jpeg',false,5,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_006.jpeg',false,6,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_007.jpeg',false,7,null::timestamptz),
    ('sensibilisation-sante-intime-femmes-gogynax','sante-maternelle-infantile','Sante intime des femmes','Echanges et presentation de supports autour de la prevention et de la sante intime.','Sensibilisation sur la sante intime des femmes avec participantes et supports Gogynax.','/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_sante_intime_femmes_gogynax_2026_008.jpeg',false,8,null::timestamptz)
)
insert into public.bibliotheque_images (
  evenement_id, domaine_slug, title, caption, alt_text, local_asset_path,
  public_url, is_cover, order_index, visibility, consent_status, source,
  taken_at
)
select
  e.id,
  image_seed.domaine_slug,
  image_seed.title,
  image_seed.caption,
  image_seed.alt_text,
  image_seed.local_asset_path,
  image_seed.local_asset_path,
  image_seed.is_cover,
  image_seed.order_index,
  'public',
  'to-review',
  'nouveau-afd-2026',
  image_seed.taken_at
from image_seed
join public.bibliotheque_evenements e on e.slug = image_seed.event_slug;
