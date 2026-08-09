# Déploiement automatique — GitHub → VPS

## Flux

```text
Cursor (Windows)
  → git push origin main
  → GitHub Actions (validate + SSH)
  → scripts/deploy-production.sh
  → release + PM2
  → OpenLiteSpeed → https://afd-rdc.org
```

Aucun ZIP.

## Prérequis

1. Premier déploiement manuel OK (`docs/FIRST_CYBERPANEL_DEPLOYMENT.md`)
2. Secrets GitHub Actions configurés
3. Dépôt **privé**
4. Proxy OLS opérationnel

## Commandes Windows (quotidien)

```bat
cd /d D:\Plateforme-AFD\AFD

git status
git add .
git commit -m "feat: description de la modification"
git push origin main
```

Le push sur `main` déclenche le workflow **Deploy production**.

## Déploiement manuel depuis GitHub

1. GitHub → **Actions**
2. Workflow **Deploy production**
3. **Run workflow**
4. Option : SHA précis / skip public health

## Secrets attendus

| Secret | Rôle |
|---|---|
| `VPS_HOST` | IP VPS |
| `VPS_PORT` | Port SSH (22) |
| `VPS_USER` | `afdrd7787` |
| `VPS_SSH_PRIVATE_KEY` | Clé privée Actions → VPS |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_DEPLOY_BRANCH` | `main` |
| `VPS_KNOWN_HOSTS` | optionnel mais recommandé |

Ne jamais y mettre le mot de passe CyberPanel.

## Commandes VPS utiles

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
pm2 status
pm2 logs plateforme-afd --lines 200
pm2 monit
curl -I http://127.0.0.1:3000
curl -I https://afd-rdc.org
curl -fsS https://afd-rdc.org/api/health
df -h
free -h
du -sh $VPS_APP_PATH/releases/*
bash $VPS_APP_PATH/repo/scripts/rollback-production.sh previous
```

## Rollback

Voir `docs/PRODUCTION_ROLLBACK_GUIDE.md`.
