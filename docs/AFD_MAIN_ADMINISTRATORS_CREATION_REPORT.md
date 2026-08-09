# Rapport — Création des administrateurs principaux AFD

Date : 2026-08-04  
Projet Supabase : `mxxuxnoqnwjygawvvhcb`  
**Aucun mot de passe n’est consigné dans ce document.**

## 1. Compte Christian Sebo

- **Statut Auth :** créé
- **E-mail :** contactafdrdc@gmail.com
- **User id :** `93d05e76-7fc0-4b90-8b1c-ecdd50c56270`

## 2. Profil Christian

- Créé / mis à jour dans `profils_administrateurs`
- Prénom / nom / display_name / téléphone / fonction enregistrés
- `statut_compte = active`
- `must_change_password = true`

## 3. Rôle Direction

- Rôle applicatif : `admin_principal_direction`
- Libellé : Administrateur principal — Direction

## 4. Compte Esther Makadi

- **Statut Auth :** créé
- **E-mail :** esthermakadi6@gmail.com
- **User id :** `0ad19ee2-e980-4837-b331-5584e3e115be`

## 5. Profil Esther

- Créé / mis à jour dans `profils_administrateurs`
- Prénom / nom / display_name / téléphone / fonction enregistrés
- `statut_compte = active`
- `must_change_password = true`

## 6. Rôle IT

- Rôle applicatif : `admin_principal_it`
- Libellé : Administratrice principale — IT

## 7. Changement obligatoire

- Colonnes : `must_change_password`, `password_changed_at`, `temporary_password_issued_at`
- Activé à `true` pour les deux comptes
- Garde dans `requireAdmin` + redirection post-login

## 8. Page de changement

- Route : `/admin/securite/changer-mot-de-passe`
- Formulaire robustesse / règles / affichage-masquage

## 9. Modification volontaire

- Route : `/admin/mon-profil/securite`
- Lien depuis Mon profil → Sécurité

## 10. Mot de passe oublié

- `/mot-de-passe-oublie`
- `/auth/reset-password` (URL à configurer aussi dans Supabase Auth)

## 11. Permissions

- Matrice : `docs/AFD_MAIN_ADMINISTRATORS_PERMISSION_MATRIX.md`
- Matrices TS : `admin_principal_direction` / `admin_principal_it`
- Gardes : interdiction `super_admin` pour les principaux

## 12. RLS / unicité

- Migration `20260804_070_afd_main_administrators.sql` appliquée
- Trigger : un Direction + un IT (plus un seul principal global)
- `super_admin` reste unique

## 13. Photos

- Aucune photo inventée
- Avatars initiales CS / EM via profil / header
- Upload possible depuis Mon profil

## 14. Tests

- Specs E2E ajoutées sous `tests/e2e/afd-main-admin*.spec.ts`
- Plusieurs cas skippés sans variables `AFD_E2E_*` (comportement attendu)

## 15. Typecheck

- `npm run typecheck` : **OK**

## 16. Lint

- `npm run lint` : **OK** (warnings préexistants React Hook Form uniquement)

## 17. Build

- `npm run build` : **OK**

## 18. Secrets absents du dépôt

- Mots de passe temporaires **absents** du Git (variables d’env uniquement)
- Noms de variables documentés dans `.env.example` sans valeurs
- Clé service role non exposée côté client

## 19. Problèmes restants / actions manuelles

1. Configurer dans Supabase Auth → URL redirect :
   - `https://afd-rdc.org/auth/reset-password`
   - `http://localhost:3000/auth/reset-password`
2. Chaque admin doit se connecter et changer son mot de passe temporaire.
3. Ne pas conserver les variables `AFD_*_TEMP_PASSWORD` après usage.
4. Exécuter `npm run test:e2e` avec credentials E2E dédiés si validation automatisée complète souhaitée.
5. Page legacy `/admin/administrateur-principal` conservée ; la référence est `/admin/administrateurs-principaux`.

## Script

```bash
npm run admin:create-afd-main -- --dry-run
npm run admin:create-afd-main -- --execute
```
