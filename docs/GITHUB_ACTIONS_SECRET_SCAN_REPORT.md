# Rapport — scan secrets (GitHub Actions production)

Date : 2026-08-09  
Périmètre : fichiers ajoutés/modifiés pour le déploiement automatique GitHub Actions.

## Recherches effectuées

Motifs vérifiés (présence indésirable dans le dépôt) :

- `BEGIN OPENSSH PRIVATE KEY`
- `VPS_SSH_PRIVATE_KEY` avec une valeur en clair
- mots de passe / tokens
- contenu `.env.production`
- clés Supabase
- mot de passe SMTP

## Résultat

| Élément | Statut |
|---------|--------|
| Clé privée OpenSSH dans le dépôt | Absent |
| Secret `VPS_SSH_PRIVATE_KEY` en clair dans le code | Absent (référence `${{ secrets.* }}` uniquement) |
| Mot de passe SSH / root dans le workflow | Absent |
| `.env.production` versionné | Absent (gitignore) |
| Clés Supabase / SMTP dans les docs | Absent (noms de variables uniquement si besoin) |
| Artefacts `github_actions_afd_production` | Ignorés via `.gitignore` ; stockés hors dépôt (`%USERPROFILE%\.ssh\`) |

## Fichiers sensibles hors Git

- `%USERPROFILE%\.ssh\github_actions_afd_production` (privée — ne pas committer)
- `%USERPROFILE%\.ssh\github_actions_afd_production.pub` (publique)

## Verdict

Aucun secret matériel détecté dans les fichiers destinés au commit.  
Les secrets de production doivent rester uniquement dans **GitHub → Settings → Secrets and variables → Actions**.
