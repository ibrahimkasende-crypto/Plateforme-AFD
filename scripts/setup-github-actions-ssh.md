# Clé SSH GitHub Actions → VPS (production)

Clé dédiée uniquement au flux **GitHub Actions → VPS** (`afdrd7787`).  
Ne pas réutiliser la Deploy Key **VPS → GitHub**.

## A. Génération de la clé

```bash
ssh-keygen -t ed25519 \
  -C "github-actions-afd-production" \
  -f github_actions_afd_production \
  -N ""
```

Sous Windows (PowerShell), vous pouvez aussi utiliser :

```powershell
.\scripts\prepare-github-actions-ssh.ps1
```

Résultat :

- `github_actions_afd_production` — clé **privée**
- `github_actions_afd_production.pub` — clé **publique**

## B. Ajout de la clé publique sur le VPS

En tant que `afdrd7787` (recommandé) :

```bash
PUB="$(cat github_actions_afd_production.pub)"
ssh -p 22 afdrd7787@187.55.230.121 \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && grep -Fqx \"$PUB\" ~/.ssh/authorized_keys || echo \"$PUB\" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Ou en root (sans supprimer les clés existantes) :

```bash
PUB="$(cat github_actions_afd_production.pub)"
ssh -p 22 root@187.55.230.121 bash -s <<EOF
set -Eeuo pipefail
mkdir -p /home/afd-rdc.org/.ssh
touch /home/afd-rdc.org/.ssh/authorized_keys
chmod 700 /home/afd-rdc.org/.ssh
chmod 600 /home/afd-rdc.org/.ssh/authorized_keys
if ! grep -Fqx "\$PUB" /home/afd-rdc.org/.ssh/authorized_keys; then
  printf '%s\n' "\$PUB" >> /home/afd-rdc.org/.ssh/authorized_keys
fi
chown -R afdrd7787:afdrd7787 /home/afd-rdc.org/.ssh
chmod 700 /home/afd-rdc.org/.ssh
chmod 600 /home/afd-rdc.org/.ssh/authorized_keys
EOF
```

## C. Permissions SSH

Sur le VPS :

```bash
chown -R afdrd7787:afdrd7787 /home/afd-rdc.org/.ssh
chmod 700 /home/afd-rdc.org/.ssh
chmod 600 /home/afd-rdc.org/.ssh/authorized_keys
```

Vérifier que l’authentification par clé est active :

```bash
sshd -T | grep -i pubkeyauthentication
# attendu : pubkeyauthentication yes
```

## D. Test de connexion

```bash
ssh -i github_actions_afd_production \
  -p 22 \
  afdrd7787@187.55.230.121 \
  "whoami && hostname"
```

Résultat attendu :

```text
afdrd7787
panel.afd-rdc.org
```

Ne jamais tester avec `root`.

## E. Secret GitHub `VPS_SSH_PRIVATE_KEY`

1. GitHub → dépôt `Plateforme-AFD`
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Nom : `VPS_SSH_PRIVATE_KEY`
5. Valeur : contenu **complet** du fichier privé `github_actions_afd_production`  
   (y compris les lignes `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`)

Créer aussi :

| Secret | Valeur |
|--------|--------|
| `VPS_HOST` | `187.55.230.121` |
| `VPS_PORT` | `22` |
| `VPS_USER` | `afdrd7787` |
| `VPS_APP_PATH` | `/home/afd-rdc.org/apps/plateforme-afd` |

Ne jamais committer la clé privée.

## F. Suppression sécurisée des fichiers temporaires

Après avoir collé la clé privée dans GitHub :

```bash
# Linux / macOS
shred -u github_actions_afd_production 2>/dev/null || rm -f github_actions_afd_production
rm -f github_actions_afd_production.pub
```

```powershell
# Windows — si les fichiers sont encore dans le dossier du projet
Remove-Item -Force .\github_actions_afd_production, .\github_actions_afd_production.pub -ErrorAction SilentlyContinue
```

Si la paire est conservée dans `%USERPROFILE%\.ssh\` pour administration, protégez le dossier et ne la versionnez jamais.
