# Rapport de préparation — GitHub → VPS CyberPanel

Date : 2026-08-09  
Projet local : `D:\Plateforme-AFD\AFD`  
Dépôt : `https://github.com/ibrahimkasende-crypto/Platefrome-AFD`  
Cible VPS : `afdrd7787@187.55.230.121` → `/home/afd-rdc.org/apps/plateforme-afd`

## Audit applicatif (résumé)

| Élément | Valeur |
|---|---|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| Node engines | `>=20 <=24` (VPS confirmé **22.23.2**) |
| npm VPS | 10.9.8 |
| PM2 VPS | 7.0.3 |
| `output: "standalone"` | Oui (`next.config.ts`) |
| Script start prod | PM2 → `.next/standalone/server.js` |
| Middleware | Présent (`src/middleware.ts`) |
| API routes | Oui (auth, contact, mail, health, payments…) |
| Server Actions | Oui (admin / import / identity…) |
| next/image | Supabase Storage remotePatterns |
| Supabase Auth / Storage | Conservés (pas sur le VPS) |
| OAuth Google Newsletter | Supporté (flags + callback) |
| Contact + SMTP | Oui (`nodemailer`, `email:test-contact`) |
| OCR | Provider native, fichiers temporaires hors release |
| Persistants métier | Supabase uniquement |

## Checklist mission

| # | Critère | Statut |
|---|---|---|
| 1 | Dépôt GitHub prêt (scripts + workflow + docs + `.env.example`) | **PRÊT** (mettre le repo en **privé** si encore public) |
| 2 | Standalone prêt (`build:standalone` + `server.js`) | **PRÊT** |
| 3 | Script `deploy-production.sh` | **PRÊT** (releases `YYYYMMDD-HHMMSS-SHA`, rollback auto) |
| 4 | Script `rollback-production.sh` | **PRÊT** |
| 5 | `ecosystem.config.cjs` PM2 | **PRÊT** (`cwd=current`, logs=`logs/`, bind `127.0.0.1`) |
| 6 | Health check `/api/health` | **PRÊT** (+ `/api/health/dependencies`) |
| 7 | Workflow GitHub Actions | **PRÊT** |
| 8 | Secrets GitHub documentés | **PRÊT** (à créer dans l’UI GitHub) |
| 9 | Env production documenté | **PRÊT** + `setup-production-env.sh` |
| 10 | OpenLiteSpeed documenté | **PRÊT** |
| 11 | Supabase migrations documentées | **PRÊT** |
| 12 | SMTP documenté | **PRÊT** |
| 13 | Sécurité / secret scan | **PRÊT** (aucun secret dans l’index Git) |
| 14 | Tests unitaires | **67/67 OK** |
| 15 | typecheck | **OK** |
| 16 | lint | **OK** |
| 17 | build:standalone | **OK** (`STANDALONE_READY`) |
| 18 | ZIP encore requis ? | **Non** (`deploy:zip` legacy seulement) |

## Validations locales exécutées

```text
npm ci              OK
npm run typecheck   OK
npm run lint        OK
npm run test        OK (67)
npm run build:standalone OK
```

Artefacts vérifiés :

- `.next/standalone/server.js`
- `.next/standalone/public`
- `.next/standalone/.next/static`

## Secrets GitHub Actions à configurer (pas encore faits ici)

| Secret | Valeur attendue |
|---|---|
| `VPS_HOST` | `187.55.230.121` |
| `VPS_PORT` | `22` |
| `VPS_USER` | `afdrd7787` |
| `VPS_SSH_PRIVATE_KEY` | clé privée Actions → VPS |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_DEPLOY_BRANCH` | `main` |
| `VPS_KNOWN_HOSTS` | recommandé |

## Problèmes restants (hors code)

1. **Repo GitHub doit être privé** (vérifier dans Settings).
2. **Secrets Actions** non configurés depuis cette session.
3. **Premier déploiement manuel VPS** non exécuté ici (consigne : pas d’écriture VPS tant que secrets/URL pas finalisés).
4. **Proxy OpenLiteSpeed** à appliquer après PM2 local health OK.
5. Fichiers locaux ignorés (`.env.local`, `hostinger.env`) contiennent des secrets — ne jamais les forcer dans Git ; rotation recommandée si exposés ailleurs.

## Verdict

**PRÊT côté code / scripts / docs / validations locales.**  

Prochaine étape opérationnelle (humaine + VPS) :

1. Repo privé + Deploy Key (`docs/VPS_GITHUB_DEPLOY_KEY.md`)
2. `setup-production-env.sh` sur le VPS
3. Premier run `deploy-production.sh` (`docs/FIRST_CYBERPANEL_DEPLOYMENT.md`)
4. Proxy OLS
5. Configurer les secrets Actions
6. Ensuite : `git push origin main` = déploiement automatique
