# Rapport final — premier déploiement VPS

Date : 2026-08-09  
Projet local : `D:\Plateforme-AFD\AFD`  
Dépôt cible : `https://github.com/ibrahimkasende-crypto/Plateforme-AFD`  
VPS : `afdrd7787@187.55.230.121`  
App : `/home/afd-rdc.org/apps/plateforme-afd`

## 1. Accès depuis Cursor

| Contrôle | Résultat |
|---|---|
| SSH `afdrd7787@187.55.230.121` depuis Cursor | **ÉCHEC** — `Permission denied (publickey,password)` |
| Clé SSH locale utilisable pour le VPS | **Absente** dans l’environnement agent |
| Déploiement remote exécuté par l’agent | **Non** (pas d’accès) |

Conséquence : le premier démarrage PM2 sur le VPS doit être lancé via **une seule commande** documentée dans `docs/VPS_ONE_COMMAND_FIRST_DEPLOY.md`.

## 2. Build local

| Étape | Résultat |
|---|---|
| `npm ci` | OK (session précédente / deps présentes) |
| `npm run typecheck` | OK |
| `npm run lint` | OK |
| `npm run test` | OK (67) |
| `npm run build:production` | OK (standalone + prepare) |
| Next.js | 16.2.10 |
| React | 19.2.4 |
| Node engines | `>=20 <=24` (VPS = 22.23.2) |
| `output: "standalone"` | Oui |

## 3. Artefacts préparés dans le dépôt

| Élément | Statut |
|---|---|
| `scripts/deploy-production.sh` | OK (repo `Plateforme-AFD`, sans arg, checks env owner/600) |
| `scripts/rollback-production.sh` | OK |
| `scripts/bootstrap-first-deploy.sh` | OK |
| `scripts/prepare-standalone.mjs` | OK |
| `ecosystem.config.cjs` | OK (700M, logs/, 127.0.0.1:3000) |
| `src/app/api/health` | OK |
| `.github/workflows/deploy-production.yml` | OK |
| `docs/CYBERPANEL_OPENLITESPEED_FINAL_SETUP.md` | OK |
| `docs/VPS_ONE_COMMAND_FIRST_DEPLOY.md` | OK |

## 4. Serveur (à remplir après la commande unique)

| Contrôle | Statut actuel |
|---|---|
| Build serveur | **En attente** (commande VPS) |
| SHA déployé | **En attente** |
| Chemin release | **En attente** (`releases/YYYYMMDD-HHMMSS-SHA`) |
| Lien `current` | Structure déjà créée côté VPS |
| PM2 online | **En attente** |
| `http://127.0.0.1:3000/api/health` | **En attente** |
| `https://afd-rdc.org/api/health` | **En attente** (après OLS) |
| Reverse proxy OLS | Doc finale prête — **action CyberPanel restante** |
| SSL | À forcer dans CyberPanel |
| GitHub Actions secrets | **À configurer** (`VPS_*`) |
| Rollback script | Présent dans le dépôt |

## 5. Action humaine restante (une seule)

1. SSH en `afdrd7787` puis coller la commande de `docs/VPS_ONE_COMMAND_FIRST_DEPLOY.md`.
2. Quand le health local est OK : appliquer `docs/CYBERPANEL_OPENLITESPEED_FINAL_SETUP.md` dans CyberPanel.
3. Ajouter les secrets GitHub Actions (`VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`, `VPS_APP_PATH`).

## 6. Sécurité

- Aucun secret demandé ni affiché.
- `.env.production` VPS : non lu / non affiché.
- Scan : pas de clé privée dans Git.
- ZIP : non requis.

## 7. Verdict

**Code & pipeline : PRÊTS.**  
**Déploiement runtime VPS depuis Cursor : BLOQUÉ (pas de clé SSH agent → VPS).**  
**Prochaine étape bloquante unique : exécuter la commande unique sur le VPS.**
