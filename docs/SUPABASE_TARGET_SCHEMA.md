# Schéma Supabase cible — Plateforme-AFD

**Principe :** proposition **non destructive**. Aucune table existante ne doit être détruite. Aucun `supabase db reset`. Aucune migration déjà appliquée ne doit être modifiée.

## Tables existantes (types / distant)

| Table existante | Usage actuel |
|-----------------|--------------|
| `programmes` | Programmes |
| `projets` | Projets |
| `actualites` | Actualités |
| `galerie` | Médiathèque (images) |
| `membres_equipe` | Équipe |
| `partenaires` | Partenaires |
| `clusters` | Clusters |
| `membres` | Adhésions (historique) |
| `dons` | Dons (schéma partiel / conflictuel) |
| `messages` | Contact |
| `parametres_site` | Paramètres |
| `administrateurs` | Admin legacy |
| `profils_administrateurs` | RBAC (migration phase 4) |
| `roles` | RBAC |
| `permissions` | RBAC |
| `roles_permissions` | RBAC |
| `utilisateurs_roles` | RBAC |

## Correspondance cible

| Table cible | Existant | Action proposée | Colonnes manquantes / notes | Risque |
|-------------|----------|-----------------|-----------------------------|--------|
| `programmes` | Oui | Conserver + enrichir | secteurs, statut, slug (vérifier) | Faible |
| `projets` | Oui | Conserver + enrichir | `programme_id`, statut, budget | Moyen |
| `activites` | Non | Créer nouvelle | activité liée projet | Faible |
| `indicateurs` | Non | Créer nouvelle | MEAL | Faible |
| `statistiques_beneficiaires` | Non | Créer nouvelle | séries temporelles | Faible |
| `provinces` | Non | Créer nouvelle | référentiel geo | Faible |
| `membres_equipe` | Oui | Conserver | département_id | Faible |
| `departements` | Non | Créer nouvelle | org chart | Faible |
| `actualites` | Oui | Conserver | — | Faible |
| `medias` | Partiel (`galerie`) | Mapper `galerie` → vue/alias ou migration soft rename | type média, alt | Moyen (rename) |
| `documents` | Non | Créer nouvelle | docs institutionnels | Faible |
| `partenaires` | Oui | Conserver | — | Faible |
| `clusters` | Oui | Conserver | — | Faible |
| `histoires_impact` | Non | Créer nouvelle | — | Faible |
| `temoignages` | Non | Créer nouvelle | — | Faible |
| `abonnes_newsletter` | Non | Créer nouvelle | consentement, token | Faible |
| `segments_newsletter` | Non | Créer nouvelle | — | Faible |
| `campagnes_newsletter` | Non | Créer nouvelle | — | Faible |
| `envois_newsletter` | Non | Créer nouvelle | — | Faible |
| `statistiques_newsletter` | Non | Créer nouvelle | — | Faible |
| `messages_contact` | Partiel (`messages`) | Conserver `messages` ou vue | — | Faible |
| `demandes_adhesion` | Partiel (`membres`) | Auditer `membres` avant split | — | Moyen |
| `demandes_partenariat` | Non | Créer nouvelle | — | Faible |
| `intentions_don` | Partiel (`dons`) | **Ne pas écraser `dons`** ; créer `intentions_don` | séparation intention / paiement | Moyen |
| `transactions_paiement` | Non | Créer nouvelle | provider, webhook_verified | Moyen |
| `rapports` | Non | Créer nouvelle | — | Faible |
| `modeles_rapports` | Non | Créer nouvelle | — | Faible |
| `utilisateurs_roles` | Oui (phase 4) | Conserver | sync types | Faible |
| `roles` | Oui | Conserver + aligner codes métiers | codes listés dans `src/config/roles.ts` | Moyen |
| `permissions` | Oui | Conserver + enrichir | codes `src/config/permissions.ts` | Moyen |
| `journal_activite` | Non | Créer nouvelle | audit | Faible |
| `parametres_site` | Oui | Conserver | — | Faible |

## Points d’attention

1. **`dons`** : écart historique de colonnes (`donor_name` vs `first_name`…). Créer `intentions_don` + `transactions_paiement` plutôt que de casser `dons`.
2. **`galerie` vs `medias`** : préférer une migration additive (colonnes) avant un rename.
3. **RBAC** : régénérer `database.types.ts` après validation du schéma distant.
4. Toutes les nouvelles tables doivent inclure RLS dès la migration.

## Prochaine étape schéma

Rédiger des migrations **additives** numérotées (après audit live `supabase db pull`) — hors de cette phase d’alignement code.

