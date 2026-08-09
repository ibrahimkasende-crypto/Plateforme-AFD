# Procédures de rollback — production

**Date :** 2026-07-19  
**Contexte :** aucun déploiement Hostinger attesté — procédures **préparatoires**

---

## Principes

1. Pas de rollback inventé : si rien n’est en prod, **rollback = ne pas déployer**.  
2. Toujours restaurer depuis un backup **attesté** (`PRODUCTION_BACKUP_RECORD.md`).  
3. Ne jamais « réparer » en poussant des seeds démo sur AFD.

---

## Scénario A — Avant premier déploiement

| Étape | Action |
|-------|--------|
| 1 | Conserver statut `PRODUCTION_BLOQUÉE` |
| 2 | Ne pas publier DNS / ne pas basculer domaine |
| 3 | Documenter dans `PRODUCTION_DEPLOYMENT_REPORT.md` |

---

## Scénario B — Après déploiement applicatif (Hostinger)

| Étape | Action |
|-------|--------|
| 1 | Noter commit SHA live (à remplir au deploy) |
| 2 | Redéployer le commit précédent connu stable **ou** désactiver l’app |
| 3 | Vérifier `/api/health` |
| 4 | Vérifier Auth redirect URLs Supabase |
| 5 | Annoncer incident / fin d’incident dans le log monitoring |

**Prérequis :** historique de builds Hostinger / tags Git. Aujourd’hui : **absent**.

---

## Scénario C — Régression schéma DB

| Étape | Action |
|-------|--------|
| 1 | **Stop** nouveaux `db push` |
| 2 | Restaurer dump attesté sur `mxxuxnoqnwjygawvvhcb` |
| 3 | Revalider `afd_rls_audit_report` + `test:rls` |
| 4 | Rejouer smoke E2E opérationnel |
| 5 | Mettre à jour `PRODUCTION_BACKUP_RECORD.md` / migration report |

Sans backup : **restauration impossible** — d’où le blocage actuel.

---

## Scénario D — Mauvaise cible projet (mismatch)

Si une opération a touché `ancien-projet-supabase` par erreur :

| Étape | Action |
|-------|--------|
| 1 | Arrêter immédiatement scripts / CLI |
| 2 | Ne pas « synchroniser » les deux projets à l’aveugle |
| 3 | Auditer AFD séparément |
| 4 | Traiter l’autre projet comme hors prod |

---

## Scénario E — Feature flags / intégrations

| Problème | Rollback config |
|----------|-----------------|
| Données démo visibles | `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false` + rebuild |
| Paiements instables | `SERDIPAY_ENABLED=false` |
| Newsletter spam / erreur | `NEWSLETTER_SEND_ENABLED=false` |
| OCR cloud coûteux | `OCR_CLOUD_ENABLED=false`, `OCR_PROVIDER=native` |

---

## Contacts / ownership

À renseigner dans `PRODUCTION_HANDOVER.md` (ops + DB + domaine).

**État :** procédures documentées — **non exercées en production** (rien de déployé).

