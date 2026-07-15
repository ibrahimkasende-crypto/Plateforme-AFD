# Refonte V2 — Phase 4 : sécurisation Supabase

## Risques corrigés dans le dépôt

- Retrait des URL et clés anon codées en dur dans les scripts historiques.
- Désactivation de `migrate.mjs` et `diagnostic.mjs` au profit des migrations versionnées.
- Ajout de `.env.example` sans secret.
- Préparation de rôles, permissions, RLS, Storage privé/public et Edge Function serveur.

## Tables conservées et migrations créées

Les tables françaises existantes sont conservées. Les anciennes tables anglaises ne sont ni supprimées ni renommées automatiquement : leur état réel doit être vérifié avant une migration contrôlée.

- `20260715_001_security_foundations.sql`
- `20260715_002_rls_content_and_forms.sql`
- `20260715_003_storage_security.sql`

## Rôles et Storage

Rôles préparés : `super_admin`, `administrateur`, `editeur`, `communication`, `suivi_evaluation`, `finance_lecture`.

Buckets préparés : `gallery` (public, uniquement fichiers publiables) et `rapports-prives` (privé, lecture soumise aux permissions).

## Edge Function

`submit-contact` prépare une validation serveur, un honeypot et une insertion sans exposer de secret. Son déploiement, sa variable `APP_ORIGIN`, une limitation de fréquence et éventuellement Turnstile restent à configurer dans Supabase.

## Actions obligatoires dans Supabase

1. Révoquer ou vérifier les clés et projets référencés historiquement.
2. Sauvegarder base et Storage, puis tester les migrations en préproduction.
3. Inventorier les tables, colonnes, politiques et buckets réellement déployés.
4. Attribuer explicitement les rôles aux administrateurs après migration.
5. Déployer l’Edge Function avec les secrets serveur, jamais avec des variables `VITE_*`.
6. Migrer les formulaires React vers les Edge Functions avant production.

## Limites

Les migrations ne sont pas appliquées automatiquement par ce dépôt. Les écarts de schéma adhésions/dons/messages doivent être résolus sur une copie testée des données avant de durcir définitivement les insertions publiques.
