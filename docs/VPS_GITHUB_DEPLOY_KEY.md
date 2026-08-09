# Deploy Key VPS → GitHub (lecture seule)

Utilisateur VPS : **afdrd7787**  
Home site : `/home/afd-rdc.org`  
Dépôt : `ibrahimkasende-crypto/Platefrome-AFD` (doit être **privé**)

## Fichiers

```text
/home/afd-rdc.org/.ssh/github_afd_deploy
/home/afd-rdc.org/.ssh/github_afd_deploy.pub
/home/afd-rdc.org/.ssh/config
/home/afd-rdc.org/.ssh/known_hosts
```

## Config SSH

Contenu de `~/.ssh/config` (utilisateur `afdrd7787`) :

```sshconfig
Host github-afd
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_afd_deploy
    IdentitiesOnly yes
```

## Permissions

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/github_afd_deploy
chmod 644 ~/.ssh/github_afd_deploy.pub
chmod 600 ~/.ssh/known_hosts
```

## Génération (si pas déjà fait)

```bash
sudo -u afdrd7787 -H bash -lc '
  mkdir -p ~/.ssh && chmod 700 ~/.ssh
  test -f ~/.ssh/github_afd_deploy || ssh-keygen -t ed25519 -f ~/.ssh/github_afd_deploy -N "" -C "afd-vps-deploy-readonly"
  cat >> ~/.ssh/config <<EOF
Host github-afd
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_afd_deploy
    IdentitiesOnly yes
EOF
  chmod 600 ~/.ssh/config ~/.ssh/github_afd_deploy
  ssh-keyscan -H github.com >> ~/.ssh/known_hosts
  chmod 600 ~/.ssh/known_hosts
  echo "=== PUBLIC KEY (ajouter comme Deploy Key read-only) ==="
  cat ~/.ssh/github_afd_deploy.pub
'
```

## GitHub

1. Repo → **Settings → Deploy keys → Add deploy key**
2. Coller la clé **publique** uniquement
3. **Allow write access** : **non** (lecture seule)
4. Ne jamais coller la clé privée dans GitHub Secrets (celle-ci est pour Actions → VPS, pas pour GitHub clone)

## Test

```bash
sudo -u afdrd7787 -H ssh -T github-afd
```

Réponse attendue (succès) :

```text
Hi ibrahimkasende-crypto/Platefrome-AFD! You've successfully authenticated, but GitHub does not provide shell access.
```

## Clone / remote

```bash
export VPS_APP_PATH=/home/afd-rdc.org/apps/plateforme-afd
sudo -u afdrd7787 -H git clone git@github-afd:ibrahimkasende-crypto/Platefrome-AFD.git "$VPS_APP_PATH/repo"
```
