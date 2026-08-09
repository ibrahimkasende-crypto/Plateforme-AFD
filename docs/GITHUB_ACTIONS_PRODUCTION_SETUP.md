# Déploiement automatique GitHub Actions → production

Guide simple pour brancher le flux quotidien :

```bash
git add .
git commit -m "description"
git push origin main
```

Chaque push sur `main` valide le projet, déploie sur le VPS (`afdrd7787`), bascule PM2, puis vérifie `https://afd-rdc.org/api/health`.

## 1. Ouvrir le dépôt GitHub

Allez sur : [https://github.com/ibrahimkasende-crypto/Plateforme-AFD](https://github.com/ibrahimkasende-crypto/Plateforme-AFD)

## 2. Ouvrir Settings

Cliquez **Settings** (onglet du dépôt).

## 3. Secrets and variables

Dans le menu de gauche : **Secrets and variables** → **Actions**.

## 4. Actions secrets

Vous êtes sur la page des secrets utilisables par les workflows.

## 5. New repository secret

Cliquez **New repository secret** pour chaque secret ci-dessous.

## 6. Créer les 5 secrets

| Nom | Valeur |
|-----|--------|
| `VPS_HOST` | `187.55.230.121` |
| `VPS_PORT` | `22` |
| `VPS_USER` | `afdrd7787` |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |
| `VPS_SSH_PRIVATE_KEY` | contenu complet de la clé privée dédiée GitHub Actions |

Pour la clé privée :

1. Générer / préparer la paire (voir `scripts/setup-github-actions-ssh.md` ou `scripts/prepare-github-actions-ssh.ps1`)
2. Ajouter la clé **publique** dans `/home/afd-rdc.org/.ssh/authorized_keys`
3. Coller la clé **privée** complète dans `VPS_SSH_PRIVATE_KEY`
4. Ne jamais committer la clé privée

## 7. Lancer Run workflow (manuel)

1. Onglet **Actions**
2. Workflow **Deploy production**
3. **Run workflow**
4. Branche : `main`
5. Lancer

Options utiles :

- `run_tests` : exécuter les tests unitaires (défaut : oui)
- `skip_public_check` : urgence uniquement (ne pas utiliser en routine)

## 8. Lire les logs

Dans **Actions** → run concerné :

1. Job **Validate** : `npm ci`, typecheck, lint, tests, `build:production`
2. Job **Deploy VPS** : SSH, `deploy-production.sh`, health public

En cas d’échec, le job reste rouge (pas de masquage). Le rollback éventuel est fait **sur le VPS** par le script, pas par un second rollback contradictoire dans Actions.

## 9. Vérifier le domaine

```bash
curl -sS https://afd-rdc.org/api/health
```

Attendu : HTTP 200, JSON avec `"status":"ok"`.

## 10. Revenir à la version précédente

Sur le VPS, en `afdrd7787` :

```bash
bash /home/afd-rdc.org/apps/plateforme-afd/repo/scripts/rollback-production.sh
```

Ou pointer `current` vers une release antérieure puis `pm2 start` / reload via l’écosystème (voir `docs` rollback).

## Flux serveur (rappel)

Le workflow appelle `scripts/deploy-production.sh` avec le SHA exact `${{ github.sha }}` :

1. Nouvelle release (sans toucher `current` pendant le build)
2. `npm ci` + `build:production`
3. Smoke `/api/health` sur port temporaire
4. Bascule `current` + PM2
5. Health local `127.0.0.1:3000`
6. Health public `https://afd-rdc.org/api/health`
7. Rollback automatique si échec

**Ne jamais réactiver `nghttpx` sur le port 3000.**

## Note sur `VPS_SSH_PRIVATE_KEY`

Le secret accepte :
1. le PEM OpenSSH multiligne, **ou**
2. le **base64 d'une seule ligne** du fichier clé (recommandé si le collage Windows casse les retours à la ligne).

Générer le base64 sous PowerShell (sans l'afficher) puis le coller dans le secret :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\IKAS\.ssh\github_actions_afd_production")) | Set-Clipboard
```

