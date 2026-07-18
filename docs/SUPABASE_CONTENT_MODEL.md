# Modèle de contenu Supabase AFD

## Contenu éditorial

| Table | Usage |
|---|---|
| `pages` | Pages CMS (route, SEO, statut) |
| `sections_pages` | Blocs ordonnés |
| `actualites` | Actualités |
| `histoires_impact` | Récits d’impact |
| `temoignages` | Témoignages |
| `domaines_intervention` | Domaines |
| `programmes` / `projets` | Programmes & projets |
| `zones_intervention` | Carte provinces |
| `chiffres_impact` | Indicateurs validés |
| `medias` | Métadonnées médiathèque |
| `documents` | Bibliothèque documentaire |
| `appels_offres` | Appels d’offres |
| `appels_offres_documents` | Pièces AO |
| `opportunites` / `candidatures` | RH |
| `partenaires` | Partenaires |

## Opérations & enquêtes

| Table | Usage |
|---|---|
| `agents_terrain` | Agents |
| `enquetes` | Définition enquête |
| `questions_enquete` / `options_questions` | Structure |
| `reponses_enquete` / `reponses_questions` | Collecte |

## Buckets Storage (existants / attendus)

- `gallery` / médias publics
- documents publics
- bucket privé candidatures (CV)

Ne jamais exposer `service_role` côté navigateur.
