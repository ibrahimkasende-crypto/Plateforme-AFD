-- Force-seed PROJETS + PROGRAMMES de présentation (lot afd-presentation-2024-2026)
-- À exécuter dans Supabase SQL Editor si count(projets) = 0.
-- Idempotent : ON CONFLICT (slug) DO UPDATE.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Colonnes requises
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS demo_batch_id text;
ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS secteur text;
ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS demo_batch_id text;
ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS secteur text;

DO $$
DECLARE
  v_batch text := 'afd-presentation-2024-2026';
  v_prog_count integer;
  v_proj_count integer;
BEGIN
  -- Programmes (10)
  INSERT INTO public.programmes (
    title, slug, description, long_description, icon, color, "order",
    secteur, is_demo, demo_batch_id, active
  )
  VALUES
    ('Santé, nutrition et WASH', 'demo-pres-sante-nutrition-wash',
     'Accès aux soins, nutrition et eau potable.',
     'Programme intégré santé maternelle, nutrition communautaire et infrastructures WASH.',
     'heart-pulse', 'rose', 1, 'Santé, nutrition et WASH', true, v_batch, true),
    ('Protection, VBG et droits des femmes', 'demo-pres-protection-vbg',
     'Protection, prévention VBG et droits des femmes.',
     'Accompagnement des survivantes, espaces sûrs et plaidoyer pour les droits des femmes.',
     'shield', 'violet', 2, 'Protection, VBG et droits des femmes', true, v_batch, true),
    ('Autonomisation économique', 'demo-pres-autonomisation-economique',
     'Revenus, épargne et activités génératrices.',
     'Formation professionnelle, microcrédit et insertion économique des ménages vulnérables.',
     'briefcase', 'amber', 3, 'Autonomisation économique', true, v_batch, true),
    ('Éducation et leadership', 'demo-pres-education-leadership',
     'Scolarisation, alphabétisation et leadership.',
     'Soutien scolaire, clubs de jeunes et renforcement du leadership communautaire.',
     'graduation-cap', 'sky', 4, 'Éducation et leadership', true, v_batch, true),
    ('Sécurité alimentaire et agriculture', 'demo-pres-securite-alimentaire',
     'Production agricole et résilience alimentaire.',
     'Appui aux producteurs, semences améliorées et diversification des cultures.',
     'wheat', 'green', 5, 'Sécurité alimentaire et agriculture', true, v_batch, true),
    ('Urgences, relèvement et cohésion sociale', 'demo-pres-urgences-relevement',
     'Réponse humanitaire et cohésion communautaire.',
     'Assistance d''urgence, relèvement rapide et dialogues intercommunautaires.',
     'life-buoy', 'orange', 6, 'Urgences, relèvement et cohésion sociale', true, v_batch, true),
    ('Gouvernance locale et redevabilité', 'demo-pres-gouvernance-locale',
     'Renforcement des capacités des acteurs locaux.',
     'Formation des leaders locaux et mécanismes de redevabilité communautaire.',
     'landmark', 'slate', 7, 'Gouvernance locale et redevabilité', true, v_batch, true),
    ('Environnement et résilience climatique', 'demo-pres-environnement-climat',
     'Adaptation climatique et gestion durable.',
     'Reboisement, gestion des déchets et sensibilisation aux risques climatiques.',
     'leaf', 'emerald', 8, 'Environnement et résilience climatique', true, v_batch, true),
    ('Infrastructure communautaire', 'demo-pres-infrastructure-communautaire',
     'Infrastructures de base pour les communautés.',
     'Réhabilitation d''écoles, centres de santé et points d''eau communautaires.',
     'building', 'blue', 9, 'Infrastructure communautaire', true, v_batch, true),
    ('Renforcement institutionnel', 'demo-pres-renforcement-institutionnel',
     'Capacités des organisations partenaires.',
     'Coaching MEAL, planification stratégique et systèmes de gestion.',
     'network', 'indigo', 10, 'Renforcement institutionnel', true, v_batch, true)
  ON CONFLICT (slug) DO UPDATE SET
    secteur = EXCLUDED.secteur,
    is_demo = true,
    demo_batch_id = EXCLUDED.demo_batch_id,
    active = true,
    updated_at = now();

  GET DIAGNOSTICS v_prog_count = ROW_COUNT;
  RAISE NOTICE 'Programmes upsertés (lignes touchées): %', v_prog_count;

  -- Projets (30) — rattachement par slug programme
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
  JOIN public.programmes pr
    ON pr.slug = p.prog_slug
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

  GET DIAGNOSTICS v_proj_count = ROW_COUNT;
  RAISE NOTICE 'Projets upsertés (lignes touchées): %', v_proj_count;

  IF v_proj_count = 0 THEN
    RAISE EXCEPTION
      'Aucun projet inséré. Vérifiez que les 10 programmes demo-pres-* existent (JOIN slug échoué).';
  END IF;
END $$;

-- Vérification finale (doit afficher ~30 projets)
SELECT count(*) AS projets_total,
       count(*) FILTER (WHERE coalesce(is_demo, false)) AS projets_demo,
       count(*) FILTER (WHERE coalesce(active, true)) AS projets_actifs
FROM public.projets;

SELECT location AS province, count(*) AS nb
FROM public.projets
WHERE coalesce(active, true)
GROUP BY location
ORDER BY nb DESC;
