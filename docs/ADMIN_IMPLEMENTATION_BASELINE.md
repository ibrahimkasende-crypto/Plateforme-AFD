# Baseline d’implémentation admin — Plateforme-AFD

**Date :** 2026-07-19  
**Vague :** 0 — Audit forensique  
**Branche :** `reconstruction-nextjs`  
**Chemin :** `D:\Plateforme-AFD\AFD`

---

## 1. Périmètre détecté

| Indicateur | Valeur | Preuve |
|------------|-------:|--------|
| Domaines de navigation | 9 | `src/config/admin-navigation.ts` |
| Points d’entrée sidebar | **55** | `adminSidebarItems` |
| Routes `page.tsx` admin | **174** | `src/app/admin/**/page.tsx` |
| Routes nav manquantes | **0** | audit Vague 0 |
| Features `src/features/*` | ~43 | inventaire |
| Queries `lib/queries/admin` | 30 | fichiers plats |
| Migrations SQL versionnées | 24 | `supabase/migrations/` |

Le chiffre historique « ~42 modules » est dépassé : la navigation Organisation inclut désormais les sous-modules RH/IAM.

---

## 2. Comptages de statut (matrice)

Source : [`MODULE_COMPLETION_MATRIX.json`](./MODULE_COMPLETION_MATRIX.json)

| Statut | Nombre |
|--------|-------:|
| `absent` | 0 |
| `maquette_seulement` | 4 |
| `partiel` | 35 |
| `fonctionnel_non_securise` | 0 |
| `fonctionnel_non_teste` | 13 |
| `operationnel` | **0** |
| `bloque_integration_externe` | 3 |

**Interprétation :**

- **0 module réellement opérationnel** selon les critères stricts (CRUD complet + RLS granulaire + tests auth + journal + pagination serveur + workflows).
- **0 placeholder UI** « Module en préparation » dans le code admin actif.
- **4 maquettes** : Stocks, Logistique, Exports, Santé système.
- **3 bloqués externes** : Newsletter (email), Dons (SerdiPay), Sauvegardes (API backups).

---

## 3. Validations techniques exécutées (Vague 0)

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | **OK** (`tsc --noEmit`) |
| `npm run test` | **OK** — 13 fichiers / 26 tests |
| `npm run lint` | 0 erreur (warnings préexistants hors scope) |
| `npm run build` | OK (session précédente) |
| `npx supabase migration list --linked` | Migrations locales listées ; suivi remote partiel via CLI |
| Placeholders admin | **0** occurrence active dans `src/app/admin` |

Tests E2E : présents ; exécution complète **dépend de** `AFD_E2E_ADMIN_EMAIL` / `AFD_E2E_ADMIN_PASSWORD` (souvent skipped).

---

## 4. Indicateurs de risque

| Risque | Estimation | Preuve |
|--------|------------|--------|
| Routes placeholder UI | **0** | grep + `admin-all-routes.spec.ts` |
| Tables sans RLS / policies incomplètes | **~30+** (IAM/RH/paie 050) + 3 tables RLS sans policy | `20260719_050_identity_hr_payroll.sql` |
| Policies `USING (true)` données internes | **≥10 tables** | `_admin_table_policies` dans `20260719_030` |
| Actions sans autorisation serveur | Non nul — inventaire exhaustif en Vague 1 | revue `requirePermission` / pages maquettes |
| Tests cassés unitaires | **0** | vitest 26/26 |
| Doublons schéma | `departements` (opportunités vs admin RH) | migrations 007 vs 030/050 |

---

## 5. Modules critiques à prioriser

### Maquettes / coquilles (priorité haute)

1. Stocks  
2. Logistique  
3. Exports (jobs)  
4. Santé système (observabilité)  

### Sécurité (Vague 1 obligatoire)

1. Remplacer RLS `USING (true)` migration 030  
2. Compléter RLS migration 050 (scopes, paie, contrats, présences, congés)  
3. Restreindre self-update `profils_administrateurs`  
4. Appliquer périmètres d’accès dans les policies métier  

### Intégrations externes (ne pas simuler)

1. Newsletter — provider email  
2. SerdiPay — credentials officiels  
3. Sauvegardes — statut réel Supabase  

---

## 6. Ordre recommandé d’implémentation

Conforme au plan d’exécution demandé :

| Vague | Contenu | Gate |
|------:|---------|------|
| **0** | Audit + matrice + baseline + tests anti-placeholder | ✅ ce document |
| **1** | Fondations Auth/RBAC/RLS/CRUD partagé/audit/jobs | Aucune élévation de privilège ; RLS testée |
| **2** | Opérations (Programmes → Logistique) | Chaîne Programme→Projet→Activité ; stocks cohérents |
| **3** | Suivi et impact | Agrégations ; consentements |
| **4** | Communication + Engagement | Publication publique ; docs privés |
| **5** | Organisation (RH, users, agents) | Invitations ; paie démo isolée |
| **6** | Finances | Totaux cohérents ; permissions strictes |
| **7** | Rapports / Documents / OCR / Exports | Jobs persistants ; rollback OCR |
| **8** | Administration | Monitoring réel ; pas de fausse sauvegarde |
| **9** | Intégration finale | Dashboard ; a11y ; perfs ; docs |

---

## 7. Doublons et collisions détectés

| Élément | Conflit | Action Vague 1+ |
|---------|---------|-----------------|
| `departements` | Table opportunités vs `hr_departements` / admin | Unifier référentiels |
| Journal | `journal_activite` + `audit_logs` | Fusion lecture déjà partielle ; unifier écriture |
| Équipe vs RH | Vitrine publique vs personnel | Conserver les deux avec rôles distincts |
| Transactions finances | Réutilise dons | Créer ledger dédié Vague 6 |

---

## 8. Plan de migrations (non destructif)

1. `20260719_051_rls_admin_modules_permissions.sql` — remplacer `USING (true)` 030 par `has_permission`  
2. `20260719_052_rls_hr_payroll_complete.sql` — RLS + policies tables 050 manquantes  
3. `20260719_053_stocks_logistics_foundations.sql` — tables stocks/logistique + RLS  
4. `20260719_054_background_jobs.sql` — file jobs persistante  
5. `20260719_055_shared_workflows.sql` — transitions d’état + approbations  
6. Régénérer types Supabase après chaque vague validée  

**Interdit :** `supabase db reset` ; modification destructive des migrations déjà appliquées.

---

## 9. Livrables Vague 0

| Fichier | Rôle |
|---------|------|
| `docs/MODULE_COMPLETION_MATRIX.md` | Matrice lisible |
| `docs/MODULE_COMPLETION_MATRIX.json` | Matrice machine |
| `docs/ADMIN_IMPLEMENTATION_BASELINE.md` | Ce rapport |
| `docs/IMPLEMENTATION_PROGRESS.md` | Suivi progressif |
| `docs/implementation-progress.json` | Suivi machine |
| `tests/e2e/admin-no-placeholder.spec.ts` | Garde anti-placeholder étendue |
| `scripts/generate-module-matrix-v0.mjs` | Régénération matrice |

---

## 10. Décision de sortie Vague 0

La Vague 0 est **terminée** lorsque :

- [x] 55 modules audités  
- [x] Matrice + baseline publiées  
- [x] typecheck / unit tests OK  
- [x] Risques RLS documentés  
- [x] Plan de migrations établi  
- [x] Test anti-placeholder créé/étendu  

**Prochaine étape :** Vague 1 — Fondations (RLS, CRUD partagé, audit, jobs, référentiels) — **sans** refonte visuelle préalable.
