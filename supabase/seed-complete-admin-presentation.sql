-- Seed complet modules admin — lot afd-complete-admin-2026
-- PRÉREQUIS : migrations 021, 022, 030

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_batch text := 'afd-complete-admin-2026';
  v_prog uuid;
  v_projet uuid;
BEGIN
  -- Nettoyage lot
  DELETE FROM public.activites WHERE demo_batch_id = v_batch;
  DELETE FROM public.beneficiaires_agregats WHERE demo_batch_id = v_batch;
  DELETE FROM public.urgences WHERE demo_batch_id = v_batch;
  DELETE FROM public.newsletter_campagnes WHERE demo_batch_id = v_batch;
  DELETE FROM public.newsletter_modeles WHERE demo_batch_id = v_batch;
  DELETE FROM public.finances_budgets WHERE demo_batch_id = v_batch;
  DELETE FROM public.finances_depenses WHERE demo_batch_id = v_batch;
  DELETE FROM public.rapports_generes WHERE demo_batch_id = v_batch;
  DELETE FROM public.departements WHERE demo_batch_id = v_batch;
  DELETE FROM public.partenariats_demandes WHERE demo_batch_id = v_batch;

  IF to_regclass('public.messages') IS NOT NULL THEN
    DELETE FROM public.messages WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.membres') IS NOT NULL THEN
    DELETE FROM public.membres WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.dons') IS NOT NULL THEN
    DELETE FROM public.dons WHERE demo_batch_id = v_batch;
  END IF;
  IF to_regclass('public.clusters') IS NOT NULL THEN
    DELETE FROM public.clusters WHERE demo_batch_id = v_batch;
  END IF;

  SELECT id INTO v_prog FROM public.programmes WHERE is_demo = true LIMIT 1;
  SELECT id INTO v_projet FROM public.projets WHERE is_demo = true LIMIT 1;

  INSERT INTO public.activites (
    projet_id, programme_id, type, title, description, activity_date, province,
    femmes, hommes, enfants, jeunes, total, status, is_demo, demo_batch_id
  )
  SELECT
    v_projet,
    v_prog,
    (ARRAY['formation','sensibilisation','distribution','reunion','mission','autre'])[1 + (gs % 6)],
    'Activité présentation ' || gs,
    'Activité de présentation générée pour tests admin.',
    (date '2025-01-01' + ((gs - 1) || ' days')::interval)::date,
    (ARRAY['Kinshasa','Nord-Kivu','Ituri','Kwilu','Haut-Katanga','Tshopo','Kwango','Tshuapa'])[1 + (gs % 8)],
    20 + gs, 8 + gs, 12 + (gs % 5), 15 + (gs % 7),
    55 + gs * 2,
    CASE WHEN gs % 3 = 0 THEN 'realisee' ELSE 'planifiee' END,
    true,
    v_batch
  FROM generate_series(1, 40) AS gs;

  INSERT INTO public.beneficiaires_agregats (
    periode, programme_id, projet_id, province, femmes, hommes, enfants, jeunes, total, is_demo, demo_batch_id
  )
  SELECT
    (date '2024-07-01' + ((gs - 1) || ' months')::interval)::date,
    v_prog,
    v_projet,
    (ARRAY['Kinshasa','Nord-Kivu','Ituri','Kwilu','Haut-Katanga','Tshopo','Kwango','Tshuapa'])[1 + ((gs - 1) % 8)],
    80 + gs * 3, 40 + gs, 50 + gs, 60 + gs, 230 + gs * 5,
    true,
    v_batch
  FROM generate_series(1, 24) AS gs;

  INSERT INTO public.urgences (title, slug, summary, status, province, started_at, active, is_demo, demo_batch_id)
  VALUES
    ('Assistance déplacés Ituri', 'assistance-deplaces-ituri', 'Réponse humanitaire Ituri.', 'active', 'Ituri', now() - interval '40 days', true, true, v_batch),
    ('Relèvement Nord-Kivu', 'relevement-nord-kivu', 'Appui au relèvement communautaire.', 'active', 'Nord-Kivu', now() - interval '20 days', true, true, v_batch),
    ('Inondations Kwilu — clôturée', 'inondations-kwilu', 'Réponse inondations.', 'closed', 'Kwilu', now() - interval '120 days', true, true, v_batch);

  INSERT INTO public.newsletter_modeles (title, body, active, is_demo, demo_batch_id)
  VALUES
    ('Modèle impact mensuel', '<p>Bonjour, voici les actualités AFD du mois.</p>', true, true, v_batch),
    ('Modèle appel à solidarité', '<p>Soutenez les actions de l''AFD.</p>', true, true, v_batch);

  INSERT INTO public.newsletter_campagnes (title, subject, status, scheduled_at, is_demo, demo_batch_id)
  VALUES
    ('Campagne été 2026', 'Impact AFD — été 2026', 'brouillon', null, true, v_batch),
    ('Campagne formation', 'Formations femmes leaders', 'programmee', now() + interval '3 days', true, v_batch);

  INSERT INTO public.finances_budgets (
    label, programme_id, projet_id, period_start, period_end, amount_planned, currency, is_demo, demo_batch_id
  )
  VALUES
    ('Budget opérationnel 2025', v_prog, v_projet, '2025-01-01', '2025-12-31', 250000, 'USD', true, v_batch),
    ('Budget urgence Ituri', v_prog, v_projet, '2025-06-01', '2026-05-31', 80000, 'USD', true, v_batch);

  INSERT INTO public.finances_depenses (
    label, programme_id, projet_id, amount, spent_at, status, currency, is_demo, demo_batch_id
  )
  SELECT
    'Dépense présentation ' || gs,
    v_prog,
    v_projet,
    1200 + gs * 150,
    (date '2025-02-01' + ((gs - 1) || ' days')::interval)::date,
    CASE WHEN gs % 4 = 0 THEN 'validee' ELSE 'soumise' END,
    'USD',
    true,
    v_batch
  FROM generate_series(1, 18) AS gs;

  INSERT INTO public.rapports_generes (title, type, status, period_start, period_end, is_demo, demo_batch_id)
  VALUES
    ('Rapport trimestriel T1 2026', 'activite', 'brouillon', '2026-01-01', '2026-03-31', true, v_batch),
    ('Rapport d''impact 2025', 'impact', 'genere', '2025-01-01', '2025-12-31', true, v_batch),
    ('Rapport MEAL Nord-Kivu', 'meal', 'valide', '2025-07-01', '2025-12-31', true, v_batch);

  INSERT INTO public.departements (name, description, active, is_demo, demo_batch_id)
  VALUES
    ('Direction générale', 'Pilotage stratégique', true, true, v_batch),
    ('Programmes', 'Coordination opérationnelle', true, true, v_batch),
    ('MEAL', 'Suivi-évaluation', true, true, v_batch),
    ('Communication', 'Relations publiques', true, true, v_batch);

  INSERT INTO public.partenariats_demandes (organization_name, contact_email, message, status, is_demo, demo_batch_id)
  VALUES
    ('ONG Locale Espoir', 'contact@exemple.afd.local', 'Proposition de partenariat technique.', 'nouveau', true, v_batch),
    ('Fondation Solidarité', 'partnership@exemple.afd.local', 'Convention de financement à discuter.', 'en_traitement', true, v_batch);

  IF to_regclass('public.messages') IS NOT NULL THEN
    BEGIN
      INSERT INTO public.messages (name, email, subject, message, status, is_demo, demo_batch_id, created_at)
      SELECT
        'Contact présentation ' || gs,
        'contact' || gs || '@exemple.afd.local',
        'Demande information ' || gs,
        'Message de présentation sans données personnelles réelles.',
        CASE WHEN gs % 2 = 0 THEN 'unread' ELSE 'pending' END,
        true,
        v_batch,
        now() - (gs || ' hours')::interval
      FROM generate_series(1, 25) AS gs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'messages seed skip: %', SQLERRM;
    END;
  END IF;

  IF to_regclass('public.membres') IS NOT NULL THEN
    BEGIN
      INSERT INTO public.membres (full_name, email, status, is_demo, demo_batch_id, created_at)
      SELECT
        'Adhérent présentation ' || gs,
        'adherent' || gs || '@exemple.afd.local',
        CASE WHEN gs % 3 = 0 THEN 'approved' ELSE 'pending' END,
        true,
        v_batch,
        now() - (gs || ' days')::interval
      FROM generate_series(1, 20) AS gs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'membres seed skip: %', SQLERRM;
    END;
  END IF;

  IF to_regclass('public.dons') IS NOT NULL THEN
    BEGIN
      INSERT INTO public.dons (amount, currency, status, is_demo, demo_batch_id, created_at)
      SELECT
        50 + gs * 10,
        'USD',
        CASE WHEN gs % 2 = 0 THEN 'intention' ELSE 'pending' END,
        true,
        v_batch,
        now() - (gs || ' days')::interval
      FROM generate_series(1, 15) AS gs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'dons seed skip: %', SQLERRM;
    END;
  END IF;

  IF to_regclass('public.clusters') IS NOT NULL THEN
    BEGIN
      INSERT INTO public.clusters (name, slug, description, type, active, is_demo, demo_batch_id)
      VALUES
        ('Cluster Protection', 'cluster-protection', 'Coordination protection.', 'cluster', true, true, v_batch),
        ('Groupe WASH', 'groupe-wash', 'Working group WASH.', 'working_group', true, true, v_batch);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'clusters seed skip: %', SQLERRM;
    END;
  END IF;

  RAISE NOTICE 'Seed complet admin terminé — lot %', v_batch;
END $$;
