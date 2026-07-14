/*
  # Create Alliance des Femmes pour le Développement (AFD) Database Schema

  ## Overview
  Complete database schema for the AFD humanitarian NGO website including programs, 
  projects, news, members, gallery, and contact messages.

  ## New Tables
  
  ### 1. programs
  Main intervention areas of the NGO
  - `id` (uuid, primary key)
  - `title` (text) - Program title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Short description
  - `long_description` (text) - Detailed description
  - `icon` (text) - Icon name from lucide-react
  - `color` (text) - Associated color (violet, green, etc.)
  - `order` (integer) - Display order
  - `active` (boolean) - Is program active
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. projects
  Specific projects under each program
  - `id` (uuid, primary key)
  - `program_id` (uuid, foreign key) - Associated program
  - `title` (text) - Project title
  - `slug` (text, unique)
  - `description` (text)
  - `location` (text) - Geographic area
  - `status` (text) - en_cours, termine, futur
  - `start_date` (date)
  - `end_date` (date, nullable)
  - `budget` (numeric, nullable)
  - `beneficiaries` (integer, nullable) - Number of beneficiaries
  - `results` (text, nullable) - Project results
  - `image_url` (text, nullable)
  - `active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. news
  News articles, press releases, events
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text, unique)
  - `excerpt` (text) - Short summary
  - `content` (text) - Full article content
  - `category` (text) - article, communique, evenement
  - `image_url` (text, nullable)
  - `published` (boolean)
  - `published_at` (timestamptz, nullable)
  - `author` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. members
  Membership applications
  - `id` (uuid, primary key)
  - `full_name` (text)
  - `gender` (text) - homme, femme, autre
  - `email` (text, unique)
  - `phone` (text)
  - `address` (text)
  - `motivation` (text)
  - `member_type` (text) - adherent, sympathisant
  - `status` (text) - pending, approved, rejected
  - `created_at` (timestamptz)
  
  ### 5. gallery
  Photos and videos from activities
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text, nullable)
  - `media_type` (text) - photo, video
  - `media_url` (text)
  - `thumbnail_url` (text, nullable)
  - `program_id` (uuid, foreign key, nullable)
  - `project_id` (uuid, foreign key, nullable)
  - `active` (boolean)
  - `created_at` (timestamptz)
  
  ### 6. contacts
  Contact form submissions
  - `id` (uuid, primary key)
  - `name` (text)
  - `email` (text)
  - `phone` (text, nullable)
  - `subject` (text)
  - `message` (text)
  - `status` (text) - new, read, replied
  - `created_at` (timestamptz)
  
  ### 7. donations
  Donation tracking (simulated)
  - `id` (uuid, primary key)
  - `donor_name` (text)
  - `donor_email` (text)
  - `donor_phone` (text, nullable)
  - `amount` (numeric)
  - `currency` (text) - USD, CDF
  - `payment_method` (text) - mobile_money, card
  - `status` (text) - pending, completed, failed
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for programs, projects, news, gallery (published items only)
  - Authenticated write access for contact forms, membership applications, donations
  - Admin-only access for data management
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text NOT NULL,
  icon text DEFAULT 'heart',
  color text DEFAULT 'violet',
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
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

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'article' CHECK (category IN ('article', 'communique', 'evenement')),
  image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  author text DEFAULT 'AFD Communications',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('homme', 'femme', 'autre')),
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  motivation text NOT NULL,
  member_type text DEFAULT 'adherent' CHECK (member_type IN ('adherent', 'sympathisant')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_type text DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  media_url text NOT NULL,
  thumbnail_url text,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD' CHECK (currency IN ('USD', 'CDF')),
  payment_method text NOT NULL CHECK (payment_method IN ('mobile_money', 'card')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for programs (public read, admin write)
CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT
  USING (active = true);

-- RLS Policies for projects (public read, admin write)
CREATE POLICY "Anyone can view active projects"
  ON projects FOR SELECT
  USING (active = true);

-- RLS Policies for news (public read published only)
CREATE POLICY "Anyone can view published news"
  ON news FOR SELECT
  USING (published = true);

-- RLS Policies for members (users can insert their own)
CREATE POLICY "Anyone can submit membership application"
  ON members FOR INSERT
  WITH CHECK (true);

-- RLS Policies for gallery (public read active items)
CREATE POLICY "Anyone can view active gallery items"
  ON gallery FOR SELECT
  USING (active = true);

-- RLS Policies for contacts (anyone can submit)
CREATE POLICY "Anyone can submit contact form"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- RLS Policies for donations (anyone can submit)
CREATE POLICY "Anyone can submit donation"
  ON donations FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);
CREATE INDEX IF NOT EXISTS idx_projects_program_id ON projects(program_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_gallery_program_id ON gallery(program_id);
CREATE INDEX IF NOT EXISTS idx_gallery_project_id ON gallery(project_id);

-- Insert initial programs data
INSERT INTO programs (title, slug, description, long_description, icon, color, "order") VALUES
('Autonomisation économique', 'autonomisation-economique', 'Renforcer l''indépendance financière des femmes à travers la formation professionnelle et l''entrepreneuriat.', 'Notre programme d''autonomisation économique vise à briser le cycle de la pauvreté en donnant aux femmes congolaises les outils et les compétences nécessaires pour créer et gérer leurs propres entreprises. Nous offrons des formations en gestion, comptabilité, marketing, et facilitons l''accès au microcrédit.', 'briefcase', 'violet', 1),
('Lutte contre les violences basées sur le genre', 'lutte-violences-genre', 'Prévenir et répondre aux violences faites aux femmes et aux filles.', 'Ce programme combat les violences sexuelles et basées sur le genre à travers la sensibilisation communautaire, le soutien psychosocial aux survivantes, l''assistance juridique, et le plaidoyer pour des lois plus protectrices. Nous travaillons avec les autorités locales et les leaders communautaires.', 'shield', 'red', 2),
('Santé maternelle et infantile', 'sante-maternelle-infantile', 'Améliorer l''accès aux soins de santé pour les mères et les enfants.', 'Nous œuvrons pour réduire la mortalité maternelle et infantile en facilitant l''accès aux services de santé reproductive, aux soins prénataux et postnataux, à la vaccination, et à la nutrition. Nous formons également des sages-femmes et des agents de santé communautaires.', 'heart-pulse', 'pink', 3),
('Éducation et alphabétisation', 'education-alphabetisation', 'Promouvoir l''éducation des filles et l''alphabétisation des femmes.', 'Notre programme éducatif se concentre sur la scolarisation et le maintien des filles à l''école, l''alphabétisation des femmes adultes, et la formation continue. Nous fournissons des fournitures scolaires, des bourses d''études, et créons des espaces d''apprentissage sûrs.', 'book-open', 'blue', 4),
('Eau, Hygiène et Assainissement (WASH)', 'wash', 'Garantir l''accès à l''eau potable et à l''assainissement.', 'Le programme WASH améliore les conditions de vie en construisant des points d''eau potable, des latrines, et en sensibilisant les communautés aux bonnes pratiques d''hygiène. Nous formons des comités de gestion de l''eau et promouvons le lavage des mains.', 'droplet', 'cyan', 5),
('Environnement et agriculture durable', 'environnement-agriculture', 'Promouvoir des pratiques agricoles respectueuses de l''environnement.', 'Ce programme soutient l''agriculture familiale durable, la protection de l''environnement, et la sécurité alimentaire. Nous formons aux techniques agroécologiques, à la gestion des ressources naturelles, et encourageons les jardins potagers communautaires.', 'sprout', 'green', 6),
('Réponse humanitaire', 'reponse-humanitaire', 'Apporter une assistance d''urgence aux populations en crise.', 'Notre programme de réponse humanitaire intervient lors de crises (conflits, déplacements, catastrophes naturelles) pour fournir une assistance d''urgence : distribution de vivres, kits d''hygiène, abris temporaires, soutien psychosocial, et protection des femmes et enfants vulnérables.', 'hand-heart', 'orange', 7);

-- Insert sample projects
INSERT INTO projects (program_id, title, slug, description, location, status, start_date, end_date, beneficiaries, image_url) VALUES
((SELECT id FROM programs WHERE slug = 'autonomisation-economique'), 'Coopératives de couture à Goma', 'cooperatives-couture-goma', 'Formation de 200 femmes aux métiers de la couture et création de 5 coopératives de production.', 'Goma, Nord-Kivu', 'en_cours', '2024-01-15', '2025-12-31', 200, 'https://images.pexels.com/photos/3905857/pexels-photo-3905857.jpeg'),
((SELECT id FROM programs WHERE slug = 'sante-maternelle-infantile'), 'Cliniques mobiles en milieu rural', 'cliniques-mobiles-rurales', 'Déploiement de 3 cliniques mobiles pour les soins prénataux dans les zones reculées.', 'Province du Kasaï', 'en_cours', '2023-06-01', '2026-05-31', 5000, 'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg'),
((SELECT id FROM programs WHERE slug = 'education-alphabetisation'), 'Alphabétisation des femmes à Kinshasa', 'alphabetisation-kinshasa', 'Programme d''alphabétisation pour 500 femmes dans les quartiers périphériques.', 'Kinshasa', 'termine', '2022-09-01', '2024-08-31', 500, 'https://images.pexels.com/photos/8197543/pexels-photo-8197543.jpeg');

-- Insert sample news
INSERT INTO news (title, slug, excerpt, content, category, published, published_at, image_url) VALUES
('Lancement du programme WASH à Bukavu', 'lancement-wash-bukavu', 'L''AFD lance un nouveau programme d''accès à l''eau potable pour 10 000 personnes.', 'Bukavu, 15 février 2026 - L''Alliance des Femmes pour le Développement (AFD) est fière d''annoncer le lancement de son nouveau programme WASH dans la ville de Bukavu. Ce projet ambitieux vise à fournir un accès à l''eau potable à plus de 10 000 personnes...', 'article', true, '2026-02-15', 'https://images.pexels.com/photos/2451567/pexels-photo-2451567.jpeg'),
('Journée internationale des femmes 2026', 'journee-femmes-2026', 'Célébration de la Journée internationale des droits des femmes avec nos bénéficiaires.', 'À l''occasion de la Journée internationale des droits des femmes, l''AFD organise une grande célébration réunissant plus de 500 femmes bénéficiaires de nos programmes...', 'evenement', true, '2026-03-08', 'https://images.pexels.com/photos/3184429/pexels-photo-3184429.jpeg');
