# Rapport de préparation — GitHub → VPS CyberPanel

Date : 2026-08-09  
Projet : `D:\Plateforme-AFD\AFD`  
Domaine : https://afd-rdc.org

---

## Validations locales

| Étape | Résultat |
|---|---|
| Next.js / React | 16.2.10 / 19.2.4 |
| Node engines | >=20 <=24 (CI = 22) |
| `npm run typecheck` | OK |
| `npm run lint` | OK (warnings non bloquants ; `ecosystem.config.cjs` ignoré) |
| `npm run test` | 67/67 OK |
| `npm run build` + standalone | OK (`server.js`, `.next/static`, `public`) |

---

## Livrables présents

| Élément | Fichier |
|---|---|
| Standalone | `next.config.ts` (`output: "standalone"`) |
| Prepare standalone | `scripts/prepare-standalone.mjs` |
| Deploy script | `scripts/deploy-production.sh` |
| Rollback script | `scripts/rollback-production.sh` |
| PM2 | `ecosystem.config.cjs` |
| Health minimal | `src/app/api/health/route.ts` |
| GitHub Actions | `.github/workflows/deploy-production.yml` |
| Env exemple prod | `.env.production.example` |
| Architecture | `docs/GITHUB_VPS_DEPLOYMENT_ARCHITECTURE.md` |
| Premier deploy | `docs/FIRST_CYBERPANEL_DEPLOYMENT.md` |
| Auto deploy | `docs/AUTOMATIC_DEPLOYMENT_GUIDE.md` |
| Rollback | `docs/PRODUCTION_ROLLBACK_GUIDE.md` |
| Variables | `docs/PRODUCTION_ENVIRONMENT_VARIABLES.md` |
| Proxy OLS | `docs/CYBERPANEL_OPENLITESPEED_PROXY_GUIDE.md` |
| Migrations | `docs/SUPABASE_PRODUCTION_MIGRATION_GUIDE.md` |

---

## Secrets — état

- `.gitignore` exclut `.env*`, `Deploy/`, `logs/`, `secrets/`, clés SSH, ZIP
- Aucune connexion VPS tentée (IP / user / port / path non confirmés)
- Secrets Actions à créer manuellement : `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`, `VPS_APP_PATH`, `VPS_DEPLOY_BRANCH`, optionnel `VPS_KNOWN_HOSTS`

---

## GitHub

- Remote actuel : `https://github.com/ibrahimkasende-crypto/Platefrome-AFD.git`
- Branche de travail locale observée : `fix/final-dashboard-and-hostinger` (à merger vers `main` pour le CD)
- `gh` CLI non disponible sur la machine locale au moment de l’audit — confirmer manuellement que le dépôt est **privé**

---

## Critères restants (côté ops)

- [ ] Confirmer IP / user / port / `VPS_APP_PATH`
- [ ] Premier déploiement manuel (`FIRST_CYBERPANEL_DEPLOYMENT.md`)
- [ ] Proxy OpenLiteSpeed + HTTPS
- [ ] Secrets GitHub Actions
- [ ] Protection branche `main`
- [ ] Deploy Key VPS → GitHub
- [ ] Désactiver définitivement le workflow ZIP Hostinger

---

## Workflow quotidien cible

```powershell
cd "D:\Plateforme-AFD\AFD"
git add .
git commit -m "feat: ..."
git push origin main
```

Plus de ZIP.
