# Déploiement automatique — guide quotidien

## Commandes Windows locales

```powershell
cd "D:\Plateforme-AFD\AFD"

git status
git checkout main
git pull origin main

# … modifications …

git add .
git commit -m "feat: description de la modification"
git push origin main
```

Le push sur `main` déclenche `.github/workflows/deploy-production.yml` :

1. `npm ci` + typecheck + lint + test + build
2. SSH vers le VPS
3. `scripts/deploy-production.sh <sha>`
4. Health public `https://afd-rdc.org/api/health`

## Déclenchement manuel (secours)

GitHub → **Actions** → **Deploy production** → **Run workflow**

Options :

- `ref` : SHA précis (sinon le commit du workflow)
- `skip_public_check` : si le proxy HTTPS n’est pas encore prêt

## Ce qui ne doit plus se faire

- Générer / uploader un ZIP Hostinger
- Construire directement dans la release en ligne
- Committer `.env.production`

## En cas d’échec Actions

1. Ouvrir les logs du job Validate / Deploy
2. Corriger en local
3. Ne pas forcer un déploiement cassé
4. Sur le VPS si besoin : `bash scripts/rollback-production.sh previous`
