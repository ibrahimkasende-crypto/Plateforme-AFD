# Audit de release production — Plateforme-AFD

**Date :** 2026-07-19  
**Chemin :** `D:\Plateforme-AFD\AFD`  
**Branche de travail :** `reconstruction-nextjs` (≈45 commits d’avance sur `plateforme/main`)  
**Verdict initial :** **NO-GO** — statut attendu : `PRODUCTION_BLOQUÉE`

---

## Contexte Git / remotes

| Remote | URL observée | Note |
|--------|--------------|------|
| `origin` | `https://github.com/Esmak24/Plateforme-ADF.git` | Fork / dépôt de travail |
| `plateforme` | `https://github.com/ibrahimkasende-crypto/Platefrome-AFD.git` | Dépôt cible observé |
| Attendu (brief) | `ibrahimkasende-crypto/Platefrome-ADF.git` | **Écart de nom** (`AFD` vs `ADF`) — à clarifier avant push release |

Aucun Dockerfile. Aucune config Hostinger dans le dépôt. CI ajoutée : `.github/workflows/ci.yml`.

---

## Projet Supabase (critique)

| Élément | Valeur | Statut |
|---------|--------|--------|
| Projet mandaté | `ndkcywqihtnuoydwicrq` (ADF_BD) | Référence production |
| `.env` local (avant correction) | `qsyvkaxlwxbhuphvctpl` (Plateforme-AFD) | **ÉCART CRITIQUE** |
| CLI après correction | Lié à `ndkcywqihtnuoydwicrq` | OK |
| Connexion DB | Timeout observé une fois | Non fiable tant que non revalidé |

**Risque :** migrations / seeds / tests RLS ont pu cibler le mauvais projet. Toute preuve DB antérieure à la correction est suspecte.

---

## Environnement runtime

| Élément | Valeur |
|---------|--------|
| Node local | 24.15.0 |
| `engines` | `>=20 <=24` |
| `.nvmrc` | `24` |
| Domaine candidat | `https://afd-rdc.org` (historique — **non vérifié** comme hébergeur de cette app Next) |
| Health | Route `/api/health` créée (pas de preuve live prod) |

---

## Matrice modules (synthèse 2026-07-19)

| Statut | ≈ Nombre |
|--------|----------|
| `operationnel` | ~7 |
| `fonctionnel_non_teste` | ~25 |
| `bloque_integration_externe` | 3 (newsletter, SerdiPay, OCR cloud) |
| Autres (`partiel` / `absent` / maquette) | reste de la matrice (~47 entrées) |

Sources : `docs/MODULE_COMPLETION_MATRIX.md`, `src/config/operationnel-evidence.ts`.

### Table modules (extrait release)

| Module | Statut | Production | Blocage | Feature flag |
|--------|--------|------------|---------|--------------|
| Stocks | operationnel | GO conditionnel (après Hostinger+env+backup) | Hébergement / env prod non connectés | — |
| Logistique | operationnel | GO conditionnel | Idem | — |
| Activités | operationnel | GO conditionnel | Idem | — |
| Urgences | operationnel | GO conditionnel | Idem | — |
| Budgets | operationnel | GO conditionnel | Idem | — |
| Dépenses | operationnel | GO conditionnel | Idem | — |
| Transactions | operationnel | GO conditionnel | Idem | — |
| Newsletter (envoi) | bloque_integration_externe | NO-GO partiel | Provider e-mail absent → UI « Configuration requise » | `NEWSLETTER_SEND_ENABLED` |
| Dons / SerdiPay | bloque_integration_externe | NO-GO partiel | `SerdiPayNotConfiguredError` (pas de faux succès) | `SERDIPAY_ENABLED` |
| OCR cloud | bloque_integration_externe | NO-GO partiel | Providers cloud stubs / non configurés | `OCR_CLOUD_ENABLED` |
| Dashboard admin | fonctionnel_non_teste | NO-GO module | Preuves E2E dashboard incomplètes | `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false` **obligatoire** |
| RH / paie | fonctionnel_non_teste | NO-GO module | E2E skip / règles paie draft | — |
| Programmes / Projets | fonctionnel_non_teste | NO-GO module | Tests module incomplets | — |
| Sauvegardes admin | maquette_seulement | NO-GO | Aucune preuve de dump | — |
| Santé système (UI) | maquette_seulement | Partiel | `/api/health` existe ; hub admin non observabilité live | — |

---

## GO / NO-GO initial

| Critère | Résultat |
|---------|----------|
| Code sur branche release candidate | Partiel (ahead, non fusionné / non déployé) |
| Projet Supabase correct | Corrigé côté CLI — **historique douteux** |
| Backup DB vérifié | **PENDING** — aucun dump attesté |
| Hostinger + domaine | **NOT CONNECTED** |
| Variables prod | Non configurées sur hébergeur |
| Démo admin désactivée | Règle connue (`false`) — non vérifiée en prod |
| Intégrations externes | Bloquées honnêtement |
| Verdict | **NO-GO / PRODUCTION_BLOQUÉE** |

---

## Écarts majeurs

1. Mismatch Supabase local vs projet mandaté (critique).  
2. Écart de nom de dépôt GitHub (`Platefrome-AFD` vs `Platefrome-ADF`).  
3. Pas d’hébergement Hostinger dans le repo.  
4. Pas de backup production attesté.  
5. Domaine `afd-rdc.org` non prouvé pour cette app.  
6. ~25 modules fonctionnels non testés — hors périmètre « opérationnel ».  
7. CI présente mais job RLS conditionné aux secrets GitHub (peut être skip).

**Ne pas revendiquer `PRODUCTION_RÉUSSIE`.**
