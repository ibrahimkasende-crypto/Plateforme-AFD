-- Vérifier que les projets de présentation existent (alimente statut / secteur / carte).
-- Si projets_total = 0, exécuter docs/sql/force_seed_projets_presentation.sql
-- (plus fiable que le seed complet si des slugs programmes existent déjà).

SELECT count(*) AS projets_total,
       count(*) FILTER (WHERE coalesce(is_demo, false)) AS projets_demo,
       count(*) FILTER (WHERE coalesce(active, true)) AS projets_actifs
FROM public.projets;

SELECT location AS province, count(*) AS nb, coalesce(sum(beneficiaries), 0) AS beneficiaires
FROM public.projets
WHERE coalesce(active, true)
GROUP BY location
ORDER BY nb DESC;

SELECT coalesce(nullif(trim(secteur), ''), 'Non classé') AS secteur, count(*) AS nb
FROM public.projets
WHERE coalesce(active, true)
GROUP BY 1
ORDER BY nb DESC;

