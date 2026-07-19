# Rapport migrations — production

**Date :** 2026-07-19  
**Dernière migration fichier :** `20260719_054_rls_audit_function.sql`  
**Projet mandaté :** `ndkcywqihtnuoydwicrq` (ADF_BD)

---

## Avertissement critique

Le `.env` local pointait vers **`qsyvkaxlwxbhuphvctpl`** (Plateforme-AFD) alors que le projet mandaté est **`ndkcywqihtnuoydwicrq`**.

Conséquences :

| Risque | Impact |
|--------|--------|
| `supabase db push` / migrate sur mauvais projet | Schéma divergé ; preuves invalides |
| Historique `schema_migrations` | **Non fiable** sans audit sur ADF_BD |
| Timeout DB une fois (CLI lié au bon projet) | Impossible de confirmer l’état distant aujourd’hui |
| Seeds | Peuvent avoir pollué le mauvais projet |

**Ne pas affirmer que les migrations 050–054 sont appliquées en production** tant qu’un inventaire distant n’est pas produit.

---

## Inventaire local (fichiers)

Migrations récentes pertinentes (ordre nominal) :

| Fichier | Objet (résumé) |
|---------|----------------|
| `20260719_050_identity_hr_payroll.sql` | IAM / RH / paie + buckets RH |
| `20260719_051_secure_foundations.sql` | Durcissement RLS fondations |
| `20260719_052_operations_wave2.sql` | Opérations wave 2 |
| `20260719_053_waves_3_8_consolidation.sql` | Consolidation |
| `20260719_054_rls_audit_function.sql` | `afd_rls_audit_report()` |

Liste complète : `supabase/migrations/`.

---

## Historique `db push` — statut

| Élément | Statut |
|---------|--------|
| Push documenté vers ADF_BD | **Non attesté** |
| Push possible vers mauvais projet | **Risque élevé (historique)** |
| Drift schema local vs remote | **INCONNU** |
| Action requise | Audit `supabase migration list` / SQL distant **après** connect stable |

---

## Procédure recommandée (après backup)

1. Backup ADF_BD → `PRODUCTION_BACKUP_RECORD.md`.  
2. Lier CLI explicitement à `ndkcywqihtnuoydwicrq`.  
3. Comparer migrations locales vs remote.  
4. Appliquer **uniquement** les manquantes ; journaliser chaque étape.  
5. Rejouer `AFD_REQUIRE_RLS=1 npm run test:rls` contre ADF_BD.  
6. Mettre à jour ce rapport (dates, résultats — **sans inventer**).

---

## Verdict

**Migrations : NON CERTIFIÉES en production.**  
Release : **PRODUCTION_BLOQUÉE** côté schéma.
