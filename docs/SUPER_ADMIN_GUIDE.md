# Guide Super Administrateur

## Mission

Vous êtes le propriétaire de l’administration de la plateforme AFD.  
Vous créez **une seule fois** l’Administrateur principal, qui gère ensuite les agents.

## Écrans

| Route | Usage |
|-------|--------|
| `/admin/administrateur-principal` | Voir le principal actif, suspendre |
| `/admin/administrateur-principal/creer` | Inviter le principal (si aucun actif) |
| `/admin/administrateur-principal/modifier` | Accès à la fiche |
| `/admin/administrateur-principal/historique` | Historique des changements |

## Créer l’Administrateur principal

1. Connectez-vous avec MFA si exigé.
2. Ouvrez **Administrateur principal** → **Créer**.
3. Saisissez nom, e-mail professionnel, fonction, justification.
4. Envoyez l’invitation (aucun mot de passe à définir).
5. La personne active son compte via le lien e-mail.

## Remplacement

1. Suspendre l’ancien principal (justification obligatoire) → sessions révoquées.
2. Créer le nouveau via `/creer`.
3. L’historique est conservé dans `admin_principal_history`.

## Ce que vous ne devez pas faire au quotidien

Créer tous les agents AFD — délèguez à l’Administrateur principal (`/admin/utilisateurs`).
