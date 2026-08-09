# Premier déploiement CyberPanel (manuel, surveillé)

> Ne pas activer GitHub Actions tant que cette procédure n’est pas validée.  
> Ne pas se connecter au VPS tant que **IP**, **user SSH**, **port**, **chemin** ne sont pas confirmés.

---

## 0. Prérequis confirmés

- [ ] IP publique du VPS
- [ ] Utilisateur SSH de déploiement (pas root si possible)
- [ ] Port SSH
- [ ] Chemin réel (`ls /home/` → ex. `/home/afd-rdc.org/apps/plateforme-afd`)
- [ ] Dépôt GitHub **privé**
- [ ] Deploy Key lecture seule (VPS → GitHub)
- [ ] Clé SSH Actions → VPS

---

## 1. Sauvegarder l’existant

Sur le VPS :

```bash
sudo mkdir -p /root/backups-afd-$(date +%Y%m%d)
# Sauvegarder public_html / ancienne app Node / conf OLS selon l’existant
```

Ne pas supprimer l’ancien site avant health HTTPS OK.

---

## 2. Structure

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd   # AJUSTER
mkdir -p "$VPS_APP_PATH"/{releases,shared/logs,repo}
chmod 700 "$VPS_APP_PATH/shared"
```

---

## 3. Clone dépôt (Deploy Key)

```bash
# Générer Deploy Key (lecture seule) sur le VPS
ssh-keygen -t ed25519 -f ~/.ssh/afd_github_deploy -N ""
# Ajouter ~/.ssh/afd_github_deploy.pub dans GitHub → Settings → Deploy keys (read-only)

GIT_SSH_COMMAND='ssh -i ~/.ssh/afd_github_deploy -o IdentitiesOnly=yes' \
  git clone git@github.com:ibrahimkasende-crypto/Platefrome-AFD.git "$VPS_APP_PATH/repo"
```

---

## 4. Env partagé

```bash
cp "$VPS_APP_PATH/repo/.env.production.example" "$VPS_APP_PATH/shared/.env.production"
nano "$VPS_APP_PATH/shared/.env.production"
chmod 600 "$VPS_APP_PATH/shared/.env.production"
```

Voir `docs/PRODUCTION_ENVIRONMENT_VARIABLES.md`.

---

## 5. Node + PM2

```bash
node -v   # 20–24
npm -v
npm install -g pm2
```

---

## 6. Copier ecosystem à la racine app

```bash
cp "$VPS_APP_PATH/repo/ecosystem.config.cjs" "$VPS_APP_PATH/ecosystem.config.cjs"
```

---

## 7. Premier deploy script

```bash
cd "$VPS_APP_PATH/repo"
git checkout main
git pull
export VPS_APP_PATH
export SKIP_PUBLIC_CHECK=1   # jusqu’à ce que le proxy OLS soit prêt
bash scripts/deploy-production.sh "$(git rev-parse HEAD)"
```

Vérifier :

```bash
curl -fsS http://127.0.0.1:3000/api/health
pm2 status
pm2 logs plateforme-afd --lines 100
pm2 save
pm2 startup   # exécuter la commande root affichée
```

---

## 8. OpenLiteSpeed proxy

Suivre `docs/CYBERPANEL_OPENLITESPEED_PROXY_GUIDE.md`.

Puis :

```bash
curl -fsS https://afd-rdc.org/api/health
```

---

## 9. Supabase Auth URLs

- Site URL : `https://afd-rdc.org`
- Redirect : `https://afd-rdc.org/auth/callback`, `https://afd-rdc.org/**`

---

## 10. Emails

Ne pas modifier MX/SPF/DKIM. Tester contact SMTP après proxy OK.

---

## 11. Activer GitHub Actions

1. Secrets `VPS_*` dans GitHub
2. Environment `production` (optionnel mais recommandé)
3. Protection branche `main`
4. Premier `workflow_dispatch` manuel
5. Ensuite seulement : push sur `main`
