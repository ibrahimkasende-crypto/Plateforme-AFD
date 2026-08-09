# Certification RLS — production

**Date :** 2026-07-19  
**Fonction d’audit :** `public.afd_rls_audit_report()`  
**Migration :** `20260719_054_rls_audit_function.sql`  
**Suite :** `npm run test:rls` (`tests/rls/rls-policy-enforcement.test.ts`)

---

## Périmètre des tests (code)

| Test | Attendu |
|------|---------|
| RPC `afd_rls_audit_report` | `pass=true`, pas de table sans RLS, pas de politiques `USING true` permissives listées |
| Anon lecture | 0 lignes sur `stock_articles`, `finances_transactions`, `activites` |
| Anon écriture | Insert `stock_mouvements` échoue |

Activation stricte : `AFD_REQUIRE_RLS=1` (sinon skip si env manquante).

CI : job `rls` dans `.github/workflows/ci.yml` — **exécuté seulement si secrets GitHub présents**.

---

## Preuves locales documentées (matrice)

| Source | Résultat déclaré |
|--------|------------------|
| `MODULE_COMPLETION_MATRIX.md` | `AFD_REQUIRE_RLS=1 npm run test:rls` → 3/3 OK (contexte vague opérationnelle) |
| Modules opérationnels | stocks, logistique, activités, urgences, budgets, dépenses, transactions |

---

## Limites / non-certification prod

| Point | Statut |
|-------|--------|
| Projet cible des 3/3 | **Suspect** si exécuté avant correction vers `mxxuxnoqnwjygawvvhcb` |
| Certification live AFD | **PENDING** |
| Couverture toutes tables métier | Audit catalogue via RPC — **à rejouer** sur prod |
| RH / contenus / OCR | Policies présentes en migrations — **pas re-certifiées** ici pour prod |

---

## Checklist certification prod

- [ ] Env pointe vers `mxxuxnoqnwjygawvvhcb`  
- [ ] Migration `054` présente sur remote  
- [ ] `AFD_REQUIRE_RLS=1 npm run test:rls` → 3/3 sur ce projet  
- [ ] Export JSON/texte du rapport RPC archivé (sans secrets)  
- [ ] Date / opérateur notés ci-dessous  

| Champ | Valeur |
|-------|--------|
| Date run prod | **PENDING** |
| `pass` | **PENDING** |
| `rls_enabled_count` | **PENDING** |
| Opérateur | — |

---

## Verdict

**RLS : CERTIFIÉE EN LOCAL / CI CONDITIONNELLE — NON CERTIFIÉE PRODUCTION.**  
Ne pas marquer `PRODUCTION_RÉUSSIE` sur la base RLS seule.

