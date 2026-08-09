# Déploiement production CyberPanel — Plateforme-AFD

Domaine : **https://afd-rdc.org**  
Panneau : **https://panel.afd-rdc.org:8090**  
Stack : Next.js App Router (Node) → reverse proxy OpenLiteSpeed → Supabase

---

## 0. Audit local (résultat)

| Élément | Valeur |
|---|---|
| Next.js | **16.2.10** |
| React | **19.2.4** |
| Node requis | **>=20 <=24** (`.nvmrc` = **24**, recommandé **22 LTS** ou **24**) |
| Package manager | **npm** (`package-lock.json`) |
| `output` | **`standalone`** (activé dans `next.config.ts`) |
| Middleware | `src/middleware.ts` (session Supabase + garde `/admin`) |
| Routes API | **24** (`/api/auth/*`, `/api/contact`, `/api/mail/*`, `/api/ocr/*`, `/api/health`, SerdiPay…) |
| Server Actions | ~**71** modules (`"use server"`) |
| Supabase images | `mxxuxnoqnwjygawvvhcb.supabase.co` (`remotePatterns`) |
| Validations locales | `npm ci` OK · `typecheck` OK · `lint` 0 erreur · `test` 67/67 · `build` OK + `.next/standalone` |

Architecture cible :

```text
Internet
  → https://afd-rdc.org
  → OpenLiteSpeed / CyberPanel
  → reverse proxy
  → Next.js (127.0.0.1:3000, PM2)
  → Supabase (Postgres / Auth / Storage)
```

---

## COMMANDES À EXÉCUTER LOCALEMENT

```bash
cd D:\Plateforme-AFD\AFD

node -v
npm -v

npm ci
npm run typecheck
npm run lint
npm run test
npm run build
node scripts/prepare-standalone.mjs

# Vérifier
dir .next\standalone\server.js
dir .next\standalone\.next\static
dir .next\standalone\public
```

Préparer l’artefact à synchroniser (exemple sans secrets) :

```bash
# Exemple : archive légère du code source (sans node_modules / .next / .env)
# Sur Windows PowerShell, ou utiliser git + pull sur le VPS (recommandé).
git status
```

Copier sur le VPS **uniquement** après création de `.env.production` **sur le serveur** (jamais committer les secrets).

---

## COMMANDES À EXÉCUTER SUR LE VPS

> Remplacer les chemins après vérification réelle (`ls /home`).  
> Ne pas inventer `/home/...` sans `ls`.

### A. Découverte chemins CyberPanel

```bash
ls /home/
ls /usr/local/lsws/conf/vhosts/
# Noter le document root du site afd-rdc.org (souvent .../public_html)
```

Créer la structure (exemple si le home est `/home/afd-rdc.org`) :

```bash
export HOME_SITE=/home/afd-rdc.org   # AJUSTER après ls /home
sudo mkdir -p "${HOME_SITE}/application" \
              "${HOME_SITE}/logs" \
              "${HOME_SITE}/backups" \
              "${HOME_SITE}/releases"
sudo chown -R "$(whoami):$(whoami)" \
  "${HOME_SITE}/application" "${HOME_SITE}/logs" \
  "${HOME_SITE}/backups" "${HOME_SITE}/releases"
```

### B. Node.js 22 LTS (ou 24)

```bash
node -v
npm -v
# Si absent / hors plage 20–24 : installer via nvm ou NodeSource,
# puis recharger le shell.
```

### C. Code applicatif

```bash
export APP_ROOT=/home/afd-rdc.org/application   # AJUSTER
cd "${APP_ROOT}"
# Option recommandée : git clone / git pull du dépôt
# git clone <URL_DU_REPO> .
# ou rsync depuis la machine locale (sans .env.local)
```

### D. Variables d’environnement

```bash
cd "${APP_ROOT}"
cp .env.production.example .env.production
nano .env.production   # renseigner les vraies valeurs (voir section VARIABLES)
chmod 600 .env.production
```

### E. Build + standalone + PM2

```bash
cd "${APP_ROOT}"
npm ci
npm run build
node scripts/prepare-standalone.mjs

npm install -g pm2
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# Exécuter ENSUITE la commande root exacte affichée par `pm2 startup`

curl -fsS http://127.0.0.1:3000/api/health
pm2 status
pm2 logs plateforme-afd --lines 50
```

### F. Déploiements suivants

```bash
cd "${APP_ROOT}"
chmod +x scripts/deploy-cyberpanel.sh
APP_ROOT="${APP_ROOT}" ./scripts/deploy-cyberpanel.sh
```

### G. Firewall (recommandation — ne pas casser l’email)

Ports publics : **80**, **443**  
Admin : **22** (SSH), **8090** (CyberPanel, idéalement restreint par IP)  
Node **3000** : rester sur `127.0.0.1` uniquement.

```bash
ss -lntp | grep -E ':3000|:8090|:443'
```

---

## CONFIGURATION À FAIRE DANS CYBERPANEL

1. Site `afd-rdc.org` déjà présent — **ne pas** y coller `.next` dans `public_html` comme site PHP.
2. Suivre `docs/CYBERPANEL_NEXTJS_REVERSE_PROXY.md` :
   - External App → `127.0.0.1:3000`
   - Context proxy URI `/`
   - Headers `X-Forwarded-Proto`
   - Exclure cache sur `/admin`, `/api`, `/auth`
3. SSL Let’s Encrypt pour `afd-rdc.org` (+ `www` si utilisé)
4. Force HTTPS
5. Redirection `www` → apex
6. Soft restart : `sudo /usr/local/lsws/bin/lswsctrl restart`
7. **Ne pas modifier** les boîtes mail `@afd-rdc.org` existantes

---

## CONFIGURATION À FAIRE DANS SUPABASE

Projet : `mxxuxnoqnwjygawvvhcb`

**Authentication → URL configuration**

- Site URL : `https://afd-rdc.org`
- Redirect URLs :
  - `https://afd-rdc.org/auth/callback`
  - `https://afd-rdc.org/**`
  - (garder localhost uniquement pour le dev local)

**Providers**

- Email activé (admin)
- Google activé (newsletter) avec callback Supabase  
  `https://mxxuxnoqnwjygawvvhcb.supabase.co/auth/v1/callback`

**Storage**

- Conserver les buckets (`afd-media`, avatars, OCR privés, etc.)
- Ne pas migrer Storage sur le disque VPS

---

## CONFIGURATION DNS

Avant tout changement : noter l’**IP publique du VPS CyberPanel**.

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | IP publique du VPS |
| A ou CNAME | `www` | IP ou `afd-rdc.org` |
| A/CNAME | `panel` | déjà utilisé pour `panel.afd-rdc.org` |

**Email — ne pas toucher sans audit** :

- MX
- SPF
- DKIM
- DMARC

Les comptes `@afd-rdc.org` doivent continuer à fonctionner après le cutover web.

---

## CONFIGURATION GOOGLE OAUTH

1. Google Cloud Console → OAuth client → Authorized redirect URIs :
   - `https://mxxuxnoqnwjygawvvhcb.supabase.co/auth/v1/callback`
2. Supabase → Auth → Providers → Google (Client ID / Secret)
3. App : `NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED=true`
4. Flux attendu : Newsletter → Google → `/auth/callback` → retour newsletter  
5. Un abonné newsletter **ne doit pas** accéder à `/admin` (pas de profil admin)

---

## VARIABLES D’ENVIRONNEMENT

Fichier serveur : `.env.production` (modèle : `.env.production.example`)

**Obligatoires**

```env
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=3000
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://afd-rdc.org
NEXT_PUBLIC_SUPABASE_URL=https://mxxuxnoqnwjygawvvhcb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Contact / SMTP**

```env
CONTACT_NOTIFICATION_EMAIL=contactafdrdc@gmail.com
CONTACT_FROM_EMAIL=admin@afd-rdc.org
CONTACT_FROM_NAME=Site officiel AFD
CONTACT_AUTO_REPLY_ENABLED=true
MAIL_SMTP_HOST=afd-rdc.org
MAIL_SMTP_PORT=587
MAIL_SMTP_USERNAME=admin@afd-rdc.org
MAIL_SMTP_PASSWORD=...
```

**Interdits en `NEXT_PUBLIC_*`**

- Service Role Supabase
- Mot de passe SMTP
- Secret Google
- Token / mot de passe CyberPanel
- Tout token privé

---

## TESTS

### Production HTTP

```bash
curl -I https://afd-rdc.org
curl -fsS https://afd-rdc.org/api/health
```

Pages à ouvrir manuellement :

- `/`, `/qui-sommes-nous`, `/actions/domaines-intervention`
- `/actions/programmes`, `/actions/projets`, `/actualites`
- `/bibliotheque`, `/contact`, `/connexion`, `/admin`

### Fonctionnel

- Images Supabase (Hero, projets, bibliothèque)
- Header / mobile / typewriter
- Formulaire contact → dashboard + email `contactafdrdc@gmail.com`
- Login admin + dashboard
- Newsletter « Continuer avec Google »
- Upload → Storage (pas disque VPS)
- OCR (si utilisé) avec fichiers temporaires nettoyés

### Mobile

Viewports : 320, 375, 390, 430, 768, 1024, 1366, 1440

### SMTP

```bash
cd "${APP_ROOT}"
# avec .env.production chargé
npx tsx scripts/test-contact-email.ts
```

---

## ROLLBACK

Voir `docs/CYBERPANEL_ROLLBACK.md`.

Principe : **ne jamais supprimer la version précédente avant validation health**.

---

## SÉCURITÉ (checklist)

- [ ] Aucun secret dans Git
- [ ] `.env.production` chmod 600, hors Git
- [ ] Service Role absente du frontend
- [ ] Port 3000 lié à `127.0.0.1`
- [ ] CyberPanel 8090 restreint si possible
- [ ] Logs PM2 sans passwords / tokens
- [ ] `public_html` ne contient pas le runtime Node ni `.env`

---

## Fichiers ajoutés pour ce déploiement

| Fichier | Rôle |
|---|---|
| `next.config.ts` (`output: 'standalone'`) | Build autonome |
| `.env.production.example` | Modèle env prod |
| `ecosystem.config.cjs` | PM2 |
| `scripts/prepare-standalone.mjs` | Copie `public` + `.next/static` |
| `scripts/deploy-cyberpanel.sh` | Déploiement + backup + health |
| `docs/CYBERPANEL_NEXTJS_REVERSE_PROXY.md` | Proxy OLS |
| `docs/CYBERPANEL_ROLLBACK.md` | Rollback |
| `docs/CYBERPANEL_PRODUCTION_DEPLOYMENT.md` | Ce rapport |

---

## Critères « déploiement terminé »

- [x] `npm run build` réussit (local, avec standalone)
- [ ] Node tourne en production sur le VPS
- [ ] PM2 maintient `plateforme-afd`
- [ ] OpenLiteSpeed proxy → 127.0.0.1:3000
- [ ] HTTPS `https://afd-rdc.org`
- [ ] Supabase Auth / Storage / data OK
- [ ] Images OK
- [ ] Dashboard OK
- [ ] Contact + SMTP OK
- [ ] Mobile OK
- [ ] Aucun secret exposé
