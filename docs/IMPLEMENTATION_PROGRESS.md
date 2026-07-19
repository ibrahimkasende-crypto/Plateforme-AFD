# Progression d’implémentation — Plateforme-AFD

## Vague 0 — Audit forensique (2026-07-19)

### Travail effectué

- Inventaire des 55 points d’entrée navigation admin (9 domaines).
- Vérification présence des routes `page.tsx` (0 manquante).
- Recherche placeholders / stubs (`Module en préparation`, TODO, mockData, etc.).
- Audit Supabase : RLS, `USING (true)`, buckets, RPC, migration 050.
- Exécution `typecheck` + `vitest` (26/26).
- Production matrice de preuve + baseline.
- Test E2E anti-placeholder étendu (routes RH/IAM/OCR).

### Fichiers

- `docs/MODULE_COMPLETION_MATRIX.md`
- `docs/MODULE_COMPLETION_MATRIX.json`
- `docs/ADMIN_IMPLEMENTATION_BASELINE.md`
- `docs/IMPLEMENTATION_PROGRESS.md`
- `docs/implementation-progress.json`
- `tests/e2e/admin-no-placeholder.spec.ts`
- `scripts/generate-module-matrix-v0.mjs`

### Migrations

- Aucune nouvelle migration en Vague 0 (audit uniquement).
- Migrations existantes analysées : 24 fichiers, dont `20260719_050`.

### Permissions / RLS

- Documentées : risques 030 (`USING true`) et lacunes 050.
- Correction reportée à Vague 1.

### Tests

| Suite | Résultat |
|-------|----------|
| Unitaires | 26/26 OK |
| E2E anti-placeholder | Spec créée ; exécution auth dépend credentials |
| typecheck | OK |

### Problèmes ouverts

1. Aucun module `operationnel` selon critères stricts.
2. Stocks/Logistique/Exports/Système incomplets.
3. RLS granulaire insuffisante sur modules admin et RH étendus.
4. Intégrations email / SerdiPay / backups absentes.

### Prochaine étape

**Vague 1 — Fondations** : sécuriser RLS, consolider composants CRUD partagés, workflows, audit, notifications, jobs, référentiels.
