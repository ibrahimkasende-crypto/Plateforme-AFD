# Handover production — Plateforme-AFD

**Date :** 2026-07-19  
**Statut remis :** **PRODUCTION_BLOQUÉE** — pas de mise en ligne réussie

---

## Résumé exécutif

La plateforme Next.js (`D:\Plateforme-AFD\AFD`, branche `reconstruction-nextjs`) dispose d’un noyau **~7 modules opérationnels**, d’une CI naissante, d’une route `/api/health`, et d’intégrations externes **honnêtement bloquées** (newsletter, SerdiPay, OCR cloud).

Le déploiement est **bloqué** faute de : Hostinger connecté, domaine vérifié, variables prod, backup DB, et certification migrations/RLS/Storage sur le projet mandaté **`mxxuxnoqnwjygawvvhcb`**.

Écart critique historique : `.env` local vers **`ancien-projet-supabase`**.

---

## Inventaire documents release

| Document | Rôle |
|----------|------|
| `PRODUCTION_RELEASE_AUDIT.md` | État + GO/NO-GO + table modules |
| `PRODUCTION_RELEASE_FREEZE.md` | Gel fonctionnel |
| `PRODUCTION_SECRET_SCAN.md` | Secrets (sans valeurs) |
| `PRODUCTION_DATA_ISOLATION.md` | Isolation projets |
| `PRODUCTION_ENVIRONMENT_VARIABLES.md` | Table env |
| `PRODUCTION_BACKUP_RECORD.md` | Backup **PENDING** |
| `PRODUCTION_MIGRATION_REPORT.md` | Migrations + caution mismatch |
| `PRODUCTION_RLS_CERTIFICATION.md` | RLS / `afd_rls_audit_report` |
| `PRODUCTION_STORAGE_CERTIFICATION.md` | Storage checklist PENDING |
| `PRODUCTION_TEST_REPORT.md` | Placeholder tests |
| `PRODUCTION_PERFORMANCE_REPORT.md` | Baseline qualitative |
| `HOSTINGER_PRODUCTION_CONFIGURATION.md` | **NOT CONNECTED** |
| `PRODUCTION_DEPLOYMENT_REPORT.md` | **PRODUCTION_BLOQUÉE** |
| `PRODUCTION_ROLLBACK.md` | Rollback |
| `PRODUCTION_MONITORING_LOG.md` | Journal vide |
| `PRODUCTION_OBSERVABILITY_CHECK.md` | Observabilité |
| `PRODUCTION_HANDOVER.md` | Ce document |

---

## Remotes Git

| Remote | URL |
|--------|-----|
| `origin` | `https://github.com/Esmak24/Plateforme-ADF.git` |
| `plateforme` | `https://github.com/ibrahimkasende-crypto/Platefrome-AFD.git` |
| Brief attendu | `ibrahimkasende-crypto/Platefrome-ADF.git` (**écart de nom**) |

---

## Ce qui est prêt (local / code)

- Node `engines` `>=20 <=24`, `.nvmrc` = 24 ; local observé 24.15.0  
- CI `.github/workflows/ci.yml`  
- E2E opérationnel **11/11** (Chrome) — historique, à rejouer  
- Fail-closed : SerdiPay / newsletter / démo admin  
- Dernière migration fichier : `20260719_054_rls_audit_function.sql`

---

## Ce qui n’est pas prêt

- Hostinger / domaine live  
- Backup attesté  
- Certifications RLS / Storage / migrations **sur AFD**  
- ~25 modules `fonctionnel_non_teste`  
- Monitoring live  

---

## Prochaines actions (ordre suggéré)

1. Clarifier remote GitHub (`AFD` vs `ADF`).  
2. Backup `mxxuxnoqnwjygawvvhcb` → remplir `PRODUCTION_BACKUP_RECORD.md`.  
3. Auditer migrations remote ; corriger drift.  
4. Rejouer `test:rls` + E2E opérationnel.  
5. Connecter Hostinger + env (démo **false**).  
6. Vérifier `/api/health` + Auth redirects.  
7. Mettre à jour `PRODUCTION_DEPLOYMENT_REPORT.md` seulement avec des preuves réelles.

---

## Contacts (à compléter)

| Rôle | Nom | Contact |
|------|-----|---------|
| Product owner | | |
| Tech lead | | |
| Ops Hostinger / DNS | | |
| Admin Supabase AFD | | |

---

**Remise :** documentation honnête — **pas de PRODUCTION_RÉUSSIE**.

