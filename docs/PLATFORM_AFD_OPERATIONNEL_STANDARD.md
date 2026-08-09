# Standard `operationnel` — Plateforme-AFD

Un module est `operationnel` uniquement si **toutes** les preuves ci-dessous existent et sont vérifiables.

## Checklist obligatoire

1. Routes fonctionnelles (liste, détail, création, modification si applicable)
2. Table / vue Supabase + contraintes
3. Services serveur (pas de logique métier seule dans le client)
4. Schémas Zod / validation serveur
5. Permissions `requirePermission` côté serveur
6. RLS activée + politiques non permissives (`USING (true)` interdit)
7. Liste + recherche/filtres + états vide/erreur/chargement
8. Actions métier / workflow / archivage contrôlé
9. Journal d’audit sur mutations sensibles
10. Tests automatisés :
    - unitaires (règles métier)
    - RLS (`npm run test:rls`)
    - E2E accès autorisé + accès refusé (`npm run test:e2e:operationnel`)
11. Documentation / entrée matrice avec chemins de fichiers

## Commandes

```bash
npm run typecheck
npm run test:unit
npm run test:rls
npm run test:e2e:operationnel
```

Variables requises pour RLS / E2E complets :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AFD_E2E_ADMIN_EMAIL=
AFD_E2E_ADMIN_PASSWORD=
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010
# Optionnel si Chromium Playwright n’est pas installé :
PLAYWRIGHT_CHANNEL=chrome
```

Prérequis locaux : `npm run build` puis `npm run test:e2e:operationnel` (workers=1, suite admin en série).

## Preuve RLS centralisée

Fonction SQL : `public.afd_rls_audit_report()`  
Migration : `20260719_054_rls_audit_function.sql`  
Test : `tests/rls/rls-policy-enforcement.test.ts`

## Modules ciblés en priorité

- Stocks
- Finances (budgets / dépenses / transactions)
- Activités
- Urgences
- Logistique (demandes)

Voir `docs/MODULE_COMPLETION_MATRIX.json` champ `preuvesOperationnel`.

