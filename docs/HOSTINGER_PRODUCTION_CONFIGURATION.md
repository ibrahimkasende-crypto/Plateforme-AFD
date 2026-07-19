# Configuration Hostinger — production

**Date :** 2026-07-19  
**Statut :** **NOT CONNECTED / BLOQUÉ**

---

## Constat dépôt

| Élément | Présent ? |
|---------|-----------|
| Fichier / dossier config Hostinger | **Non** |
| Dockerfile | **Non** |
| Scripts deploy Hostinger | **Non** |
| Secrets Hostinger dans le repo | **Non** (correct) |

Sans accès panneau Hostinger validé dans ce travail, **aucune connexion production n’est établie**.

---

## Prérequis manquants

| Prérequis | Statut |
|-----------|--------|
| Compte / plan Node Hostinger | INCONNU |
| Application Node liée au repo | **NOT CONNECTED** |
| Build command (`npm ci && npm run build`) | Non configuré ici |
| Start (`npm run start`) | Non configuré ici |
| Node 20–24 (`.nvmrc` = 24) | À forcer côté panel |
| Variables d’env (voir `PRODUCTION_ENVIRONMENT_VARIABLES.md`) | **Non posées** |
| Domaine `afd-rdc.org` | Candidat historique — **non vérifié** pour cette app |
| SSL / redirects Auth Supabase | PENDING |
| Health check moniteur → `/api/health` | PENDING |

---

## Blocage release

Tant que ce document reste `NOT CONNECTED` :

- Pas de déploiement attesté  
- Statut global : **PRODUCTION_BLOQUÉE**  
- Ne pas revendiquer une mise en ligne réussie

---

## Modèle à compléter après connexion

| Champ | Valeur |
|-------|--------|
| Date connexion | |
| Type hébergement (Node / VPS / autre) | |
| URL interne Hostinger | |
| URL publique | |
| Branche déployée | |
| Commit SHA | |
| Node version runtime | |
| Opérateur | |

**Verdict actuel :** **NOT CONNECTED**.
