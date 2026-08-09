# Opportunités et documents

## Checklist de déploiement

- [ ] Appliquer `20260718_006_opportunites_documents.sql` puis `20260718_007_opportunites_documents_hardening.sql`.
- [ ] Vérifier que `public.set_updated_at()` et `public.is_active_admin()` existent (migration de sécurité préalable).
- [ ] Créer les buckets `candidatures-privees`, `documents-publics` et `documents-prives` si la migration n’a pas les droits Storage.
- [ ] Ne publier que des opportunités validées par l’AFD : aucune donnée illustrative ne doit être créée en production.
- [ ] Renseigner `NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS=true` uniquement après validation RH.
- [ ] Charger les fichiers publics dans `documents-publics` et enregistrer leur chemin dans `documents.fichier_storage_path`.
- [ ] Conserver les CV et pièces dans `candidatures-privees`; ne jamais fournir une URL publique.
- [ ] Régénérer `src/types/database.types.ts` depuis l’instance Supabase après application.
- [ ] Attribuer les permissions `opportunites:*`, `candidatures:*` et `documents:*` aux rôles autorisés dans Supabase et dans la matrice applicative.
- [ ] Tester les RLS anonyme, authentifié non-admin et administrateur.

## Comportement public

Les listes retournent un état vide lorsque Supabase est indisponible, que les tables n’existent pas ou qu’aucune donnée publiée n’est disponible. Les téléchargements passent par `/api/documents/[slug]/download`, qui vérifie publication et confidentialité avant de lire le bucket public.

## Écarts clôturés

- Les opportunités publiques sont filtrables, triables et paginées; les brouillons restent exclus.
- Les fiches affichent les informations publiques et les parcours formulaire, e-mail ou externe autorisés.
- Les candidatures collectent les informations complémentaires et déposent les CV/pièces PDF ou DOCX (5 Mo maximum) dans le bucket privé.
- Les administrateurs peuvent traiter les candidatures et obtenir des URL signées temporaires pour les CV.
- Les aperçus PDF publics restent accessibles via le contrôleur de téléchargement public.

## Éléments restant au déploiement

- Les politiques Storage de `candidatures-privees` doivent être appliquées sur l’instance Supabase avant d’activer les dépôts publics.
- Vérifier les RLS et les permissions avec les rôles réellement utilisés, puis régénérer `src/types/database.types.ts`.
- Les exports CSV et le téléchargement de pièces doivent être contrôlés dans l’environnement administrateur final.

## Validation technique (18 juillet 2026)

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | OK |
| `npm run lint` | OK (1 warning préexistant newsletter/react-hook-form) |
| `npm run build` | OK |
| `npx playwright test` (5 specs opportunités/documents) | OK — 30 passed |

Aucun push GitHub.

