-- ================================================================
-- Migration : Renommage des tables vers une nomenclature française
-- Projet    : Alliance des Femmes pour le Développement (AFD)
-- Date      : 2026-02-24
-- ================================================================
--
-- AVERTISSEMENT : Ce script renomme uniquement les tables.
--   ✔ Les données sont préservées intégralement
--   ✔ Les index sont automatiquement transférés
--   ✔ Les contraintes (clés étrangères, unicité) restent intactes
--   ✔ Les politiques RLS sont automatiquement héritées
--   ✔ La table "administrateurs" n'est PAS modifiée
--
-- PRÉREQUIS : Exécuter dans le SQL Editor de Supabase
-- ================================================================


-- ----------------------------------------------------------------
-- 1. programmes (anciennement : programs)
--    Table des domaines et axes d'intervention de l'AFD
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS programs RENAME TO programmes;

COMMENT ON TABLE programmes IS
  'Domaines et axes d''intervention de l''Alliance des Femmes pour le Développement';


-- ----------------------------------------------------------------
-- 2. projets (anciennement : projects)
--    Table des projets concrets liés à chaque programme
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS projects RENAME TO projets;

COMMENT ON TABLE projets IS
  'Projets terrain de l''AFD, rattachés à un programme et localisés dans une province';


-- ----------------------------------------------------------------
-- 3. actualites (anciennement : news)
--    Table des actualités et publications de l''organisation
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS news RENAME TO actualites;

COMMENT ON TABLE actualites IS
  'Actualités, communiqués et articles publiés par l''AFD';


-- ----------------------------------------------------------------
-- 4. galerie (anciennement : gallery)
--    Table des photos et médias de l''organisation
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS gallery RENAME TO galerie;

COMMENT ON TABLE galerie IS
  'Galerie photos et médias illustrant les activités de l''AFD';


-- ----------------------------------------------------------------
-- 5. messages (anciennement : contacts)
--    Table des messages reçus via le formulaire de contact
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS contacts RENAME TO messages;

COMMENT ON TABLE messages IS
  'Messages reçus via le formulaire de contact du site web de l''AFD';


-- ----------------------------------------------------------------
-- 6. membres_equipe (anciennement : team_members)
--    Table des membres de l''équipe de direction et du personnel
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS team_members RENAME TO membres_equipe;

COMMENT ON TABLE membres_equipe IS
  'Membres de l''équipe de direction et du personnel de l''AFD (majorité féminine)';


-- ----------------------------------------------------------------
-- 7. parametres_site (anciennement : site_settings)
--    Table des paramètres et réglages globaux du site web
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS site_settings RENAME TO parametres_site;

COMMENT ON TABLE parametres_site IS
  'Paramètres globaux du site web (année fondation, adresse, statistiques clés)';


-- ----------------------------------------------------------------
-- 8. partenaires (anciennement : partners)
--    Table des organisations partenaires de l''AFD
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS partners RENAME TO partenaires;

COMMENT ON TABLE partenaires IS
  'Organisations partenaires de l''AFD : agences ONU, gouvernements, ONG, bailleurs';


-- ----------------------------------------------------------------
-- 9. membres (anciennement : members)
--    Table des demandes d''adhésion à l''organisation
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS members RENAME TO membres;

COMMENT ON TABLE membres IS
  'Demandes d''adhésion soumises via le formulaire d''inscription au site web';


-- ----------------------------------------------------------------
-- 10. dons (anciennement : donations)
--     Table des dons et contributions financières reçues
-- ----------------------------------------------------------------
ALTER TABLE IF EXISTS donations RENAME TO dons;

COMMENT ON TABLE dons IS
  'Dons et contributions financières reçus via le formulaire de don du site web';


-- ================================================================
-- Vérification post-migration
-- Exécutez cette requête pour confirmer que toutes les tables
-- ont bien été renommées :
-- ================================================================
--
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_type = 'BASE TABLE'
-- ORDER BY table_name;
--
-- Résultat attendu (entre autres) :
--   actualites
--   administrateurs   ← non modifiée
--   clusters          ← non modifiée
--   dons
--   galerie
--   membres
--   membres_equipe
--   messages
--   parametres_site
--   partenaires
--   programmes
--   projets
-- ================================================================
