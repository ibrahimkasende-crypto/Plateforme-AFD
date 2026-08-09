# Audit de sécurité Supabase

Date : 15 juillet 2026. Ce document est fondé sur les fichiers versionnés ; l’état de l’instance Supabase connectée ne peut pas être confirmé sans inventaire authentifié.

## Schémas et risques constatés

- Tables historiques anglaises : `programs`, `projects`, `news`, `members`, `gallery`, `contacts`, `donations`, `team_members`, `partners`, `site_settings`.
- Tables françaises : `programmes`, `projets`, `actualites`, `membres`, `galerie`, `messages`, `dons`, `membres_equipe`, `partenaires`, `parametres_site`, `clusters`, `administrateurs`.
- Doublon structurel : migrations anglaises, renommage, puis script français autonome. Les colonnes des formulaires, de la galerie et des dons divergent.
- RLS est activée dans les migrations sur les tables connues, mais les politiques d’administration CRUD, de lecture des demandes et de Storage ne sont pas versionnées avant la phase 4.
- Aucun bucket ni politique Storage n’était défini dans les migrations.
- Aucune Edge Function versionnée n’existait.

## Appels frontend et exposition

- Le client React n’utilise que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, ce qui est correct sous RLS stricte.
- Les pages publiques insèrent directement dans `messages`, `membres` et `dons` ; elles doivent migrer vers des Edge Functions avant production avec anti-spam.
- Les CRUD admin dépendent d’autorisations serveur non vérifiables depuis ce dépôt.
- Aucun `dangerouslySetInnerHTML` n’a été détecté.
- `migrate.mjs` et `diagnostic.mjs` contenaient des URL et clés anon de projets différents. Ils sont maintenant désactivés et leurs valeurs retirées. Ces clés/projets doivent être révoqués ou vérifiés dans Supabase.

## Risques critiques

1. Plusieurs projets Supabase et plusieurs schémas peuvent coexister.
2. Les anciennes politiques de formulaires `WITH CHECK (true)` autorisent des insertions sans garde métier.
3. Les droits admin CRUD et Storage ne sont pas confirmés ni gouvernés par des rôles.
4. Les formulaires n’ont pas encore de validation serveur, limitation de fréquence ou CAPTCHA déployé.

## Risques moyens

- Incohérences colonnes : adhésions, dons, messages, catégories et images de programmes.
- Le bucket `gallery` est public par conception ; seuls les fichiers non sensibles doivent y être stockés.
- Les scripts historiques doivent rester désactivés.

## Migrations préparées — ne pas appliquer sans sauvegarde

1. `20260715_001_security_foundations.sql` : profils, rôles, permissions et fonctions RLS.
2. `20260715_002_rls_content_and_forms.sql` : RLS des contenus, administration et insertions publiques limitées.
3. `20260715_003_storage_security.sql` : buckets et politiques Storage.

Avant application : exporter le schéma, sauvegarder la base et Storage, tester sur un projet de préproduction, inventorier les politiques et vérifier les comptes admin existants.

