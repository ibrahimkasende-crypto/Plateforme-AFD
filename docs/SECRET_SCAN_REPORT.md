# Rapport de scan secrets (dépôt local)

Date : 2026-08-09  
Périmètre : `D:\Plateforme-AFD\AFD`  
Méthode : recherche de motifs (clés privées, préfixes secrets, fichiers env) **sans afficher aucune valeur**.

## Résultat

| Catégorie | Statut | Notes |
|---|---|---|
| Clés OpenSSH / PEM dans Git | OK | Aucun fichier `BEGIN OPENSSH PRIVATE KEY` suivi |
| `.env.local` / `.env.production` | OK (ignorés) | Présents localement, listés dans `.gitignore` |
| `hostinger.env` | OK (ignoré) | Contient des secrets locaux — **non suivi** par Git |
| Mentions `sb_secret_` dans le code | OK | Uniquement détection / placeholders dans `src/lib/supabase/*` |
| Mentions `service_role` | OK | Documentation / commentaires / placeholders |
| `MAIL_SMTP_PASSWORD=` avec valeur réelle | ATTENTION locale | Présent dans fichiers **ignorés** (`.env.local`, `hostinger.env`) — ne pas committer |
| Workflow YAML | OK | Secrets via `${{ secrets.* }}` uniquement |
| Scripts deploy | OK | Aucun secret hardcodé |

## Actions recommandées

1. Mettre le dépôt GitHub en **privé**.
2. Ne jamais `git add -f` sur `.env*`, `hostinger.env`, `Deploy/`.
3. Après toute fuite suspecte : **rotation** Supabase service role + mot de passe SMTP.
4. Supprimer ou vider `hostinger.env` local une fois CyberPanel/VPS opérationnel.

## Verdict scan Git

**Aucun secret de production détecté dans l’index Git suivi.**  
Des secrets existent uniquement hors Git (fichiers locaux ignorés).
