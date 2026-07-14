/*
  # Update AFD Database - New tables and data updates

  ## New Tables
  - `team_members` - équipe de direction
  - `partners` - partenaires
  - `clusters` - clusters et groupes de travail
  - `site_settings` - paramètres du site (données statiques)

  ## Data Updates
  - Mise à jour du programme VBG
  - Ajout de 3 nouveaux programmes urgences humanitaires
  - Ajout de projets supplémentaires (pour atteindre 10)
  - Mise à jour des settings: année 2019, 7 ans d'expérience, 10 projets
*/

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

INSERT INTO site_settings (key, value) VALUES
  ('founded_year', '2019'),
  ('experience_years', '7'),
  ('active_projects', '10'),
  ('provinces_count', '12'),
  ('beneficiaries', '50000'),
  ('address', 'Kinshasa Songololo 145')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================
-- TABLE: team_members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  description text NOT NULL,
  gender text DEFAULT 'femme' CHECK (gender IN ('homme', 'femme')),
  photo_url text,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (active = true);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");

INSERT INTO team_members (name, role, description, gender, "order") VALUES
  ('Marie Kabamba', 'Présidente', 'Leader visionnaire avec 20 ans d''expérience dans le développement communautaire et la défense des droits des femmes.', 'femme', 1),
  ('Jeanne Mukendi', 'Directrice Exécutive', 'Experte en gestion de projets humanitaires et développement durable en contexte de crise.', 'femme', 2),
  ('Grace Tshilombo', 'Coordinatrice des Programmes', 'Spécialiste en santé maternelle et infantile avec 12 ans d''expérience terrain.', 'femme', 3),
  ('Espérance Nsimba', 'Responsable Communication', 'Journaliste et militante pour les droits des femmes et l''égalité des genres.', 'femme', 4),
  ('Patience Kalala', 'Coordinatrice VBG/PSA/HS', 'Experte en protection et réponse aux violences basées sur le genre dans les zones de conflit.', 'femme', 5),
  ('Claudine Mwanza', 'Responsable Finances', 'Comptable certifiée avec expertise en gestion financière des ONG humanitaires.', 'femme', 6),
  ('Yvette Bolamba', 'Coordinatrice WASH', 'Ingénieure sanitaire spécialisée dans les projets eau, hygiène et assainissement.', 'femme', 7),
  ('Solange Luboya', 'Responsable Plaidoyer', 'Avocate engagée dans la défense des droits des femmes et des enfants en RDC.', 'femme', 8),
  ('Anastasie Ngandu', 'Coordinatrice Éducation', 'Pédagogue et spécialiste en alphabétisation et scolarisation des filles en milieu rural.', 'femme', 9),
  ('Denise Kitenge', 'Responsable Urgences Humanitaires', 'Coordinatrice humanitaire avec 10 ans d''expérience dans la réponse aux crises en RDC.', 'femme', 10),
  ('Rosalie Mutombo', 'Coordinatrice Cluster Nutrition', 'Nutritionniste engagée dans la lutte contre la malnutrition infantile en zones d''urgence.', 'femme', 11),
  ('Jean-Paul Lukusa', 'Responsable Logistique', 'Expert logistique avec expérience dans les opérations humanitaires en zones reculées.', 'homme', 12),
  ('Pierre Mbuyi', 'Responsable IT', 'Ingénieur informatique assurant la transformation numérique de l''organisation.', 'homme', 13);

-- ============================================================
-- TABLE: partners
-- ============================================================
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  category text DEFAULT 'international' CHECK (category IN ('international', 'gouvernement', 'ong', 'privé')),
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners"
  ON partners FOR SELECT
  USING (active = true);

CREATE INDEX IF NOT EXISTS idx_partners_order ON partners("order");

INSERT INTO partners (name, category, "order") VALUES
  ('UNICEF', 'international', 1),
  ('ONU Femmes', 'international', 2),
  ('USAID', 'international', 3),
  ('Union Européenne', 'international', 4),
  ('OMS', 'international', 5),
  ('UNHCR', 'international', 6),
  ('Gouvernement RDC', 'gouvernement', 7),
  ('Centre Carter', 'ong', 8),
  ('Expertise France', 'international', 9);

-- ============================================================
-- TABLE: clusters
-- ============================================================
CREATE TABLE IF NOT EXISTS clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT 'cluster' CHECK (type IN ('cluster', 'working_group')),
  description text,
  icon text DEFAULT 'users',
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active clusters"
  ON clusters FOR SELECT
  USING (active = true);

CREATE INDEX IF NOT EXISTS idx_clusters_type ON clusters(type);

INSERT INTO clusters (name, type, description, icon, "order") VALUES
  ('Cluster Protection', 'cluster', 'Coordination des interventions de protection des civils, des femmes et des enfants dans les zones de crise.', 'shield', 1),
  ('Cluster Santé', 'cluster', 'Coordination des services de santé d''urgence, y compris la santé reproductive et maternelle.', 'heart-pulse', 2),
  ('Cluster Éducation', 'cluster', 'Coordination des activités d''éducation en situations d''urgence et de maintien de la scolarisation.', 'book-open', 3),
  ('Cluster WASH', 'cluster', 'Coordination des interventions eau, hygiène et assainissement dans les zones affectées.', 'droplet', 4),
  ('Cluster Nutrition', 'cluster', 'Coordination de la réponse nutritionnelle pour lutter contre la malnutrition aiguë sévère.', 'apple', 5),
  ('GT Santé Sexuelle et Reproductive (SSR)', 'working_group', 'Groupe de travail assurant l''accès aux soins de santé sexuelle et reproductive en situation d''urgence.', 'activity', 6),
  ('GT Violences Basées sur le Genre (VBG)', 'working_group', 'Groupe de travail координant la prévention et la réponse aux violences basées sur le genre.', 'shield-alert', 7),
  ('GT Logistique', 'working_group', 'Groupe de travail assurant la coordination logistique pour la livraison de l''aide humanitaire.', 'truck', 8);

-- ============================================================
-- UPDATE: Programme VBG - libellé
-- ============================================================
UPDATE programs
SET
  title = 'Lutte contre les violences basées sur le genre (VBG/PSA/HS)',
  description = 'Prévenir et répondre aux violences sexuelles, psychosociales et basées sur le genre faites aux femmes et aux filles.',
  updated_at = now()
WHERE slug = 'lutte-violences-genre';

-- ============================================================
-- INSERT: 3 nouveaux programmes urgences humanitaires
-- ============================================================
INSERT INTO programs (title, slug, description, long_description, icon, color, "order") VALUES
(
  'Préparation et réponse aux urgences sanitaires',
  'urgences-sanitaires',
  'Préparer et répondre aux épidémies et pandémies affectant les communautés vulnérables.',
  'Ce programme renforce la capacité de préparation et de réponse rapide aux urgences sanitaires incluant les épidémies (Ebola, choléra, rougeole, mpox) et pandémies. Il inclut la surveillance épidémiologique, la vaccination d''urgence, la gestion des cas, et la communication des risques auprès des communautés.',
  'activity',
  'red',
  8
),
(
  'Renforcement des capacités du système de santé',
  'renforcement-systeme-sante',
  'Renforcer les structures de santé et former le personnel médical dans les zones de crise.',
  'Ce programme accompagne le renforcement du système de santé par la formation des agents de santé, la réhabilitation des structures sanitaires, l''approvisionnement en médicaments essentiels et l''amélioration de la chaîne de froid. Il soutient aussi la supervision et le mentorat des personnels de santé communautaires.',
  'stethoscope',
  'teal',
  9
),
(
  'Humanisation des soins',
  'humanisation-soins',
  'Promouvoir une approche centrée sur la dignité humaine dans la dispensation des soins de santé.',
  'Ce programme œuvre pour l''humanisation des soins de santé en favorisant le respect de la dignité des patients, l''écoute active, la confidentialité et le soutien psychosocial. Il forme les soignants aux approches centrées sur la personne et au respect des droits des patients, notamment les survivantes de violences.',
  'hand-heart',
  'purple',
  10
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INSERT: Projets supplémentaires (total 10)
-- ============================================================
INSERT INTO projects (program_id, title, slug, description, location, status, start_date, end_date, beneficiaries, image_url) VALUES
(
  (SELECT id FROM programs WHERE slug = 'lutte-violences-genre'),
  'Centre d''écoute et de soutien VBG à Kinshasa',
  'centre-ecoute-vbg-kinshasa',
  'Création d''un centre d''écoute, d''accompagnement psychosocial et d''assistance juridique pour les survivantes de violences basées sur le genre.',
  'Kinshasa',
  'en_cours',
  '2023-03-01',
  '2025-12-31',
  1200,
  'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'wash'),
  'Accès à l''eau potable dans le Nord-Kivu',
  'eau-potable-nord-kivu',
  'Construction de 15 points d''eau et latrines dans les zones affectées par les déplacements au Nord-Kivu.',
  'Nord-Kivu',
  'en_cours',
  '2024-02-01',
  '2026-01-31',
  8000,
  'https://images.pexels.com/photos/2451567/pexels-photo-2451567.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'autonomisation-economique'),
  'Jardins potagers communautaires à Ituri',
  'jardins-potagers-ituri',
  'Promotion de l''agriculture maraîchère et sécurité alimentaire pour 300 femmes déplacées en Ituri.',
  'Ituri',
  'en_cours',
  '2024-05-01',
  '2025-10-31',
  300,
  'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'urgences-sanitaires'),
  'Réponse à l''épidémie de mpox au Kivu',
  'reponse-epidemie-mpox-kivu',
  'Intervention d''urgence sanitaire pour la surveillance, la vaccination et la prise en charge du mpox au Sud-Kivu.',
  'Sud-Kivu',
  'en_cours',
  '2024-08-01',
  '2025-07-31',
  15000,
  'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'sante-maternelle-infantile'),
  'Maternités sécurisées en Tshopo',
  'maternites-securisees-tshopo',
  'Réhabilitation de 4 maternités et formation de sages-femmes pour réduire la mortalité maternelle en Tshopo.',
  'Tshopo',
  'en_cours',
  '2023-10-01',
  '2025-09-30',
  3500,
  'https://images.pexels.com/photos/7108344/pexels-photo-7108344.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'education-alphabetisation'),
  'École pour filles déplacées à Goma',
  'ecole-filles-deplacees-goma',
  'Création d''espaces temporaires d''apprentissage pour 400 filles déplacées à Goma.',
  'Goma, Nord-Kivu',
  'termine',
  '2022-01-15',
  '2024-06-30',
  400,
  'https://images.pexels.com/photos/8197543/pexels-photo-8197543.jpeg'
),
(
  (SELECT id FROM programs WHERE slug = 'reponse-humanitaire'),
  'Assistance d''urgence aux déplacés de Tanganyika',
  'assistance-urgence-tanganyika',
  'Distribution de kits alimentaires, d''hygiène et de protection aux familles déplacées par les conflits au Tanganyika.',
  'Tanganyika',
  'futur',
  '2026-03-01',
  '2026-12-31',
  6000,
  NULL
)
ON CONFLICT (slug) DO NOTHING;
