# Guide Administrateur principal

## Mission

Gérer au quotidien les comptes des agents AFD : invitation, rôles, suspension, consultations.

## Écrans

| Route | Usage |
|-------|--------|
| `/admin/utilisateurs` | Liste + filtres |
| `/admin/utilisateurs/nouveau` | Wizard d’invitation (5 étapes) |
| `/admin/utilisateurs/[id]` | Fiche à onglets |
| `/admin/utilisateurs/invitations` | Redirige vers `/admin/invitations` |
| `/admin/roles` | Matrice rôles |
| `/admin/permissions` | Référentiel permissions |

## Créer un agent

1. **Identité** — prénom, nom, postnom, sexe, matricule…
2. **Contact** — e-mail pro, téléphone, adresse…
3. **Professionnel** — fonction, type d’agent, affectation…
4. **Rôle et accès** — rôle autorisé (jamais `super_admin`)
5. **Vérification** — résumé → envoi invitation

## Interdits

- Créer un `super_admin`
- Suspendre le Super Administrateur
- Modifier votre propre rôle
- Supprimer définitivement un compte (archivage / suspension uniquement)

## Suspension

Sur la fiche → onglet **Rôle et permissions** → décocher **Compte actif**.  
Les sessions Auth sont révoquées côté serveur.
