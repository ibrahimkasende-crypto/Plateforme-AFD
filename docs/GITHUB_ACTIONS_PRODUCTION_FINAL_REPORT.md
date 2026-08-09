# Rapport final — GitHub Actions production

Date : 2026-08-09  
Dépôt : https://github.com/ibrahimkasende-crypto/Plateforme-AFD  
Domaine : https://afd-rdc.org  
VPS : `187.55.230.121` — user `afdrd7787` — app `/home/afd-rdc.org/apps/plateforme-afd`

## 1. Workflow audité

Fichier : `.github/workflows/deploy-production.yml`

Points déjà présents avant correction :

- déclenchement `push` sur `main` + `workflow_dispatch`
- Node 22, `npm ci`, typecheck, lint, tests, `build:production`
- concurrency (sans annuler un déploiement en cours)
- `permissions: contents: read`
- déploiement SSH + health public

Points à corriger / renforcer :

- dépendance à `environment: production` (peut bloquer si env non configuré)
- agent SSH tiers + secret optionnel `VPS_KNOWN_HOSTS`
- health public trop court / sans contrôle Content-Type
- pas de fetch/checkout explicite du SHA avant l’exécution du script du commit
- groupe concurrency à aligner sur `production-deployment`

## 2. Workflow corrigé

Oui. Principales évolutions :

- concurrency `production-deployment` / `cancel-in-progress: false`
- plus d’`environment: production` obligatoire (secrets repository)
- clé privée écrite dans un fichier temporaire, `chmod 600`, suppression `always()`
- `ssh-keyscan` pour `known_hosts`
- déploiement du SHA exact (`github.sha` ou input `ref`)
- sur le VPS : `git fetch` → `checkout`/`reset --hard` du SHA → `bash scripts/deploy-production.sh <SHA>`
- validations VPS désactivées (`RUN_TYPECHECK/LINT/TEST=0`) car déjà faites dans Actions
- health public ~60 s, HTTP 200 + `application/json` + `"status":"ok"`
- timeout Validate 30 min / Deploy 45 min
- input `run_tests` pour `workflow_dispatch`
- aucun rollback contradictoire côté Actions (rollback = script serveur)

## 3. Clé dédiée préparée

Oui — paire ed25519 `github-actions-afd-production` dans `%USERPROFILE%\.ssh\` (hors Git).

## 4. Clé publique sur le VPS

Oui — ajoutée dans `/home/afd-rdc.org/.ssh/authorized_keys` pour `afdrd7787` sans supprimer les clés existantes.

Test :

```text
afdrd7787
panel.afd-rdc.org
```

## 5. Secrets requis (repository)

| Secret | Valeur attendue |
|--------|-----------------|
| `VPS_HOST` | `187.55.230.121` |
| `VPS_PORT` | `22` |
| `VPS_USER` | `afdrd7787` |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_SSH_PRIVATE_KEY` | clé privée complète (fichier local, hors Git) |

Cursor **n’a pas** écrit ces secrets dans GitHub s’il n’a pas accès Settings / `gh secret set`.  
Voir `docs/GITHUB_ACTIONS_PRODUCTION_SETUP.md`.

## 6. SHA exact

Le workflow déploie `${{ github.sha }}` (ou `inputs.ref`).  
`deploy-production.sh` refuse un SHA complet qui ne correspond pas au `HEAD` checkouté.

## 7. Validations

Avant SSH : `npm ci` → typecheck → lint → test → `build:production` → artefacts standalone.

## 8. Déploiement

Script serveur : `scripts/deploy-production.sh`  
Releases atomiques, `shared/.env.production`, smoke port temporaire, bascule `current`, PM2, health local/public, conservation des dernières releases.  
`nghttpx` : jamais réactivé ; détection collision port 3000.

## 9. Health

- Local VPS : `http://127.0.0.1:3000/api/health`
- Public : `https://afd-rdc.org/api/health` (script + job Actions)

## 10. Rollback

Automatique dans `deploy-production.sh` si health local/public KO après bascule.  
Le workflow n’ajoute pas de second rollback.

## 11. Sécurité

- pas de mot de passe SSH
- pas de root
- pas de clé privée dans le dépôt
- pas d’`echo` de secrets
- `.gitignore` étendu pour `github_actions_afd_production*`
- scan : `docs/GITHUB_ACTIONS_SECRET_SCAN_REPORT.md`

## 12. Résultat du workflow réel

Run réussi : https://github.com/ibrahimkasende-crypto/Plateforme-AFD/actions/runs/31324269594  
Déclenchement : `workflow_dispatch` sur `main` (2026-08-09)

| Contrôle | Résultat |
|----------|----------|
| SHA demandé | `281a2f5a28aefb194c6f7cb34892cee01b0465cb` |
| SHA déployé | `281a2f5a28aefb194c6f7cb34892cee01b0465cb` |
| Release | `20260809-173943-281a2f5a28ae` |
| PM2 `plateforme-afd` | online |
| Health local | OK (`"status":"ok"`) |
| Health public | HTTP 200 `"status":"ok"` |
| Jobs | Validate ✓ · Deploy VPS ✓ |

Corrections effectuées pendant le test réel :

1. `VPS_SSH_PRIVATE_KEY` stocké en **base64** (le PEM collé sous Windows provoquait `error in libcrypto`)
2. Alias SSH VPS `github-afd` → Deploy Key restauré (sinon `git fetch` échoue)

## 13. Problèmes restants

1. Changer le mot de passe root s’il a été exposé dans un chat précédent.
2. Optionnel : nettoyer les doublons éventuels dans `authorized_keys`.

## 14. Verdict final

**Déploiement automatique GitHub Actions opérationnel.**

Flux quotidien :

```bash
git add .
git commit -m "description"
git push origin main
```

## Déclenchement test

Workflow réel déclenché le 2026-08-09 17:14:43 (UTC+1) après création des secrets GitHub.

