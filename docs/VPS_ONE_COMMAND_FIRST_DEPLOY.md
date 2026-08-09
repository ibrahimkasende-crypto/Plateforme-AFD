# Première commande VPS (tout-en-un)

Cursor n’a **pas** de clé SSH vers `afdrd7787@187.55.230.121`.  
Exécutez **une seule** commande après connexion SSH :

```bash
ssh -p 22 afdrd7787@187.55.230.121
```

Puis collez **exactement** ceci :

```bash
set -Eeuo pipefail; APP=/home/afd-rdc.org/apps/plateforme-afd; REPO=git@github-afd:ibrahimkasende-crypto/Plateforme-AFD.git; test -f "$APP/shared/.env.production"; chmod 600 "$APP/shared/.env.production"; mkdir -p "$APP"/{releases,shared,logs,repo}; if [ ! -d "$APP/repo/.git" ]; then git clone "$REPO" "$APP/repo"; fi; cd "$APP/repo"; git remote set-url origin "$REPO"; git fetch --prune origin; git checkout main; git reset --hard origin/main; cp -f ecosystem.config.cjs "$APP/ecosystem.config.cjs"; export VPS_APP_PATH="$APP" VPS_REPO_SSH_URL="$REPO" VPS_DEPLOY_BRANCH=main SKIP_PUBLIC_CHECK=1 RUN_TYPECHECK=0 RUN_LINT=0 RUN_TEST=0; bash scripts/deploy-production.sh; pm2 save; pm2 status; curl -fsS http://127.0.0.1:3000/api/health; curl -I http://127.0.0.1:3000 | head -n 5
```

Attendu :

- `pm2 status` → `plateforme-afd` **online**
- health → `{"status":"ok",...}`

Ensuite : une action CyberPanel → suivre `docs/CYBERPANEL_OPENLITESPEED_FINAL_SETUP.md`.

Puis GitHub → Secrets Actions :

`VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`, `VPS_APP_PATH`
