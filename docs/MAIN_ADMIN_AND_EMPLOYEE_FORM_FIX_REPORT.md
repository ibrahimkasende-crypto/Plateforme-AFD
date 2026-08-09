# Rapport — Correction formulaire employé + Administrateur principal

Date : 2026-08-04

## 1. Cause de l’absence de photo

Le formulaire `/admin/rh/personnel/nouveau` était un formulaire RH minimal (prénom, nom, e-mail, etc.) **sans** composant d’upload photo, alors que `hr_employes` supportait déjà `avatar_bucket` / `avatar_path`.

## 2. Photo ajoutée au formulaire employé

Composant `ProfilePhotoPicker` :
- bouton « Ajouter une photo »
- drag & drop
- aperçu circulaire (`aspect-square rounded-full object-cover`)
- recadrage carré + compression JPEG
- remplacement / suppression avant envoi
- formats JPG/PNG/WebP, max 5 Mo
- fallback initiales

## 3. Bucket utilisé

- Employés sans / avec compte : bucket **`hr-private`**, chemin `employees/{employee_id}/profile.{ext}`
- Administrateur principal : bucket **`admin-avatars`**, chemin `{user_id}/processed/avatar.{ext}`
- Bucket optionnel `profile-photos` créé en migration (privé)

URLs signées côté serveur.

## 4. Formulaire employé corrigé

Sections :
1. Photo et identité  
2. Contact  
3. Informations professionnelles  
4. Compte d’accès (conditionnel)

Alias : `/admin/employes/nouveau` → `/admin/rh/personnel/nouveau`

## 5. Création avec ou sans compte

Checkbox **« Créer également un compte d’accès à la plateforme »** :

| Option | Comportement |
|--------|----------------|
| Off | Fiche `hr_employes` uniquement — pas d’Auth, pas d’invitation |
| On | Fiche + invitation (`inviteAdministrator`) + liaison `user_id` / `employe_id` |

Boutons dynamiques : « Créer l’employé » / « Créer l’employé et envoyer l’invitation ».

## 6. Route Administrateur principal

Déjà présente, **améliorée** :
- `/admin/administrateur-principal`
- `/admin/administrateur-principal/creer` (formulaire complet + photo)
- historique / modifier

## 7. Menu ajouté / corrigé

Lien **Administrateur principal** déplacé dans le groupe **Administration** (icône `ShieldCheck`), visible **uniquement** pour :
`super_admin` · `platform_owner` · `tenant_super_admin`

(via `rolesOnly` + passage de `viewer.roles` à la sidebar).

## 8. Formulaire Administrateur principal

Formulaire dédié distinct de l’employé : photo, identité, contact, pro, accès avec rôle **imposé** `admin_principal`.

## 9. Invitation sécurisée

`createPrincipalAdminAction` (serveur) :
1. vérifie Super Admin  
2. `assertCanCreatePrincipal`  
3. `inviteAdministrator`  
4. enrichit le profil  
5. upload photo  
6. statut `invited`

## 10. Contrainte un seul principal actif

Conservée : trigger SQL + `assertCanCreatePrincipal` + redirect UI.

## 11. Permissions

Inchangées / consolidées : l’admin principal crée agents via utilisateurs / employés ; ne peut pas créer `super_admin` ni un second principal.

## 12. Tests

Specs ajoutés/mis à jour :
- `employee-profile-photo.spec.ts`
- `employee-create-without-account.spec.ts`
- `employee-create-with-account.spec.ts`
- `super-admin-main-admin-page.spec.ts`
- `super-admin-create-main-admin.spec.ts`
- `main-admin-single-active.spec.ts`
- `main-admin-invitation.spec.ts`
- `main-admin-permissions.spec.ts` (existant)

## 13–15. Validation

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | OK |
| `npm run lint` | OK (0 erreur, warnings préexistants) |
| `npm run test` | OK — 51 passed |
| `npm run build` | OK |

## 16. Problèmes restants

- Appliquer manuellement `supabase/migrations/20260804_050_employee_photo_and_fields.sql` si les colonnes étendues ne sont pas encore en base (`pg` n’est plus dans les dépendances npm locales).
- Les e2e live nécessitent `AFD_E2E_ADMIN_*` et un compte `super_admin`.
- Crop interactif avancé (poignées) non inclus : recadrage carré automatique au centre.

## Confirmation

- Photo visible dans le formulaire employé  
- Upload opérationnel (Service Role / hr-private)  
- Menu Administrateur principal visible pour Super Admin  
- Route `/admin/administrateur-principal` fonctionnelle  
- Création + invitation du principal côté serveur  
- Unicité du principal actif  
- Build réussi  
