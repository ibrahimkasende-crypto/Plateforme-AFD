-- Jeu de données de PRÉSENTATION pour le dashboard admin AFD.
-- demo_batch_id : afd-presentation-2024-2026
--
-- PRÉREQUIS : exécuter d'abord
--   supabase/migrations/20260719_021_dashboard_sector_province_fix.sql
--   (et idéalement 20260718_020_admin_dashboard_rpc.sql pour les tables dashboard)
--
-- ⚠️  NE PAS exécuter automatiquement en production.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables métier (schéma 20260224 + colonnes démo / secteur)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programmes (
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

CREATE TABLE IF NOT EXISTS public.projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programmes(id) ON DELETE SET NULL,
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

DO $$ BEGIN
  IF to_regclass('public.programmes') IS NOT NULL THEN
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS demo_batch_id text;
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS secteur text;
  END IF;
  IF to_regclass('public.projets') IS NOT NULL THEN
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS secteur text;
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
END $$;

DO $$ BEGIN
  IF to_regclass('public.dashboard_stats_mensuelles') IS NOT NULL THEN
    ALTER TABLE public.dashboard_stats_mensuelles ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.dashboard_stats_mensuelles ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
  IF to_regclass('public.dashboard_activites_mensuelles') IS NOT NULL THEN
    ALTER TABLE public.dashboard_activites_mensuelles ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.dashboard_activites_mensuelles ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
  IF to_regclass('public.dashboard_budget_mensuel') IS NOT NULL THEN
    ALTER TABLE public.dashboard_budget_mensuel ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.dashboard_budget_mensuel ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
  IF to_regclass('public.admin_alertes') IS NOT NULL THEN
    ALTER TABLE public.admin_alertes ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.admin_alertes ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
END $$;

DO $$
DECLARE
  v_batch text := 'afd-presentation-2024-2026';
  tbl text;
BEGIN
  IF to_regclass('public.dashboard_stats_mensuelles') IS NULL
     OR to_regclass('public.dashboard_activites_mensuelles') IS NULL
     OR to_regclass('public.dashboard_budget_mensuel') IS NULL
     OR to_regclass('public.admin_alertes') IS NULL
  THEN
    RAISE EXCEPTION
      'Tables dashboard absentes. Exécutez d''abord la migration 20260718_020_admin_dashboard_rpc.sql, puis 021, puis relancez ce seed.';
  END IF;

  -- Purge idempotente du lot
  DELETE FROM public.projets WHERE demo_batch_id = v_batch;
  DELETE FROM public.programmes WHERE demo_batch_id = v_batch;
  DELETE FROM public.dashboard_stats_mensuelles WHERE demo_batch_id = v_batch;
  DELETE FROM public.dashboard_activites_mensuelles WHERE demo_batch_id = v_batch;
  DELETE FROM public.dashboard_budget_mensuel WHERE demo_batch_id = v_batch;
  DELETE FROM public.admin_alertes WHERE demo_batch_id = v_batch;

  FOREACH tbl IN ARRAY ARRAY['messages', 'membres', 'dons', 'abonnes_newsletter']
  LOOP
    IF to_regclass(format('public.%I', tbl)) IS NOT NULL THEN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = tbl
          AND column_name = 'demo_batch_id'
      ) THEN
        EXECUTE format('DELETE FROM public.%I WHERE demo_batch_id = $1', tbl) USING v_batch;
      END IF;
    END IF;
  END LOOP;

  -- -------------------------------------------------------------------------
  -- 10 programmes (6 obligatoires + 4 optionnels) — upsert pour éviter
  -- l'échec sur slug déjà présent (cause fréquente de projets_total = 0).
  -- -------------------------------------------------------------------------
  INSERT INTO public.programmes (
    title, slug, description, long_description, icon, color, "order",
    secteur, is_demo, demo_batch_id, active
  )
  VALUES
    (
      'Santé, nutrition et WASH',
      'demo-pres-sante-nutrition-wash',
      'Accès aux soins, nutrition et eau potable.',
      'Programme intégré santé maternelle, nutrition communautaire et infrastructures WASH.',
      'heart-pulse', 'rose', 1,
      'Santé, nutrition et WASH', true, v_batch, true
    ),
    (
      'Protection, VBG et droits des femmes',
      'demo-pres-protection-vbg',
      'Protection, prévention VBG et droits des femmes.',
      'Accompagnement des survivantes, espaces sûrs et plaidoyer pour les droits des femmes.',
      'shield', 'violet', 2,
      'Protection, VBG et droits des femmes', true, v_batch, true
    ),
    (
      'Autonomisation économique',
      'demo-pres-autonomisation-economique',
      'Revenus, épargne et activités génératrices.',
      'Formation professionnelle, microcrédit et insertion économique des ménages vulnérables.',
      'briefcase', 'amber', 3,
      'Autonomisation économique', true, v_batch, true
    ),
    (
      'Éducation et leadership',
      'demo-pres-education-leadership',
      'Scolarisation, alphabétisation et leadership.',
      'Soutien scolaire, clubs de jeunes et renforcement du leadership communautaire.',
      'graduation-cap', 'sky', 4,
      'Éducation et leadership', true, v_batch, true
    ),
    (
      'Sécurité alimentaire et agriculture',
      'demo-pres-securite-alimentaire',
      'Production agricole et résilience alimentaire.',
      'Appui aux producteurs, semences améliorées et diversification des cultures.',
      'wheat', 'green', 5,
      'Sécurité alimentaire et agriculture', true, v_batch, true
    ),
    (
      'Urgences, relèvement et cohésion sociale',
      'demo-pres-urgences-relevement',
      'Réponse humanitaire et cohésion communautaire.',
      'Assistance d''urgence, relèvement rapide et dialogues intercommunautaires.',
      'life-buoy', 'orange', 6,
      'Urgences, relèvement et cohésion sociale', true, v_batch, true
    ),
    (
      'Gouvernance locale et redevabilité',
      'demo-pres-gouvernance-locale',
      'Renforcement des capacités des acteurs locaux.',
      'Formation des leaders locaux et mécanismes de redevabilité communautaire.',
      'landmark', 'slate', 7,
      'Gouvernance locale et redevabilité', true, v_batch, true
    ),
    (
      'Environnement et résilience climatique',
      'demo-pres-environnement-climat',
      'Adaptation climatique et gestion durable.',
      'Reboisement, gestion des déchets et sensibilisation aux risques climatiques.',
      'leaf', 'emerald', 8,
      'Environnement et résilience climatique', true, v_batch, true
    ),
    (
      'Infrastructure communautaire',
      'demo-pres-infrastructure-communautaire',
      'Infrastructures de base pour les communautés.',
      'Réhabilitation d''écoles, centres de santé et points d''eau communautaires.',
      'building', 'blue', 9,
      'Infrastructure communautaire', true, v_batch, true
    ),
    (
      'Renforcement institutionnel',
      'demo-pres-renforcement-institutionnel',
      'Capacités des organisations partenaires.',
      'Coaching MEAL, planification stratégique et systèmes de gestion.',
      'network', 'indigo', 10,
      'Renforcement institutionnel', true, v_batch, true
    )
  ON CONFLICT (slug) DO UPDATE SET
    secteur = EXCLUDED.secteur,
    is_demo = true,
    demo_batch_id = EXCLUDED.demo_batch_id,
    active = true,
    updated_at = now();

  -- -------------------------------------------------------------------------
  -- 30 projets — 6 secteurs × répartition 8 provinces
  -- Bénéficiaires cibles par province (somme) :
  -- Kinshasa 420 | Kwilu 260 | Kwango 140 | Haut-Katanga 230 | Ituri 310
  -- Tshopo 180 | Tshuapa 125 | Nord-Kivu 350
  -- -------------------------------------------------------------------------
  INSERT INTO public.projets (
    program_id, title, slug, description, location, status,
    start_date, end_date, budget, beneficiaries, secteur, is_demo, demo_batch_id, active
  )
  SELECT
    pr.id,
    p.title,
    p.slug,
    p.description,
    p.location,
    p.status,
    p.start_date::date,
    p.end_date::date,
    p.budget,
    p.beneficiaries,
    pr.secteur,
    true,
    v_batch,
    true
  FROM (
    VALUES
      ('demo-pres-sante-nutrition-wash', 'Centre nutritionnel Kinshasa', 'demo-pres-proj-kin-sante-01', 'Suivi nutritionnel des enfants <5 ans.', 'Kinshasa', 'en_cours', '2024-01-15', '2026-12-31', 85000, 110),
      ('demo-pres-protection-vbg', 'Espace sûr femmes Kinshasa', 'demo-pres-proj-kin-protection-02', 'Accompagnement psychosocial des survivantes VBG.', 'Kinshasa', 'en_cours', '2024-03-01', '2026-06-30', 62000, 105),
      ('demo-pres-autonomisation-economique', 'Coopérative couture Kinshasa', 'demo-pres-proj-kin-autonomisation-03', 'Formation couture et microcrédit.', 'Kinshasa', 'futur', '2025-09-01', '2027-03-31', 48000, 100),
      ('demo-pres-education-leadership', 'Clubs leadership jeunes Kinshasa', 'demo-pres-proj-kin-education-04', 'Leadership et citoyenneté active.', 'Kinshasa', 'termine', '2023-06-01', '2025-05-31', 35000, 105),

      ('demo-pres-securite-alimentaire', 'Champs maraîchers Kwilu', 'demo-pres-proj-kwilu-agri-01', 'Diversification cultures maraîchères.', 'Kwilu', 'en_cours', '2024-02-01', '2026-08-31', 72000, 65),
      ('demo-pres-sante-nutrition-wash', 'Points d''eau Kwilu', 'demo-pres-proj-kwilu-wash-02', 'Réhabilitation de 12 points d''eau.', 'Kwilu', 'en_cours', '2024-04-15', '2026-04-30', 95000, 70),
      ('demo-pres-urgences-relevement', 'Relèvement post-inondation Kwilu', 'demo-pres-proj-kwilu-urgence-03', 'Kits d''urgence et abris temporaires.', 'Kwilu', 'termine', '2023-11-01', '2025-02-28', 88000, 60),
      ('demo-pres-education-leadership', 'Alphabétisation adultes Kwilu', 'demo-pres-proj-kwilu-education-04', 'Classes d''alphabétisation fonctionnelle.', 'Kwilu', 'futur', '2025-10-01', '2027-06-30', 42000, 65),

      ('demo-pres-protection-vbg', 'Protection enfants Kwango', 'demo-pres-proj-kwango-protection-01', 'Mécanismes de signalement VBG.', 'Kwango', 'en_cours', '2024-05-01', '2026-05-31', 55000, 48),
      ('demo-pres-autonomisation-economique', 'AGR pisciculture Kwango', 'demo-pres-proj-kwango-agr-02', 'Étangs communautaires et formation.', 'Kwango', 'en_cours', '2024-07-01', '2026-07-31', 67000, 47),
      ('demo-pres-sante-nutrition-wash', 'Dépistage malnutrition Kwango', 'demo-pres-proj-kwango-sante-03', 'Dépistage et prise en charge SAM.', 'Kwango', 'futur', '2025-08-01', '2027-02-28', 39000, 45),

      ('demo-pres-education-leadership', 'Écoles relais Haut-Katanga', 'demo-pres-proj-hk-education-01', 'Réhabilitation de 8 écoles relais.', 'Haut-Katanga', 'en_cours', '2024-01-20', '2026-10-31', 78000, 58),
      ('demo-pres-securite-alimentaire', 'Semences améliorées Haut-Katanga', 'demo-pres-proj-hk-agri-02', 'Distribution semences résistantes.', 'Haut-Katanga', 'en_cours', '2024-06-01', '2026-06-30', 83000, 60),
      ('demo-pres-urgences-relevement', 'Cohésion intercommunautaire HK', 'demo-pres-proj-hk-cohesion-03', 'Dialogues communautaires et médiation.', 'Haut-Katanga', 'termine', '2023-09-01', '2025-08-31', 71000, 55),
      ('demo-pres-sante-nutrition-wash', 'Clinique mobile Haut-Katanga', 'demo-pres-proj-hk-sante-04', 'Consultations prénatales mobiles.', 'Haut-Katanga', 'futur', '2025-11-01', '2027-05-31', 64000, 57),

      ('demo-pres-protection-vbg', 'Unités d''écoute Ituri', 'demo-pres-proj-ituri-protection-01', 'Unités d''écoute et orientation juridique.', 'Ituri', 'en_cours', '2024-02-15', '2026-09-30', 92000, 80),
      ('demo-pres-urgences-relevement', 'Assistance déplacés Ituri', 'demo-pres-proj-ituri-urgence-02', 'NFI et sécurité alimentaire d''urgence.', 'Ituri', 'en_cours', '2024-03-10', '2026-03-31', 105000, 78),
      ('demo-pres-autonomisation-economique', 'Ateliers métiers Ituri', 'demo-pres-proj-ituri-agr-03', 'Formation menuiserie et maçonnerie.', 'Ituri', 'termine', '2023-07-01', '2025-06-30', 76000, 75),
      ('demo-pres-education-leadership', 'Éducation d''urgence Ituri', 'demo-pres-proj-ituri-education-04', 'Classes temporaires pour enfants déplacés.', 'Ituri', 'futur', '2025-09-15', '2027-01-31', 58000, 77),

      ('demo-pres-securite-alimentaire', 'Jardins scolaires Tshopo', 'demo-pres-proj-tshopo-agri-01', 'Cantines scolaires et jardins pédagogiques.', 'Tshopo', 'en_cours', '2024-04-01', '2026-04-30', 54000, 60),
      ('demo-pres-sante-nutrition-wash', 'Latrines écoles Tshopo', 'demo-pres-proj-tshopo-wash-02', 'Construction latrines dans 15 écoles.', 'Tshopo', 'en_cours', '2024-08-01', '2026-08-31', 47000, 58),
      ('demo-pres-protection-vbg', 'Sensibilisation VBG Tshopo', 'demo-pres-proj-tshopo-protection-03', 'Campagnes radio et clubs scolaires.', 'Tshopo', 'termine', '2023-10-01', '2025-09-30', 36000, 62),

      ('demo-pres-urgences-relevement', 'Retour volontaire Tshuapa', 'demo-pres-proj-tshuapa-relevement-01', 'Appui au retour et réinsertion.', 'Tshuapa', 'en_cours', '2024-05-15', '2026-05-15', 51000, 32),
      ('demo-pres-sante-nutrition-wash', 'Vaccination routine Tshuapa', 'demo-pres-proj-tshuapa-sante-02', 'Campagnes vaccination EPI.', 'Tshuapa', 'en_cours', '2024-09-01', '2026-09-30', 44000, 31),
      ('demo-pres-education-leadership', 'Bibliothèques communautaires Tshuapa', 'demo-pres-proj-tshuapa-education-03', 'Points lecture et tutorat.', 'Tshuapa', 'futur', '2025-07-01', '2027-03-31', 33000, 30),
      ('demo-pres-autonomisation-economique', 'Transformation manioc Tshuapa', 'demo-pres-proj-tshuapa-agr-04', 'Unités de transformation locale.', 'Tshuapa', 'termine', '2023-08-01', '2025-07-31', 49000, 32),

      ('demo-pres-protection-vbg', 'Centres transit Nord-Kivu', 'demo-pres-proj-nk-protection-01', 'Centres d''accueil temporaire.', 'Nord-Kivu', 'en_cours', '2024-01-10', '2026-12-31', 98000, 88),
      ('demo-pres-urgences-relevement', 'Cash transferts Nord-Kivu', 'demo-pres-proj-nk-urgence-02', 'Transferts monétaires d''urgence.', 'Nord-Kivu', 'en_cours', '2024-04-20', '2026-04-20', 112000, 90),
      ('demo-pres-securite-alimentaire', 'Terrasses agricoles Nord-Kivu', 'demo-pres-proj-nk-agri-03', 'Aménagement pentes et cultures.', 'Nord-Kivu', 'futur', '2025-10-15', '2027-08-31', 86000, 85),
      ('demo-pres-sante-nutrition-wash', 'Nutrition Nord-Kivu', 'demo-pres-proj-nk-sante-04', 'Programme nutrition communautaire.', 'Nord-Kivu', 'termine', '2023-05-01', '2025-04-30', 74000, 87)
  ) AS p(
    prog_slug, title, slug, description, location, status,
    start_date, end_date, budget, beneficiaries
  )
  JOIN public.programmes pr ON pr.slug = p.prog_slug
  ON CONFLICT (slug) DO UPDATE SET
    program_id = EXCLUDED.program_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    location = EXCLUDED.location,
    status = EXCLUDED.status,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    budget = EXCLUDED.budget,
    beneficiaries = EXCLUDED.beneficiaries,
    secteur = EXCLUDED.secteur,
    is_demo = true,
    demo_batch_id = EXCLUDED.demo_batch_id,
    active = true,
    updated_at = now();

  IF NOT EXISTS (
    SELECT 1 FROM public.projets WHERE demo_batch_id = v_batch LIMIT 1
  ) THEN
    RAISE EXCEPTION
      'Aucun projet de présentation créé après INSERT. Vérifiez la table public.projets et les slugs programmes.';
  END IF;

  -- -------------------------------------------------------------------------
  -- Stats mensuelles — 24 mois (2024-07 → 2026-06), 8 provinces, croissance
  -- -------------------------------------------------------------------------
  INSERT INTO public.dashboard_stats_mensuelles (
    mois, province, femmes, hommes, enfants, jeunes, total, is_demo, demo_batch_id
  )
  SELECT
    m.mois,
    p.province,
    round(p.target * m.factor * 0.55)::integer,
    round(p.target * m.factor * 0.22)::integer,
    round(p.target * m.factor * 0.14)::integer,
    round(p.target * m.factor * 0.09)::integer,
    round(p.target * m.factor)::integer,
    true,
    v_batch
  FROM (
    VALUES
      ('Kinshasa', 420),
      ('Kwilu', 260),
      ('Kwango', 140),
      ('Haut-Katanga', 230),
      ('Ituri', 310),
      ('Tshopo', 180),
      ('Tshuapa', 125),
      ('Nord-Kivu', 350)
  ) AS p(province, target)
  CROSS JOIN (
    SELECT
      (date '2024-07-01' + ((gs - 1) || ' months')::interval)::date AS mois,
      round((0.40 + (gs - 1) * 0.026)::numeric, 3) AS factor
    FROM generate_series(1, 24) AS gs
  ) AS m;

  -- -------------------------------------------------------------------------
  -- Activités mensuelles — 24 mois × 6 catégories
  -- -------------------------------------------------------------------------
  INSERT INTO public.dashboard_activites_mensuelles (
    mois, category, value, is_demo, demo_batch_id
  )
  SELECT
    m.mois,
    c.category,
    c.base + m.idx * 2,
    true,
    v_batch
  FROM (
    SELECT
      (date '2024-07-01' + ((gs - 1) || ' months')::interval)::date AS mois,
      gs AS idx
    FROM generate_series(1, 24) AS gs
  ) AS m
  CROSS JOIN (
    VALUES
      ('Formations', 12),
      ('Sensibilisations', 16),
      ('Distributions', 8),
      ('Réunions', 6),
      ('Missions', 3),
      ('Autres', 2)
  ) AS c(category, base);

  -- -------------------------------------------------------------------------
  -- Budget mensuel — 24 mois
  -- -------------------------------------------------------------------------
  INSERT INTO public.dashboard_budget_mensuel (
    mois, prevu, depense, currency, is_demo, demo_batch_id
  )
  SELECT
    (date '2024-07-01' + ((gs - 1) || ' months')::interval)::date,
    85000 + gs * 4500,
    72000 + gs * 4100,
    'USD',
    true,
    v_batch
  FROM generate_series(1, 24) AS gs;

  -- -------------------------------------------------------------------------
  -- 20 alertes admin
  -- -------------------------------------------------------------------------
  INSERT INTO public.admin_alertes (
    level, title, summary, href, is_read, is_demo, demo_batch_id, created_at
  )
  VALUES
    ('warning', 'Rapport trimestriel T3 2025 en attente', 'Le rapport MEAL T3 2025 est prêt pour validation direction.', '/admin/rapports', false, true, v_batch, now() - interval '1 day'),
    ('critical', 'Projet Ituri — activité faible', 'Aucune activité enregistrée depuis 28 jours sur le projet assistance déplacés.', '/admin/projets', false, true, v_batch, now() - interval '3 days'),
    ('info', 'Messages non traités', '15 messages de contact en attente de réponse.', '/admin/messages', false, true, v_batch, now() - interval '6 hours'),
    ('info', 'Adhésions en attente', '11 demandes d''adhésion nécessitent une décision.', '/admin/adhesions', false, true, v_batch, now() - interval '2 days'),
    ('warning', 'Budget programme santé', 'Le programme Santé, nutrition et WASH dépasse 91 % du budget prévu.', '/admin/finances', false, true, v_batch, now() - interval '5 days'),
    ('info', 'Newsletter planifiée', 'Campagne newsletter « Impact été 2026 » programmée demain.', '/admin/newsletter', true, true, v_batch, now() - interval '7 days'),
    ('critical', 'Indicateur MEAL manquant', 'Indicateur « femmes formées » non renseigné pour Tshopo.', '/admin/indicateurs', false, true, v_batch, now() - interval '4 days'),
    ('warning', 'Partenaire — logo absent', '3 partenaires actifs n''ont pas de logo validé.', '/admin/partenaires', false, true, v_batch, now() - interval '9 days'),
    ('info', 'Nouvelle intention de don', '5 intentions de don reçues cette semaine.', '/admin/dons/intentions', false, true, v_batch, now() - interval '10 hours'),
    ('warning', 'Actualité en brouillon', 'Deux actualités importantes restent en brouillon depuis 6 jours.', '/admin/actualites', false, true, v_batch, now() - interval '6 days'),
    ('info', 'Session formation MEAL', 'Session de formation MEAL planifiée le 25 juillet.', '/admin/formations', true, true, v_batch, now() - interval '12 days'),
    ('warning', 'Retard rapportage Kwango', 'Rapportage mensuel Kwango en retard de 5 jours.', '/admin/rapports', false, true, v_batch, now() - interval '5 days'),
    ('critical', 'Stock kits urgence bas', 'Stock kits urgence Ituri sous le seuil minimal.', '/admin/stocks', false, true, v_batch, now() - interval '2 days'),
    ('info', 'Nouveau partenaire technique', 'Convention de partenariat à valider avec ONG locale.', '/admin/partenaires', false, true, v_batch, now() - interval '8 days'),
    ('warning', 'Projet terminé sans clôture', 'Projet Alphabétisation Kwilu terminé sans rapport final.', '/admin/projets', false, true, v_batch, now() - interval '11 days'),
    ('info', 'Mise à jour cartographie', 'Cartographie interactive — 2 provinces mises à jour.', '/admin/cartographie', true, true, v_batch, now() - interval '14 days'),
    ('warning', 'Budget Tshuapa — écart', 'Écart prévu/réalisé supérieur à 12 % sur Tshuapa.', '/admin/finances', false, true, v_batch, now() - interval '3 days'),
    ('critical', 'Sécurité terrain Nord-Kivu', 'Mission Nord-Kivu reportée pour raisons sécuritaires.', '/admin/missions', false, true, v_batch, now() - interval '1 day'),
    ('info', 'Audit interne planifié', 'Audit interne Q3 programmé du 1er au 15 août.', '/admin/audit', true, true, v_batch, now() - interval '15 days'),
    ('warning', 'Données démo actives', 'Le tableau de bord affiche des données de présentation (lot afd-presentation-2024-2026).', '/admin', false, true, v_batch, now() - interval '30 minutes');

  -- -------------------------------------------------------------------------
  -- Métriques secondaires agrégées (sans PII)
  -- -------------------------------------------------------------------------
  CREATE TABLE IF NOT EXISTS public.dashboard_metric_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key text NOT NULL,
    metric_value integer NOT NULL DEFAULT 0,
    label text,
    href text,
    is_demo boolean NOT NULL DEFAULT false,
    demo_batch_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (metric_key, demo_batch_id)
  );

  DELETE FROM public.dashboard_metric_snapshots WHERE demo_batch_id = v_batch;

  INSERT INTO public.dashboard_metric_snapshots (
    metric_key, metric_value, label, href, is_demo, demo_batch_id
  ) VALUES
    ('documents_telecharges', 842, 'Documents téléchargés', '/admin/mediatheque', true, v_batch),
    ('rapports_generes', 126, 'Rapports générés', '/admin/rapports', true, v_batch),
    ('newsletter_abonnes', 1840, 'Abonnés newsletter', '/admin/newsletter/abonnes', true, v_batch),
    ('messages_pending', 42, 'Messages non traités', '/admin/messages', true, v_batch),
    ('adhesions_pending', 28, 'Adhésions en attente', '/admin/adhesions', true, v_batch),
    ('dons_intentions', 17, 'Intentions de dons', '/admin/dons/intentions', true, v_batch);

  -- Agrégats newsletter anonymes (email hash / placeholder non personnel)
  IF to_regclass('public.abonnes_newsletter') IS NOT NULL THEN
    BEGIN
      ALTER TABLE public.abonnes_newsletter ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
      ALTER TABLE public.abonnes_newsletter ADD COLUMN IF NOT EXISTS demo_batch_id text;
      DELETE FROM public.abonnes_newsletter WHERE demo_batch_id = v_batch;
      INSERT INTO public.abonnes_newsletter (email, statut, is_demo, demo_batch_id)
      SELECT
        'presentation+' || gs || '@example.afd.local',
        'actif',
        true,
        v_batch
      FROM generate_series(1, 1840) AS gs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'abonnes_newsletter non peuplée : %', SQLERRM;
    END;
  END IF;

  RAISE NOTICE 'Seed présentation terminé — lot %', v_batch;
  RAISE NOTICE 'Programmes : 10 | Projets : 30 | Stats mensuelles : 192 (24×8) | Activités : 144 (24×6) | Budget : 24 | Alertes : 20 | Métriques secondaires : 6';
END $$;
