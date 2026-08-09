# Flux d’invitation utilisateur

## Étapes

1. Administrateur remplit le formulaire (principal ou wizard agent).
2. Serveur vérifie `canAssignRole` + permissions.
3. Si `admin_principal` : `assertCanCreatePrincipal` (unicité).
4. `auth.admin.inviteUserByEmail` (Service Role).
5. Upsert `profils_administrateurs` avec `statut_compte = invited`.
6. Attribution `utilisateurs_roles`.
7. Insert `admin_invitations` (expiration **7 jours**).
8. Audit `users.invite`.
9. E-mail Supabase → lien → `/auth/callback?next=/nouveau-mot-de-passe`.
10. L’utilisateur définit son mot de passe → compte `active`.

## Cas d’erreur

| Cas | Comportement |
|-----|--------------|
| Service Role manquant | Invitation indisponible (message UI) |
| Principal déjà actif | Erreur / redirect |
| Rôle non autorisé | Refus serveur |
| E-mail déjà utilisé | Erreur invite Supabase |
| Invitation expirée | Lien invalide (renvoi possible) |
| Compte suspendu | Connexion bloquée (`actif=false`) |

## Interdit

Envoyer un mot de passe en clair ou le définir côté admin pour un tiers.
