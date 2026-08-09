# Premier déploiement CyberPanel (manuel, surveillé)

Domaine : **https://afd-rdc.org**  
VPS : **187.55.230.121**  
User app : **afdrd7787**  
App : `/home/afd-rdc.org/apps/plateforme-afd`

> Activer GitHub Actions **seulement après** réussite de cette procédure.  
> Aucun ZIP. Ne pas écrire dans `public_html` pour Next.js.

---

## 0. Prérequis

- [ ] Dépôt GitHub **privé** : `ibrahimkasende-crypto/Platefrome-AFD`
- [ ] Deploy Key lecture seule (voir `docs/VPS_GITHUB_DEPLOY_KEY.md`)
- [ ] Structure : `releases/`, `shared/`, `logs/`
- [ ] Node **v22.x**, npm, git, pm2, rsync
- [ ] Secrets GitHub Actions **pas encore obligatoires** pour ce premier run manuel

---

## 1. Deploy Key + test GitHub

```bash
sudo -u afdrd7787 -H ssh -T github-afd
```

---

## 2. Clone repo (une fois)

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
sudo -u afdrd7787 -H bash -lc '
  mkdir -p "$VPS_APP_PATH"/{releases,shared,logs,repo}
  if [ ! -d "$VPS_APP_PATH/repo/.git" ]; then
    git clone git@github-afd:ibrahimkasende-crypto/Platefrome-AFD.git "$VPS_APP_PATH/repo"
  fi
  cd "$VPS_APP_PATH/repo" && git checkout main && git pull
'
```

---

## 3. Fichier env (une fois)

```bash
sudo bash /home/afd-rdc.org/apps/plateforme-afd/repo/scripts/setup-production-env.sh
```

Renseigner au minimum :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou ANON)
- `SUPABASE_SERVICE_ROLE_KEY`
- `MAIL_SMTP_PASSWORD` (si emails activés)

Vérifier :

```bash
sudo -u afdrd7787 -H bash -lc '
  ls -l /home/afd-rdc.org/apps/plateforme-afd/shared/.env.production
  # attendu : -rw------- afdrd7787 afdrd7787
'
```

---

## 4. Ecosystem PM2

```bash
sudo -u afdrd7787 -H bash -lc '
  export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
  cp "$VPS_APP_PATH/repo/ecosystem.config.cjs" "$VPS_APP_PATH/ecosystem.config.cjs"
'
```

---

## 5. Premier deploy

```bash
sudo -u afdrd7787 -H bash -lc '
  export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
  export SKIP_PUBLIC_CHECK=1
  cd "$VPS_APP_PATH/repo"
  git fetch --prune origin
  git checkout main
  git pull --ff-only origin main
  bash scripts/deploy-production.sh "$(git rev-parse HEAD)" main
'
```

---

## 6. Vérifications PM2 / local

```bash
sudo -u afdrd7787 -H bash -lc '
  pm2 status
  pm2 logs plateforme-afd --lines 100
  curl -fsS http://127.0.0.1:3000/api/health
  ss -lntp | grep 3000 || netstat -lntp | grep 3000
'
```

Attendu : écoute `127.0.0.1:3000`, JSON `"status":"ok"`.

```bash
sudo -u afdrd7787 -H pm2 save
# En root, exécuter la commande exacte affichée par :
sudo env PATH=$PATH pm2 startup systemd -u afdrd7787 --hp /home/afd-rdc.org
```

Optionnel : `pm2 install pm2-logrotate`

---

## 7. OpenLiteSpeed proxy

Suivre `docs/CYBERPANEL_OPENLITESPEED_PROXY_GUIDE.md`.

Puis :

```bash
curl -fsS https://afd-rdc.org/api/health
```

Relancer un deploy **sans** `SKIP_PUBLIC_CHECK` :

```bash
sudo -u afdrd7787 -H bash -lc '
  export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
  cd "$VPS_APP_PATH/repo"
  bash scripts/deploy-production.sh "$(git rev-parse HEAD)" main
'
```

---

## 8. Activer GitHub Actions

Secrets (Settings → Secrets and variables → Actions) :

| Secret | Valeur conceptuelle |
|---|---|
| `VPS_HOST` | `187.55.230.121` |
| `VPS_PORT` | `22` |
| `VPS_USER` | `afdrd7787` |
| `VPS_SSH_PRIVATE_KEY` | clé privée Actions→VPS |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_DEPLOY_BRANCH` | `main` |
| `VPS_KNOWN_HOSTS` | (recommandé) sortie `ssh-keyscan` |

Environment GitHub : `production`.

Ensuite chaque :

```bat
cd /d D:\Plateforme-AFD\AFD
git add .
git commit -m "feat: description"
git push origin main
```

déclenche le déploiement automatique.
