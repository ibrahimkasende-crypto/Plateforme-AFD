# Contrôle sécurité final — Plateforme-AFD

Date : 2026-08-04

## Recherche secrets

| Pattern | Résultat |
|---------|----------|
| JWT service_role réels (`eyJ…` longs) | Absent du dépôt suivi |
| `sb_secret_…` réels | Absent |
| Mots de passe temp admins | Absent (env only) |
| Placeholders `eyJ...` docs | Présents (non secrets) |

## Règles vérifiées

| Règle | Statut |
|-------|--------|
| Pas de clé serveur en `NEXT_PUBLIC_*` | OK |
| Client navigateur = anon/publishable | OK |
| Service role = admin-service / scripts | OK |
| Routes `/admin` via session + requireAdmin | OK |
| Rôles non modifiables côté client seul | OK |
| Messagerie : boîte propriétaire seulement | OK (API + RLS) |
| Avatars : signed URLs / bucket privé | OK |
| CyberPanel : pas de credentials frontend | OK |
| ZIP exclut `.env.local` / `.next` / `node_modules` | OK |

## Actions sensibles

- Invitations / createUser : service role serveur  
- Changement MDP : `updateUser` session utilisateur  
- Reset email : `resetPasswordForEmail` + journal sans secret  

## Risques résiduels

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| RLS mal configurée sur nouvelle table | Moyen | Migrations + tests RLS existants |
| MAIL_WEBMAIL_URL non renseigné | Faible | Doc Hostinger |
| Phase 2 IMAP non activée | N/A | Intentionnel |

## Verdict

**Aucun secret de production détecté dans le code suivi.** Apte au packaging ZIP.
