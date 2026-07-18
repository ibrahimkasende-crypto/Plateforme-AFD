# Opportunités et documents

## Checklist de déploiement

- [ ] Appliquer `20260718_006_opportunites_documents.sql`.
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

## Limites actuelles

Le formulaire enregistre les métadonnées de candidature. L’upload de CV est volontairement laissé désactivé tant qu’un parcours sécurisé vers le bucket privé n’est pas configuré.
