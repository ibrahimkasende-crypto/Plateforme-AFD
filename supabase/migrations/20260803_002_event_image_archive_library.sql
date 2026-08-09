-- Bibliotheque numerique AFD : evenements, preuves images et rattachement aux domaines.
-- Migration non destructive : cree les tables manquantes, les permissions et des donnees
-- de depart basees sur la banque d'images classee AFD.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Permissions applicatives
-- ---------------------------------------------------------------------------
insert into public.permissions (nom, description) values
  ('archives:read', 'Lire la bibliotheque numerique des evenements'),
  ('archives:write', 'Creer et modifier les archives evenements/images'),
  ('archives:publish', 'Publier les archives sur le site public')
on conflict (nom) do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.nom in ('platform_owner', 'tenant_owner', 'tenant_super_admin', 'super_admin')
  and p.nom in ('archives:read', 'archives:write', 'archives:publish')
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('archives:read', 'archives:write', 'archives:publish')
where r.nom in ('direction_generale', 'communication')
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom in ('archives:read', 'archives:write')
where r.nom in (
  'administrateur',
  'charge_programmes',
  'coordination_urgences',
  'coordination_sante',
  'coordination_developpement',
  'coordination_meal'
)
on conflict do nothing;

insert into public.roles_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.nom = 'archives:read'
where r.nom in ('agent_terrain', 'auditeur', 'lecture_partenaire', 'partenaire_lecture')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Domaines d'intervention de base
-- ---------------------------------------------------------------------------
insert into public.domaines_intervention (
  slug,
  title,
  subtitle,
  summary,
  description,
  priority_actions,
  audiences,
  expected_results,
  keywords,
  topics,
  icon,
  image_url,
  image_alt,
  order_index,
  status,
  featured,
  published_at,
  source
) values
  (
    'autonomisation-economique',
    'Autonomisation economique des femmes',
    'Entrepreneuriat, formation et moyens de subsistance',
    'Renforcer l''independance financiere des femmes a travers l''entrepreneuriat, la formation professionnelle, les activites generatrices de revenus, les cooperatives et l''accompagnement vers l''emploi.',
    'L''AFD accompagne les femmes et les jeunes filles pour developper des competences economiques durables, acceder a des opportunites d''activites generatrices de revenus et renforcer leur role dans l''economie locale.',
    array['Former aux competences entrepreneuriales et a la gestion','Soutenir les activites generatrices de revenus','Renforcer les cooperatives et les groupes d''epargne','Accompagner l''acces a l''emploi'],
    array['Femmes entrepreneures','Jeunes filles en formation','Groupes et cooperatives communautaires'],
    array['Autonomie economique renforcee','Moyens de subsistance diversifies','Participation accrue des femmes a l''economie locale'],
    array['Entrepreneuriat','Formation','AGR'],
    array['Entrepreneuriat feminin','Formation professionnelle','Activites generatrices de revenus','Cooperatives'],
    'Briefcase',
    '/assets/Banque des images AFD - Classees/19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg',
    'Equipe AFD devant une affiche institutionnelle liee a la promotion economique et a l''entrepreneuriat.',
    1,
    'publie',
    true,
    now(),
    'seed-afd'
  ),
  (
    'protection-vbg-droits-femmes',
    'Protection, VBG et droits des femmes',
    'Prevention, accompagnement et dignite',
    'Prevenir et repondre aux violences basees sur le genre, proteger les survivantes et promouvoir les droits et la dignite des femmes et des filles.',
    'L''AFD agit pour la prevention des violences basees sur le genre, la protection des survivantes, la sensibilisation communautaire et la lutte contre l''exploitation, les abus sexuels et le harcelement.',
    array['Sensibiliser les communautes a la prevention des VBG','Accompagner les survivantes vers des services adaptes','Promouvoir les droits et la dignite des femmes et des filles'],
    array['Femmes et filles exposees aux risques','Survivantes de VBG','Communautes et leaders locaux'],
    array['Meilleure connaissance des recours','Acces renforce a l''accompagnement','Environnements plus protecteurs'],
    array['VBG','Protection','Droits'],
    array['Violences basees sur le genre','Protection des survivantes','Prevention et sensibilisation','Droits des femmes'],
    'Shield',
    '/assets/Banque des images AFD - Classees/22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg',
    'Activite de sensibilisation sur les droits des femmes et des filles.',
    2,
    'publie',
    true,
    now(),
    'seed-afd'
  ),
  (
    'sante-maternelle-infantile',
    'Sante maternelle et infantile',
    'Prevention, soins essentiels et accompagnement',
    'Ameliorer l''acces des femmes, des meres et des enfants aux services de sante, a la prevention, aux soins essentiels et a l''accompagnement communautaire.',
    'L''AFD contribue a ameliorer l''acces aux informations et aux services de sante maternelle et infantile, en privilegiant la prevention, la sensibilisation et l''accompagnement communautaire.',
    array['Sensibiliser aux bonnes pratiques de sante maternelle','Faciliter l''acces aux soins essentiels','Renforcer l''accompagnement communautaire des meres'],
    array['Femmes enceintes et jeunes meres','Enfants et familles','Relais communautaires'],
    array['Meilleure information sur la sante maternelle','Orientation renforcee vers les services essentiels','Pratiques communautaires plus protectrices'],
    array['Sante','Maternite','Prevention'],
    array['Sante maternelle','Sante infantile','Prevention','Soins essentiels'],
    'HeartPulse',
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg',
    'Femmes reunies pendant une seance de sensibilisation en sante communautaire.',
    3,
    'publie',
    false,
    now(),
    'seed-afd'
  ),
  (
    'eau-hygiene-assainissement',
    'Eau, hygiene et assainissement - WASH',
    'Acces durable a l''eau et aux infrastructures sanitaires',
    'Favoriser un acces durable a l''eau potable, a l''hygiene et aux infrastructures sanitaires afin de proteger la sante des femmes, des enfants et des communautes.',
    'Dans le domaine WASH, l''AFD agit pour ameliorer l''acces a l''eau potable, promouvoir les pratiques d''hygiene et soutenir des solutions d''assainissement adaptees aux besoins des communautes.',
    array['Ameliorer l''acces a l''eau potable','Promouvoir les pratiques d''hygiene','Soutenir les infrastructures sanitaires adaptees'],
    array['Femmes et enfants','Menages et communautes locales','Acteurs communautaires de l''eau et de l''hygiene'],
    array['Acces ameliore a l''eau et a l''hygiene','Reduction des risques sanitaires lies a l''eau','Pratiques d''hygiene renforcees'],
    array['WASH','Eau','Hygiene'],
    array['Eau potable','Hygiene','Assainissement','Sante communautaire'],
    'Droplets',
    '/assets/Banque des images AFD - Classees/06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg',
    'Dispositifs de lavage des mains installes lors d''une activite WASH.',
    4,
    'publie',
    false,
    now(),
    'seed-afd'
  ),
  (
    'femmes-leadership-gouvernance-communautaire',
    'Femmes, leadership et gouvernance communautaire',
    'Participation, prise de decision et gouvernance locale',
    'Renforcer le leadership des femmes et leur participation active a la gouvernance communautaire, afin qu''elles prennent part aux decisions qui faconnent leur environnement.',
    'L''AFD accompagne les femmes et les jeunes filles pour developper leur leadership, investir les espaces de dialogue et contribuer a une gouvernance communautaire plus inclusive.',
    array['Renforcer les competences de leadership des femmes','Soutenir la participation aux instances communautaires','Promouvoir une gouvernance inclusive et redevable'],
    array['Femmes leaders et aspirantes leaders','Jeunes filles engagees','Structures de gouvernance locale'],
    array['Leadership des femmes renforce','Participation accrue aux decisions locales','Gouvernance communautaire plus inclusive'],
    array['Leadership','Gouvernance','Participation'],
    array['Leadership des femmes','Gouvernance communautaire','Participation aux decisions','Renforcement des capacites'],
    'Users',
    '/assets/Banque des images AFD - Classees/24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_001.jpg',
    'Equipe AFD lors de civilites avec des autorites territoriales a Mambasa.',
    5,
    'publie',
    false,
    now(),
    'seed-afd'
  ),
  (
    'femmes-reponse-humanitaire-urgence',
    'Femmes dans la reponse humanitaire et d''urgence',
    'Action humanitaire centree sur les femmes et les filles',
    'Placer les femmes au coeur de la reponse humanitaire et d''urgence, en veillant a leur securite, leur dignite et a la prise en compte de leurs besoins specifiques.',
    'L''AFD agit pour que les femmes et les filles soient pleinement considerees dans les reponses humanitaires et d''urgence, avec une attention particuliere a la protection et a la dignite.',
    array['Integrer les besoins des femmes et des filles dans la reponse d''urgence','Renforcer la protection et la dignite en contexte de crise','Soutenir la participation des femmes a l''action humanitaire'],
    array['Femmes et filles en situation de crise','Populations affectees par les urgences','Acteurs humanitaires et communautaires'],
    array['Reponses humanitaires plus attentives aux femmes et aux filles','Meilleure prise en compte de la protection et de la dignite','Participation accrue des femmes a l''action d''urgence'],
    array['Humanitaire','Urgences','Femmes'],
    array['Reponse humanitaire','Urgences','Protection des femmes et des filles','Participation des femmes'],
    'LifeBuoy',
    '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg',
    'Equipe AFD evaluant les besoins dans un site de deplaces.',
    6,
    'publie',
    true,
    now(),
    'seed-afd'
  )
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  description = excluded.description,
  priority_actions = excluded.priority_actions,
  audiences = excluded.audiences,
  expected_results = excluded.expected_results,
  keywords = excluded.keywords,
  topics = excluded.topics,
  icon = excluded.icon,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  order_index = excluded.order_index,
  status = excluded.status,
  featured = excluded.featured,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Actualites de depart publiees
-- ---------------------------------------------------------------------------
insert into public.actualites (
  slug,
  title,
  excerpt,
  content,
  image_url,
  category,
  published,
  published_at,
  author,
  status,
  featured,
  source,
  migration_note
) values
  (
    'lutte-contre-ebola-sensibilisation-prevention',
    'Lutte contre Ebola : l''AFD ASBL renforce la sensibilisation et la prevention communautaire',
    'Face aux risques epidemiques, l''AFD ASBL mobilise les communautes autour de la prevention, de l''information et de la protection, avec une attention particuliere aux femmes, aux filles et aux familles.',
    'L''Alliance des Femmes pour le Developpement s''engage dans la lutte contre Ebola a travers des actions de sensibilisation, de prevention et d''accompagnement communautaire. Les seances d''information renforcent les gestes protecteurs, l''hygiene et l''orientation vers les services de sante.',
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg',
    'Article',
    true,
    '2026-07-16 08:00:00+00',
    'AFD ASBL',
    'publie',
    true,
    'afd-rdc.org',
    'Sujet oriente vers la lutte contre Ebola avec image de sensibilisation STOP EBOLA.'
  ),
  (
    'urgence-ituri-deplaces-ceca-20-makoko-mambasa',
    'Urgence en Ituri : L''AFD evalue les besoins des deplaces du site CECA-20 MAKOKO a Mambasa',
    'Face a la crise humanitaire en Ituri, l''equipe de l''AFD ASBL s''est rendue sur le site de deplaces CECA-20 MAKOKO pour identifier les besoins critiques en protection, sante, WASH et VBG.',
    'En Ituri, l''AFD ASBL a evalue les besoins des personnes deplacees sur le site CECA-20 MAKOKO a Mambasa afin d''orienter une reponse humanitaire adaptee aux realites du terrain et aux besoins specifiques des femmes et des filles.',
    '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg',
    'Article',
    true,
    '2026-06-03 08:00:00+00',
    'AFD ASBL',
    'publie',
    true,
    'afd-rdc.org',
    'Image d''evaluation du site CECA-20 MAKOKO.'
  ),
  (
    'expansion-afd-maillage-territorial-7-provinces',
    'Expansion de l''AFD ASBL : Un maillage territorial renforce a travers 7 provinces de la RDC',
    'De Kinshasa a la Tshuapa, decouvrez comment l''AFD ASBL deploie ses bureaux de representation pour etre au plus pres des communautes rurales et urbaines.',
    'L''AFD ASBL renforce son maillage territorial a travers sept provinces de la Republique democratique du Congo afin de rapprocher ses actions des communautes rurales et urbaines.',
    '/assets/Banque des images AFD - Classees/24_visites_institutionnelles/afd_visites_institutionnelles_visite_mcz_hgr_mambasa_012.jpg',
    'Article',
    true,
    '2026-05-09 08:00:00+00',
    'AFD ASBL',
    'publie',
    false,
    'afd-rdc.org',
    'Image de visite institutionnelle a Mambasa.'
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

-- ---------------------------------------------------------------------------
-- Tables archives
-- ---------------------------------------------------------------------------
create table if not exists public.bibliotheque_evenements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  resume text,
  description text,
  domaine_slug text not null,
  domaine_id uuid references public.domaines_intervention(id) on delete set null,
  actualite_id uuid references public.actualites(id) on delete set null,
  activite_id uuid,
  programme_id uuid,
  projet_id uuid,
  date_evenement date,
  heure_debut time,
  heure_fin time,
  lieu_nom text,
  adresse text,
  province text,
  territoire text,
  localite text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  localisation_precise jsonb not null default '{}'::jsonb,
  nombre_participants integer,
  femmes integer,
  hommes integer,
  enfants integer,
  tags text[] not null default '{}',
  cover_image_url text,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'en_revision', 'approuve', 'programme', 'publie', 'depublie', 'archive')),
  publie boolean not null default false,
  featured boolean not null default false,
  order_index integer not null default 0,
  seo_title text,
  seo_description text,
  source text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.bibliotheque_images (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid not null references public.bibliotheque_evenements(id) on delete cascade,
  domaine_slug text not null,
  title text,
  caption text,
  alt_text text not null,
  storage_bucket text,
  storage_path text,
  public_url text,
  local_asset_path text,
  media_id uuid references public.medias(id) on delete set null,
  width integer,
  height integer,
  taken_at timestamptz,
  photographer text,
  consent_status text not null default 'to-review'
    check (consent_status in ('approved', 'to-review', 'not-required', 'refused', 'absent')),
  visibility text not null default 'public'
    check (visibility in ('public', 'private', 'unlisted')),
  is_cover boolean not null default false,
  order_index integer not null default 0,
  source text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (
    public_url is not null
    or local_asset_path is not null
    or (storage_bucket is not null and storage_path is not null)
  )
);

create index if not exists bibliotheque_evenements_domain_idx
  on public.bibliotheque_evenements (domaine_slug, date_evenement desc);
create index if not exists bibliotheque_evenements_public_idx
  on public.bibliotheque_evenements (publie, statut, deleted_at);
create index if not exists bibliotheque_images_event_idx
  on public.bibliotheque_images (evenement_id, order_index);
create unique index if not exists bibliotheque_images_event_asset_uidx
  on public.bibliotheque_images (evenement_id, coalesce(local_asset_path, public_url, storage_bucket || '/' || storage_path))
  where deleted_at is null;

drop trigger if exists bibliotheque_evenements_set_updated_at on public.bibliotheque_evenements;
create trigger bibliotheque_evenements_set_updated_at
before update on public.bibliotheque_evenements
for each row execute function public.set_updated_at();

drop trigger if exists bibliotheque_images_set_updated_at on public.bibliotheque_images;
create trigger bibliotheque_images_set_updated_at
before update on public.bibliotheque_images
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.bibliotheque_evenements enable row level security;
alter table public.bibliotheque_images enable row level security;

drop policy if exists "Lecture publique archives evenements" on public.bibliotheque_evenements;
create policy "Lecture publique archives evenements"
on public.bibliotheque_evenements for select to anon, authenticated
using (publie = true and statut = 'publie' and deleted_at is null);

drop policy if exists "Lecture publique archives images" on public.bibliotheque_images;
create policy "Lecture publique archives images"
on public.bibliotheque_images for select to anon, authenticated
using (
  visibility = 'public'
  and deleted_at is null
  and exists (
    select 1
    from public.bibliotheque_evenements e
    where e.id = bibliotheque_images.evenement_id
      and e.publie = true
      and e.statut = 'publie'
      and e.deleted_at is null
  )
);

drop policy if exists "Admins lisent archives evenements" on public.bibliotheque_evenements;
create policy "Admins lisent archives evenements"
on public.bibliotheque_evenements for select to authenticated
using (
  public.has_permission('archives:read')
  or public.has_permission('archives:write')
  or public.has_permission('actualites:write')
  or public.has_role('super_admin')
);

drop policy if exists "Admins gerent archives evenements" on public.bibliotheque_evenements;
create policy "Admins gerent archives evenements"
on public.bibliotheque_evenements for all to authenticated
using (
  public.has_permission('archives:write')
  or public.has_permission('actualites:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('archives:write')
  or public.has_permission('actualites:write')
  or public.has_role('super_admin')
);

drop policy if exists "Admins lisent archives images" on public.bibliotheque_images;
create policy "Admins lisent archives images"
on public.bibliotheque_images for select to authenticated
using (
  public.has_permission('archives:read')
  or public.has_permission('archives:write')
  or public.has_permission('mediatheque:read')
  or public.has_role('super_admin')
);

drop policy if exists "Admins gerent archives images" on public.bibliotheque_images;
create policy "Admins gerent archives images"
on public.bibliotheque_images for all to authenticated
using (
  public.has_permission('archives:write')
  or public.has_permission('mediatheque:write')
  or public.has_role('super_admin')
)
with check (
  public.has_permission('archives:write')
  or public.has_permission('mediatheque:write')
  or public.has_role('super_admin')
);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'afd-archives',
  'afd-archives',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/avif','application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Lecture publique afd archives" on storage.objects;
create policy "Lecture publique afd archives"
on storage.objects for select to anon, authenticated
using (bucket_id = 'afd-archives');

drop policy if exists "Admins gerent afd archives" on storage.objects;
create policy "Admins gerent afd archives"
on storage.objects for all to authenticated
using (
  bucket_id = 'afd-archives'
  and (
    public.has_permission('archives:write')
    or public.has_permission('mediatheque:write')
    or public.has_role('super_admin')
  )
)
with check (
  bucket_id = 'afd-archives'
  and (
    public.has_permission('archives:write')
    or public.has_permission('mediatheque:write')
    or public.has_role('super_admin')
  )
);

-- ---------------------------------------------------------------------------
-- Donnees reelles de depart : archives evenements/images
-- ---------------------------------------------------------------------------
insert into public.bibliotheque_evenements (
  slug, titre, resume, description, domaine_slug, domaine_id, actualite_id,
  date_evenement, heure_debut, heure_fin, lieu_nom, adresse, province, territoire,
  localite, tags, cover_image_url, statut, publie, featured, order_index,
  seo_title, seo_description, source, published_at
) values
  (
    'rencontre-aprocm-promotion-entrepreneuriat-tshopo',
    'Rencontre APROCM autour de la promotion economique et de l''entrepreneuriat',
    'Trace photographique d''une rencontre institutionnelle liee a la promotion des classes moyennes, de l''entrepreneuriat et du developpement des PME.',
    'Cette archive documente la presence de l''AFD dans un cadre lie a la promotion economique et a l''entrepreneuriat. Les images servent de preuve visuelle pour rattacher l''activite au domaine de l''autonomisation economique.',
    'autonomisation-economique',
    (select id from public.domaines_intervention where slug = 'autonomisation-economique'),
    null,
    '2026-06-29',
    '23:18',
    null,
    'APROCM / coordination provinciale de la Tshopo',
    'Kisangani',
    'Tshopo',
    null,
    'Kisangani',
    array['entrepreneuriat','promotion economique','PME','Tshopo'],
    '/assets/Banque des images AFD - Classees/19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg',
    'publie',
    true,
    true,
    10,
    'Archive entrepreneuriat et promotion economique | AFD ASBL',
    'Images et informations de terrain rattachees a l''autonomisation economique des femmes.',
    'banque-images-afd',
    now()
  ),
  (
    'sensibilisation-droits-femmes-camp-kabila',
    'Sensibilisation sur les droits des femmes au Camp Kabila',
    'Activite communautaire de sensibilisation autour des droits des femmes et de la dignite des filles.',
    'Cette archive rassemble les images classees de la sensibilisation organisee autour du 8 mars au Camp Kabila. Elle appuie les preuves de travail de l''AFD dans la protection, les droits des femmes et la prevention des violences.',
    'protection-vbg-droits-femmes',
    (select id from public.domaines_intervention where slug = 'protection-vbg-droits-femmes'),
    null,
    '2026-03-08',
    null,
    null,
    'Camp Kabila',
    null,
    null,
    null,
    'Camp Kabila',
    array['droits des femmes','sensibilisation','8 mars','protection'],
    '/assets/Banque des images AFD - Classees/22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg',
    'publie',
    true,
    true,
    20,
    'Archive droits des femmes Camp Kabila | AFD ASBL',
    'Images de sensibilisation sur les droits des femmes et des filles.',
    'banque-images-afd',
    now()
  ),
  (
    'sensibilisation-cpn-salama-prevention-ebola',
    'Sensibilisation CPN SALAMA et prevention communautaire Ebola',
    'Seance de sensibilisation en sante communautaire dans l''aire de sante SALAMA, avec messages de prevention et mobilisation des femmes.',
    'L''archive documente une activite de sensibilisation CPN SALAMA. Les metadonnees de la banque d''images indiquent une prise de vue le 8 juillet 2026 autour de la sante maternelle, de la prevention et de la mobilisation communautaire.',
    'sante-maternelle-infantile',
    (select id from public.domaines_intervention where slug = 'sante-maternelle-infantile'),
    (select id from public.actualites where slug = 'lutte-contre-ebola-sensibilisation-prevention'),
    '2026-07-08',
    '12:48',
    null,
    'Aire de sante SALAMA',
    'Centre de sante SALAMA',
    'Ituri',
    'Mambasa',
    'SALAMA',
    array['sante maternelle','CPN','Ebola','sensibilisation','prevention'],
    '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg',
    'publie',
    true,
    true,
    30,
    'Archive prevention Ebola et CPN SALAMA | AFD ASBL',
    'Preuves images d''une sensibilisation de sante communautaire dans l''aire de sante SALAMA.',
    'banque-images-afd',
    now()
  ),
  (
    'dotation-lavage-mains-ceca-20-makoko',
    'Dotation et sensibilisation lavage des mains au site CECA-20 MAKOKO',
    'Activite WASH autour des dispositifs de lavage des mains et des pratiques d''hygiene.',
    'Cette archive rattache les images de dotation et de sensibilisation WASH au site CECA-20 MAKOKO. Elle permet de documenter les preuves terrain liees a l''eau, l''hygiene et l''assainissement.',
    'eau-hygiene-assainissement',
    (select id from public.domaines_intervention where slug = 'eau-hygiene-assainissement'),
    (select id from public.actualites where slug = 'urgence-ituri-deplaces-ceca-20-makoko-mambasa'),
    '2026-06-03',
    null,
    null,
    'Site CECA-20 MAKOKO',
    'Mambasa',
    'Ituri',
    'Mambasa',
    'CECA-20 MAKOKO',
    array['WASH','hygiene','lavage des mains','site de deplaces'],
    '/assets/Banque des images AFD - Classees/06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg',
    'publie',
    true,
    true,
    40,
    'Archive WASH CECA-20 MAKOKO | AFD ASBL',
    'Images de dotation et sensibilisation lavage des mains au site CECA-20 MAKOKO.',
    'banque-images-afd',
    now()
  ),
  (
    'civilites-autorites-territoriales-mambasa',
    'Civilites avec les autorites territoriales de Mambasa',
    'Rencontre institutionnelle de proximite avec les autorites territoriales, utile a la gouvernance communautaire et a la coordination locale.',
    'Cette archive documente une visite officielle de l''AFD aupres des autorites territoriales de Mambasa. Elle soutient le domaine leadership et gouvernance communautaire par les preuves de dialogue institutionnel.',
    'femmes-leadership-gouvernance-communautaire',
    (select id from public.domaines_intervention where slug = 'femmes-leadership-gouvernance-communautaire'),
    (select id from public.actualites where slug = 'expansion-afd-maillage-territorial-7-provinces'),
    '2026-07-02',
    '10:27',
    null,
    'Administration territoriale de Mambasa',
    'Mambasa',
    'Ituri',
    'Mambasa',
    'Mambasa',
    array['gouvernance','autorites territoriales','coordination','Mambasa'],
    '/assets/Banque des images AFD - Classees/24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_001.jpg',
    'publie',
    true,
    true,
    50,
    'Archive gouvernance Mambasa | AFD ASBL',
    'Preuves images d''une rencontre institutionnelle avec les autorites territoriales de Mambasa.',
    'banque-images-afd',
    now()
  ),
  (
    'visite-evaluation-site-deplaces-ceca-20-makoko',
    'Evaluation des besoins au site de deplaces CECA-20 MAKOKO',
    'Mission terrain d''evaluation des besoins des personnes deplacees, avec attention aux enjeux protection, sante, WASH et VBG.',
    'Cette archive regroupe les photos d''evaluation terrain au site CECA-20 MAKOKO a Mambasa. Elle rattache l''activite au domaine de la reponse humanitaire et d''urgence.',
    'femmes-reponse-humanitaire-urgence',
    (select id from public.domaines_intervention where slug = 'femmes-reponse-humanitaire-urgence'),
    (select id from public.actualites where slug = 'urgence-ituri-deplaces-ceca-20-makoko-mambasa'),
    '2026-06-03',
    null,
    null,
    'Site de deplaces CECA-20 MAKOKO',
    'Mambasa',
    'Ituri',
    'Mambasa',
    'CECA-20 MAKOKO',
    array['urgence','humanitaire','deplaces','evaluation des besoins','Ituri'],
    '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg',
    'publie',
    true,
    true,
    60,
    'Archive evaluation CECA-20 MAKOKO | AFD ASBL',
    'Images d''evaluation des besoins dans un site de deplaces a Mambasa.',
    'banque-images-afd',
    now()
  )
on conflict (slug) do update set
  titre = excluded.titre,
  resume = excluded.resume,
  description = excluded.description,
  domaine_slug = excluded.domaine_slug,
  domaine_id = excluded.domaine_id,
  actualite_id = excluded.actualite_id,
  date_evenement = excluded.date_evenement,
  heure_debut = excluded.heure_debut,
  heure_fin = excluded.heure_fin,
  lieu_nom = excluded.lieu_nom,
  adresse = excluded.adresse,
  province = excluded.province,
  territoire = excluded.territoire,
  localite = excluded.localite,
  tags = excluded.tags,
  cover_image_url = excluded.cover_image_url,
  statut = excluded.statut,
  publie = excluded.publie,
  featured = excluded.featured,
  order_index = excluded.order_index,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  source = excluded.source,
  published_at = coalesce(public.bibliotheque_evenements.published_at, excluded.published_at),
  updated_at = now();

insert into public.bibliotheque_images (
  evenement_id, domaine_slug, title, caption, alt_text, local_asset_path,
  is_cover, order_index, taken_at, consent_status, source
) values
  ((select id from public.bibliotheque_evenements where slug = 'rencontre-aprocm-promotion-entrepreneuriat-tshopo'), 'autonomisation-economique', 'Promotion economique APROCM', 'Equipe AFD devant une affiche APROCM liee a l''entrepreneuriat et aux PME.', 'Equipe AFD devant une affiche de promotion economique et entrepreneuriat.', '/assets/Banque des images AFD - Classees/19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_005.jpg', true, 1, '2026-06-29 23:18:44+00', 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'rencontre-aprocm-promotion-entrepreneuriat-tshopo'), 'autonomisation-economique', 'Remise de documents Tshopo', 'Rencontre officielle de remise de documents a la coordination Tshopo.', 'Remise officielle de documents dans un bureau institutionnel.', '/assets/Banque des images AFD - Classees/19_gouvernance/afd_gouvernance_remise_documents_coordination_tshopo_001.jpg', false, 2, '2026-06-29 23:18:07+00', 'to-review', 'banque-images-afd'),

  ((select id from public.bibliotheque_evenements where slug = 'sensibilisation-droits-femmes-camp-kabila'), 'protection-vbg-droits-femmes', 'Sensibilisation 8 mars Camp Kabila', 'Groupe mobilise pendant une sensibilisation sur les droits des femmes.', 'Activite de sensibilisation avec participantes et equipe AFD.', '/assets/Banque des images AFD - Classees/22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_004.jpg', true, 1, null, 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'sensibilisation-droits-femmes-camp-kabila'), 'protection-vbg-droits-femmes', 'Equipe et participantes', 'Photo de groupe lors de la sensibilisation au Camp Kabila.', 'Groupe reuni lors d''une sensibilisation sur les droits des femmes.', '/assets/Banque des images AFD - Classees/22_sensibilisation/afd_sensibilisation_sensibilisation_8_mars_camp_kabila_007.jpg', false, 2, null, 'to-review', 'banque-images-afd'),

  ((select id from public.bibliotheque_evenements where slug = 'sensibilisation-cpn-salama-prevention-ebola'), 'sante-maternelle-infantile', 'Sensibilisation CPN SALAMA', 'Femmes reunies devant un centre de sante pendant une sensibilisation CPN.', 'Femmes participant a une sensibilisation de sante communautaire.', '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_011.jpg', true, 1, '2026-07-08 12:48:57+00', 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'sensibilisation-cpn-salama-prevention-ebola'), 'sante-maternelle-infantile', 'Participation communautaire SALAMA', 'Participants et personnel pendant la sensibilisation CPN SALAMA.', 'Groupe de femmes et personnel de sante pendant une sensibilisation.', '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_012.jpg', false, 2, '2026-07-08 12:48:59+00', 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'sensibilisation-cpn-salama-prevention-ebola'), 'sante-maternelle-infantile', 'Message de prevention', 'Sensibilisation en sante avec references de prevention visibles.', 'Participants a une action de prevention sante communautaire.', '/assets/Banque des images AFD - Classees/01_sante/afd_sante_sensibilisation_cpn_salama_013.jpg', false, 3, '2026-07-08 12:49:07+00', 'to-review', 'banque-images-afd'),

  ((select id from public.bibliotheque_evenements where slug = 'dotation-lavage-mains-ceca-20-makoko'), 'eau-hygiene-assainissement', 'Dispositifs de lavage des mains', 'Dispositifs de lavage des mains prepares pour une activite WASH.', 'Dispositifs de lavage des mains installes sur un site communautaire.', '/assets/Banque des images AFD - Classees/06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_007.jpg', true, 1, null, 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'dotation-lavage-mains-ceca-20-makoko'), 'eau-hygiene-assainissement', 'Demonstration hygiene', 'Demontration autour de l''hygiene des mains pendant une activite WASH.', 'Demontration communautaire sur le lavage des mains.', '/assets/Banque des images AFD - Classees/06_wash/afd_wash_sensibilisation_dotation_lavage_mains_site_ceca_20_makoko_1_017.jpg', false, 2, null, 'to-review', 'banque-images-afd'),

  ((select id from public.bibliotheque_evenements where slug = 'civilites-autorites-territoriales-mambasa'), 'femmes-leadership-gouvernance-communautaire', 'Civilites a Mambasa', 'Equipe AFD lors de civilites avec des autorites territoriales a Mambasa.', 'Equipe AFD devant un batiment administratif a Mambasa.', '/assets/Banque des images AFD - Classees/24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_001.jpg', true, 1, '2026-07-02 10:27:09+00', 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'civilites-autorites-territoriales-mambasa'), 'femmes-leadership-gouvernance-communautaire', 'Autorites territoriales', 'Rencontre officielle avec les autorites territoriales de Mambasa.', 'Equipe AFD et autorites locales devant un batiment administratif.', '/assets/Banque des images AFD - Classees/24_visites_institutionnelles/afd_visites_institutionnelles_civilites_autorites_mambasa_002.jpg', false, 2, '2026-07-02 10:27:09+00', 'to-review', 'banque-images-afd'),

  ((select id from public.bibliotheque_evenements where slug = 'visite-evaluation-site-deplaces-ceca-20-makoko'), 'femmes-reponse-humanitaire-urgence', 'Evaluation CECA-20 MAKOKO', 'Equipe AFD en visite d''evaluation dans un site de deplaces.', 'Equipe AFD evaluant les besoins dans un site de deplaces.', '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_010.jpg', true, 1, null, 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'visite-evaluation-site-deplaces-ceca-20-makoko'), 'femmes-reponse-humanitaire-urgence', 'Mission terrain Mambasa', 'Visite d''evaluation des besoins au site CECA-20 MAKOKO.', 'Equipe terrain dans un site de deplaces a Mambasa.', '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_011.jpg', false, 2, null, 'to-review', 'banque-images-afd'),
  ((select id from public.bibliotheque_evenements where slug = 'visite-evaluation-site-deplaces-ceca-20-makoko'), 'femmes-reponse-humanitaire-urgence', 'Echanges communautaires', 'Echanges terrain avec les populations deplacees.', 'Echanges communautaires pendant une mission humanitaire.', '/assets/Banque des images AFD - Classees/17_missions_terrain/afd_missions_terrain_visite_evaluation_site_deplaces_site_ceca_20_makoko_1_012.jpg', false, 3, null, 'to-review', 'banque-images-afd')
on conflict do nothing;
