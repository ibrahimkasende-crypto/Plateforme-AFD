# Gel fonctionnel — release production

**Date :** 2026-07-19  
**Branche :** `reconstruction-nextjs`  
**Statut gel :** **ACTIF** (préparation release — déploiement non autorisé)

---

## Objectif

Figer le périmètre fonctionnel tant que Hostinger, domaine, variables d’environnement, projet Supabase `ndkcywqihtnuoydwicrq` et backup ne sont pas validés.

---

## Inclus dans le gel (périmètre « opérationnel » connu)

| Module | Notes |
|--------|--------|
| Stocks | CRUD / mouvements / dispo — preuves locales |
| Logistique | Demandes / véhicules / missions |
| Activités | CRUD + RLS durcie (migrations 051+) |
| Urgences | CRUD + sitreps |
| Budgets / Dépenses / Transactions | Finances wave sécurisée |

E2E opérationnel : **11/11** passés précédemment (canal Chrome) — à rejouer après freeze sur le bon projet.

---

## Explicitement hors gel / non déployables comme « OK »

| Domaine | Raison |
|---------|--------|
| Newsletter envoi | `Configuration requise` sans `EMAIL_*` |
| SerdiPay / dons live | `SerdiPayNotConfiguredError` |
| OCR cloud | `OCR_CLOUD_ENABLED` / providers non prêts |
| Données démo admin | `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA` doit rester `false` |
| Seeds présentation / HR démo | Ne pas exécuter contre ADF_BD prod |
| Modules `fonctionnel_non_teste` / `partiel` | Pas de claim « production ready » |

---

## Règles pendant le gel

1. **Pas de nouvelles features** hors correctifs bloquants release.  
2. **Pas de `db push` / seed** tant que le projet cible n’est pas reconfirmé.  
3. **Pas de merge vers main production** sans checklist Hostinger + backup.  
4. Toute modification schema → nouvelle migration numérotée après `20260719_054_rls_audit_function.sql`.  
5. Documenter tout écart dans `PRODUCTION_DEPLOYMENT_REPORT.md`.

---

## Levée du gel (conditions)

- [ ] Backup DB attesté (`PRODUCTION_BACKUP_RECORD.md` ≠ PENDING)  
- [ ] Hostinger connecté + domaine vérifié  
- [ ] Env prod alignée sur `ndkcywqihtnuoydwicrq`  
- [ ] `/api/health` live = `ok`  
- [ ] Re-run tests (unit / RLS / E2E opérationnel) sur le bon projet  
- [ ] Signature GO écrite dans `PRODUCTION_DEPLOYMENT_REPORT.md`

Jusque-là : **PRODUCTION_BLOQUÉE**.
