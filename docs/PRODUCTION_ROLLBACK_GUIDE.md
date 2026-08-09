# Guide rollback production

## Commande principale

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd   # AJUSTER
bash "$VPS_APP_PATH/repo/scripts/rollback-production.sh" previous
```

## Lister les releases

```bash
bash "$VPS_APP_PATH/repo/scripts/rollback-production.sh" list
```

## Rollback vers une release précise

```bash
bash "$VPS_APP_PATH/repo/scripts/rollback-production.sh" 20260809-101500
```

## Comportement

1. Mémorise `current`
2. Bascule le symlink vers la cible
3. `pm2 startOrReload`
4. Health `http://127.0.0.1:3000/api/health`
5. Si échec → restaure la cible initiale

## Rollback automatique

`scripts/deploy-production.sh` restaure déjà l’ancienne release si le health local ou public échoue après bascule.

## Ce qui n’est pas rollbacké

- Données Supabase
- `shared/.env.production` (sauf restauration manuelle depuis backup)
- DNS / emails / SSL
