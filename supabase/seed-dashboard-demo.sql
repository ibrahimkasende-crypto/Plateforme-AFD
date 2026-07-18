-- Jeu de données de DÉMONSTRATION pour le dashboard admin AFD.
-- demo_batch_id : afd-dashboard-demo-2026-07
--
-- ⚠️  NE PAS exécuter automatiquement en production.
--     Réservé aux environnements de développement / recette manuelle.
--
-- PRÉREQUIS OBLIGATOIRE :
--   exécuter d'abord la migration
--   supabase/migrations/20260718_020_admin_dashboard_rpc.sql
--   (crée dashboard_stats_mensuelles, dashboard_activites_mensuelles,
--    dashboard_budget_mensuel, admin_alertes et la RPC get_admin_dashboard)

do $$
declare
  v_batch text := 'afd-dashboard-demo-2026-07';
begin
  if to_regclass('public.dashboard_stats_mensuelles') is null
     or to_regclass('public.dashboard_activites_mensuelles') is null
     or to_regclass('public.dashboard_budget_mensuel') is null
     or to_regclass('public.admin_alertes') is null
  then
    raise exception
      'Tables dashboard absentes. Exécutez d''abord la migration 20260718_020_admin_dashboard_rpc.sql, puis relancez ce seed.';
  end if;

  -- Purge idempotente du lot
  delete from public.dashboard_stats_mensuelles where demo_batch_id = v_batch;
  delete from public.dashboard_activites_mensuelles where demo_batch_id = v_batch;
  delete from public.dashboard_budget_mensuel where demo_batch_id = v_batch;
  delete from public.admin_alertes where demo_batch_id = v_batch;

  -- Bénéficiaires mensuels (6 mois) — cibles modérées par province (mois 6)
  -- Kinshasa 420 | Kwilu 260 | Kwango 140 | Haut-Katanga 230 | Ituri 310
  -- Tshopo 180 | Tshuapa 125 | Nord-Kivu 350  → total cible : 2 015
  insert into public.dashboard_stats_mensuelles (
    mois, province, femmes, hommes, enfants, jeunes, total, is_demo, demo_batch_id
  )
  select
    m.mois,
    p.province,
    round(p.target * m.factor * 0.55)::integer,
    round(p.target * m.factor * 0.22)::integer,
    round(p.target * m.factor * 0.14)::integer,
    round(p.target * m.factor * 0.09)::integer,
    round(p.target * m.factor)::integer,
    true,
    v_batch
  from (
    values
      ('Kinshasa', 420),
      ('Kwilu', 260),
      ('Kwango', 140),
      ('Haut-Katanga', 230),
      ('Ituri', 310),
      ('Tshopo', 180),
      ('Tshuapa', 125),
      ('Nord-Kivu', 350)
  ) as p(province, target)
  cross join (
    values
      ('2026-02-01'::date, 0.55),
      ('2026-03-01'::date, 0.65),
      ('2026-04-01'::date, 0.75),
      ('2026-05-01'::date, 0.85),
      ('2026-06-01'::date, 0.92),
      ('2026-07-01'::date, 1.00)
  ) as m(mois, factor);

  -- Activités mensuelles (6 mois × 6 catégories)
  insert into public.dashboard_activites_mensuelles (
    mois, category, value, is_demo, demo_batch_id
  )
  select
    m.mois,
    c.category,
    c.base + m.idx * 2,
    true,
    v_batch
  from (
    values
      ('2026-02-01'::date, 1),
      ('2026-03-01'::date, 2),
      ('2026-04-01'::date, 3),
      ('2026-05-01'::date, 4),
      ('2026-06-01'::date, 5),
      ('2026-07-01'::date, 6)
  ) as m(mois, idx)
  cross join (
    values
      ('Formations', 14),
      ('Sensibilisations', 18),
      ('Distributions', 9),
      ('Réunions', 7),
      ('Missions', 4),
      ('Autres', 3)
  ) as c(category, base);

  -- Budget mensuel (6 mois)
  insert into public.dashboard_budget_mensuel (
    mois, prevu, depense, currency, is_demo, demo_batch_id
  )
  values
    ('2026-02-01', 95000, 82000, 'USD', true, v_batch),
    ('2026-03-01', 105000, 91000, 'USD', true, v_batch),
    ('2026-04-01', 115000, 108000, 'USD', true, v_batch),
    ('2026-05-01', 125000, 118000, 'USD', true, v_batch),
    ('2026-06-01', 135000, 127000, 'USD', true, v_batch),
    ('2026-07-01', 145000, 132000, 'USD', true, v_batch);

  -- 10 alertes de démonstration
  insert into public.admin_alertes (
    level, title, summary, href, is_read, is_demo, demo_batch_id, created_at
  )
  values
    (
      'warning', 'Rapport trimestriel en attente',
      'Le rapport MEAL T2 2026 est prêt pour validation direction.',
      '/admin/rapports', false, true, v_batch, now() - interval '2 days'
    ),
    (
      'critical', 'Projet sans activité récente',
      'Projet Ituri — aucune activité enregistrée depuis 35 jours.',
      '/admin/projets', false, true, v_batch, now() - interval '5 days'
    ),
    (
      'info', 'Messages non traités',
      '12 messages de contact en attente de réponse.',
      '/admin/messages', false, true, v_batch, now() - interval '1 day'
    ),
    (
      'info', 'Adhésions en attente',
      '8 demandes d''adhésion nécessitent une décision.',
      '/admin/adhesions', false, true, v_batch, now() - interval '3 days'
    ),
    (
      'warning', 'Budget programme santé',
      'Le programme Santé maternelle dépasse 92 % du budget prévu.',
      '/admin/finances', false, true, v_batch, now() - interval '6 days'
    ),
    (
      'info', 'Newsletter planifiée',
      'Campagne newsletter « Impact juillet » programmée demain.',
      '/admin/newsletter', true, true, v_batch, now() - interval '8 days'
    ),
    (
      'critical', 'Indicateur MEAL manquant',
      'Indicateur « femmes formées » non renseigné pour Tshopo.',
      '/admin/indicateurs', false, true, v_batch, now() - interval '4 days'
    ),
    (
      'warning', 'Partenaire — logo absent',
      '2 partenaires actifs n''ont pas de logo validé.',
      '/admin/partenaires', false, true, v_batch, now() - interval '10 days'
    ),
    (
      'info', 'Nouvelle intention de don',
      '3 intentions de don reçues cette semaine.',
      '/admin/dons/intentions', false, true, v_batch, now() - interval '12 hours'
    ),
    (
      'warning', 'Actualité en brouillon',
      'Une actualité importante reste en brouillon depuis 7 jours.',
      '/admin/actualites', false, true, v_batch, now() - interval '7 days'
    );
end $$;
