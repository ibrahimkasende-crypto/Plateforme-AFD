-- ================================================================
-- SCRIPT COMPLET AFD — Projet : uazdlascrmkwhylwwqrx
-- Crée toutes les tables françaises + données initiales
-- À exécuter dans le SQL Editor de Supabase
-- URL : https://supabase.com/dashboard/project/uazdlascrmkwhylwwqrx/sql/new
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- TABLE : programmes
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programmes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL,
  icon text DEFAULT 'heart',
  color text DEFAULT 'sky',
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public programmes" ON programmes;
CREATE POLICY "Public programmes" ON programmes FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : projets
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programmes(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  status text DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine', 'futur')),
  start_date date NOT NULL,
  end_date date,
  budget numeric,
  beneficiaries integer,
  results text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public projets" ON projets;
CREATE POLICY "Public projets" ON projets FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : actualites
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actualites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  author text DEFAULT 'AFD',
  category text DEFAULT 'general',
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public actualites" ON actualites;
CREATE POLICY "Public actualites" ON actualites FOR SELECT USING (published = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : galerie
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS galerie (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_url text NOT NULL,
  thumbnail_url text,
  media_type text DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  category text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE galerie ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public galerie" ON galerie;
CREATE POLICY "Public galerie" ON galerie FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : parametres_site
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parametres_site (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE parametres_site ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public parametres_site" ON parametres_site;
CREATE POLICY "Public parametres_site" ON parametres_site FOR SELECT USING (true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : membres_equipe
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS membres_equipe (
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
ALTER TABLE membres_equipe ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public membres_equipe" ON membres_equipe;
CREATE POLICY "Public membres_equipe" ON membres_equipe FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : partenaires
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partenaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  category text DEFAULT 'international',
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public partenaires" ON partenaires;
CREATE POLICY "Public partenaires" ON partenaires FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : clusters
-- ────────────────────────────────────────────────────────────────
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
DROP POLICY IF EXISTS "Public clusters" ON clusters;
CREATE POLICY "Public clusters" ON clusters FOR SELECT USING (active = true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : membres (demandes d'adhésion)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS membres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  profession text,
  province text,
  motivation text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE membres ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insert membres" ON membres;
CREATE POLICY "Insert membres" ON membres FOR INSERT WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : dons
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  program_id uuid REFERENCES programmes(id) ON DELETE SET NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE dons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insert dons" ON dons;
CREATE POLICY "Insert dons" ON dons FOR INSERT WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : messages (contact)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insert messages" ON messages;
CREATE POLICY "Insert messages" ON messages FOR INSERT WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- TABLE : administrateurs
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS administrateurs (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  est_admin boolean DEFAULT true NOT NULL,
  date_creation timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE administrateurs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Self admin view" ON administrateurs;
CREATE POLICY "Self admin view" ON administrateurs FOR SELECT USING (auth.uid() = id);

-- ================================================================
-- DONNÉES INITIALES
-- ================================================================

-- Paramètres du site
INSERT INTO parametres_site (key, value) VALUES
  ('founded_year', '2019'),
  ('experience_years', '7'),
  ('active_projects', '10'),
  ('provinces_count', '12'),
  ('beneficiaries', '50000'),
  ('address', 'Kinshasa Songololo 145')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Programmes
INSERT INTO programmes (title, slug, description, long_description, icon, color, "order") VALUES
  ('Autonomisation économique', 'autonomisation-economique', 'Renforcer l''indépendance financière des femmes à travers la formation professionnelle et l''entrepreneuriat.', 'Ce programme vise à émanciper les femmes économiquement en leur offrant des formations professionnelles, un accès au micro-crédit et un accompagnement dans la création d''entreprises.', 'trending-up', 'sky', 1),
  ('Lutte contre les violences basées sur le genre (VBG/PSA/HS)', 'lutte-violences-genre', 'Prévenir et répondre aux violences sexuelles, psychosociales et basées sur le genre faites aux femmes et aux filles.', 'Ce programme coordonne la réponse aux VBG à travers des centres d''écoute, une assistance juridique et psychologique et des campagnes de sensibilisation communautaire.', 'shield', 'red', 2),
  ('Santé maternelle et infantile', 'sante-maternelle-infantile', 'Améliorer l''accès aux soins de santé pour les mères et les enfants.', 'Ce programme améliore la santé reproductive, maternelle et infantile via des cliniques mobiles, la formation des accoucheuses et la sensibilisation aux soins prénataux.', 'heart', 'pink', 3),
  ('Éducation et alphabétisation', 'education-alphabetisation', 'Promouvoir l''accès à l''éducation pour les femmes et les filles.', 'Ce programme soutient la scolarisation des filles, l''alphabétisation des femmes adultes et la formation des enseignants dans les zones reculées.', 'book-open', 'blue', 4),
  ('WASH - Eau, Hygiène et Assainissement', 'wash', 'Assurer l''accès à l''eau potable et aux installations sanitaires dans les communautés.', 'Ce programme construit des points d''eau, des latrines et forme les communautés aux bonnes pratiques d''hygiène pour réduire les maladies liées à l''eau.', 'droplet', 'cyan', 5),
  ('Réponse humanitaire d''urgence', 'reponse-humanitaire', 'Apporter une aide d''urgence aux populations déplacées et affectées par les conflits.', 'Ce programme assure une réponse rapide aux crises humanitaires à travers la distribution de kits d''urgence, d''abris et de nourriture aux populations déplacées.', 'alert-triangle', 'orange', 6),
  ('Plaidoyer et droits des femmes', 'plaidoyer-droits-femmes', 'Défendre les droits des femmes et influencer les politiques publiques.', 'Ce programme plaide pour l''adoption de lois protectrices des droits des femmes, la participation des femmes en politique et la lutte contre les discriminations de genre.', 'megaphone', 'green', 7),
  ('Préparation et réponse aux urgences sanitaires', 'urgences-sanitaires', 'Préparer et répondre aux épidémies et pandémies affectant les communautés vulnérables.', 'Ce programme renforce la capacité de réponse aux urgences sanitaires incluant les épidémies et pandémies.', 'activity', 'red', 8)
ON CONFLICT (slug) DO NOTHING;

-- Projets
INSERT INTO projets (program_id, title, slug, description, location, status, start_date, end_date, beneficiaries) VALUES
  ((SELECT id FROM programmes WHERE slug='autonomisation-economique'), 'Formation en entrepreneuriat féminin à Kinshasa', 'formation-entrepreneuriat-kinshasa', 'Formation de 200 femmes aux techniques entrepreneuriales et gestion financière.', 'Kinshasa', 'en_cours', '2024-01-15', '2025-12-31', 200),
  ((SELECT id FROM programmes WHERE slug='sante-maternelle-infantile'), 'Cliniques mobiles au Kasaï', 'cliniques-mobiles-kasai', 'Déploiement de cliniques mobiles pour les soins maternels et infantiles dans les zones reculées.', 'Kasaï Oriental', 'en_cours', '2023-06-01', '2025-05-31', 5000),
  ((SELECT id FROM programmes WHERE slug='education-alphabetisation'), 'Alphabétisation des femmes rurales au Maniema', 'alphabetisation-maniema', 'Programme d''alphabétisation pour les femmes de 18 à 45 ans en milieu rural au Maniema.', 'Maniema', 'en_cours', '2024-03-01', '2026-02-28', 350),
  ((SELECT id FROM programmes WHERE slug='wash'), 'Construction de puits et latrines au Nord-Kivu', 'puits-latrines-nord-kivu', 'Construction de 20 puits et 50 blocs de latrines dans les camps de déplacés du Nord-Kivu.', 'Nord-Kivu', 'en_cours', '2024-02-01', '2025-01-31', 8000),
  ((SELECT id FROM programmes WHERE slug='reponse-humanitaire'), 'Aide d''urgence aux déplacés de l''Ituri', 'aide-urgence-ituri', 'Distribution de kits alimentaires et d''hygiène à 3000 familles déplacées en Ituri.', 'Ituri', 'en_cours', '2024-07-01', '2025-06-30', 15000),
  ((SELECT id FROM programmes WHERE slug='lutte-violences-genre'), 'Centre d''écoute VBG à Kinshasa', 'centre-ecoute-vbg-kinshasa', 'Création d''un centre d''écoute et d''assistance juridique pour les survivantes de VBG.', 'Kinshasa', 'en_cours', '2023-03-01', '2025-12-31', 1200),
  ((SELECT id FROM programmes WHERE slug='wash'), 'Accès à l''eau potable au Sud-Kivu', 'eau-potable-sud-kivu', 'Installation de systèmes de captage d''eau de source pour 10 villages au Sud-Kivu.', 'Sud-Kivu', 'en_cours', '2024-05-01', '2026-04-30', 6500),
  ((SELECT id FROM programmes WHERE slug='sante-maternelle-infantile'), 'Maternités sécurisées en Tshopo', 'maternites-securisees-tshopo', 'Réhabilitation de 4 maternités et formation de sages-femmes pour réduire la mortalité maternelle.', 'Tshopo', 'en_cours', '2023-10-01', '2025-09-30', 3500),
  ((SELECT id FROM programmes WHERE slug='education-alphabetisation'), 'École pour filles déplacées à Goma', 'ecole-filles-deplacees-goma', 'Création d''espaces temporaires d''apprentissage pour 400 filles déplacées à Goma.', 'Goma, Nord-Kivu', 'termine', '2022-01-15', '2024-06-30', 400),
  ((SELECT id FROM programmes WHERE slug='autonomisation-economique'), 'Coopératives féminines au Tanganyika', 'cooperatives-feminines-tanganyika', 'Création et accompagnement de 10 coopératives féminines productrices de manioc et arachide.', 'Tanganyika', 'en_cours', '2024-09-01', '2026-08-31', 250)
ON CONFLICT (slug) DO NOTHING;

-- Membres de l'équipe
INSERT INTO membres_equipe (name, role, description, gender, "order") VALUES
  ('Marie Kabamba', 'Présidente', 'Leader visionnaire avec 20 ans d''expérience dans le développement communautaire et la défense des droits des femmes.', 'femme', 1),
  ('Jeanne Mukendi', 'Directrice Exécutive', 'Experte en gestion de projets humanitaires et développement durable en contexte de crise.', 'femme', 2),
  ('Grace Tshilombo', 'Coordinatrice des Programmes', 'Spécialiste en santé maternelle et infantile avec 12 ans d''expérience terrain.', 'femme', 3),
  ('Espérance Nsimba', 'Responsable Communication', 'Journaliste et militante pour les droits des femmes et l''égalité des genres.', 'femme', 4),
  ('Patience Kalala', 'Coordinatrice VBG/PSA/HS', 'Experte en protection et réponse aux violences basées sur le genre dans les zones de conflit.', 'femme', 5),
  ('Claudine Mwanza', 'Responsable Finances', 'Comptable certifiée avec expertise en gestion financière des ONG humanitaires.', 'femme', 6),
  ('Yvette Bolamba', 'Coordinatrice WASH', 'Ingénieure sanitaire spécialisée dans les projets eau, hygiène et assainissement.', 'femme', 7),
  ('Solange Luboya', 'Responsable Plaidoyer', 'Avocate engagée dans la défense des droits des femmes et des enfants en RDC.', 'femme', 8),
  ('Jean-Paul Lukusa', 'Responsable Logistique', 'Expert logistique avec expérience dans les opérations humanitaires en zones reculées.', 'homme', 9),
  ('Pierre Mbuyi', 'Responsable IT', 'Ingénieur informatique assurant la transformation numérique de l''organisation.', 'homme', 10)
ON CONFLICT DO NOTHING;

-- Partenaires
INSERT INTO partenaires (name, category, "order") VALUES
  ('UNICEF', 'international', 1),
  ('ONU Femmes', 'international', 2),
  ('USAID', 'international', 3),
  ('Union Européenne', 'international', 4),
  ('OMS', 'international', 5),
  ('UNHCR', 'international', 6),
  ('Gouvernement RDC', 'gouvernement', 7),
  ('Centre Carter', 'ong', 8),
  ('Expertise France', 'international', 9)
ON CONFLICT DO NOTHING;

-- Clusters et Groupes de Travail
INSERT INTO clusters (name, type, description, icon, "order") VALUES
  ('Cluster Protection', 'cluster', 'Coordination des interventions de protection des civils, des femmes et des enfants.', 'shield', 1),
  ('Cluster Santé', 'cluster', 'Coordination des services de santé d''urgence, y compris la santé reproductive.', 'heart-pulse', 2),
  ('Cluster Éducation', 'cluster', 'Coordination des activités d''éducation en situations d''urgence.', 'book-open', 3),
  ('Cluster WASH', 'cluster', 'Coordination des interventions eau, hygiène et assainissement.', 'droplet', 4),
  ('Cluster Nutrition', 'cluster', 'Coordination de la réponse nutritionnelle contre la malnutrition aiguë.', 'apple', 5),
  ('GT Santé Sexuelle et Reproductive (SSR)', 'working_group', 'Accès aux soins de santé sexuelle et reproductive en situation d''urgence.', 'activity', 6),
  ('GT Violences Basées sur le Genre (VBG)', 'working_group', 'Prévention et réponse aux violences basées sur le genre.', 'shield-alert', 7),
  ('GT Logistique', 'working_group', 'Coordination logistique pour la livraison de l''aide humanitaire.', 'truck', 8)
ON CONFLICT DO NOTHING;

-- Actualités
INSERT INTO actualites (title, slug, excerpt, content, category, published, published_at) VALUES
  ('L''AFD renforce ses actions contre les VBG dans l''Est du Congo', 'afd-actions-vbg-est-congo', 'L''AFD intensifie ses interventions de protection et d''assistance aux survivantes de violences basées sur le genre dans les provinces de l''Est.', 'Dans le cadre du cluster Protection, l''Alliance des Femmes pour le Développement (AFD) renforce ses équipes de réponse aux VBG dans les provinces du Nord-Kivu, Sud-Kivu et de l''Ituri, où les violences contre les femmes restent alarmantes en raison des conflits armés persistants.', 'programme', true, now() - interval '5 days'),
  ('Lancement du programme de formation entrepreneuriale à Kinshasa', 'lancement-formation-entrepreneuriale-kinshasa', 'Plus de 200 femmes bénéficient d''une formation intensive en entrepreneuriat et gestion financière dans la capitale.', 'L''Alliance des Femmes pour le Développement a officiellement lancé son nouveau programme de formation en entrepreneuriat féminin à Kinshasa. Ce programme, financé par l''Union Européenne, accompagnera 200 femmes sur 24 mois.', 'activite', true, now() - interval '15 days'),
  ('AFD participe au Forum Humanitaire de Genève', 'afd-forum-humanitaire-geneve', 'Une délégation de l''AFD représente la société civile congolaise au Forum Humanitaire Mondial de Genève.', 'La présidente de l''AFD, Marie Kabamba, a représenté l''organisation au Forum Humanitaire Mondial à Genève, plaidant pour un renforcement du financement de la réponse humanitaire en RDC.', 'partenariat', true, now() - interval '30 days')
ON CONFLICT (slug) DO NOTHING;

-- ================================================================
-- Vérification finale
-- ================================================================
SELECT 
  table_name,
  (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS nb_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
