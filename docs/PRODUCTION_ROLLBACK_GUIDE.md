# Rollback production

## Usage

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
cd "$VPS_APP_PATH/repo"

# Lister
bash scripts/rollback-production.sh list

# Revenir à la release précédente valide
bash scripts/rollback-production.sh previous

# Revenir à une stamp précise
bash scripts/rollback-production.sh 20260809-120000-abcdef123456
```

## Comportement

1. Identifie `current`
2. Choisit la cible
3. Bascule atomiquement le symlink
4. `pm2 startOrReload`
5. Teste `http://127.0.0.1:3000/api/health`
6. Si KO → restaure l’ancien `current`

## Notes

- Ne touche pas à `shared/.env.production`
- Ne touche pas aux DNS email
- Après rollback, corriger la cause puis redéployer via `git push origin main`
