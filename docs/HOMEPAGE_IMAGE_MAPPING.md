# Mapping images — page d’accueil AFD

## Hero

| Élément | Valeur |
|---------|--------|
| Actif | `/assets/home/Femmes_AFD.png` (déjà validé) |
| Candidat | `/images/afd/home/hero-afd.webp` |
| Point focal candidat | `68% center` |

## Programmes prioritaires

| Programme | Fichier |
|-----------|---------|
| Autonomisation économique | `/images/afd/programmes/autonomisation-economique.webp` |
| Santé / nutrition | `/images/afd/programmes/sante-nutrition.webp` |
| WASH | `/images/afd/programmes/wash.webp` |
| Protection | `/images/afd/programmes/protection-droits-femmes.webp` |

Manifeste : `src/config/afd-images.ts`

## Actions terrain

- `/images/afd/actions-terrain/action-terrain-01.webp`
- `/images/afd/actions-terrain/action-terrain-02.webp`
- `/images/afd/actions-terrain/action-terrain-03.webp`

Composant : `FieldActions` — mention « Illustration d’une activité AFD » (pas de province inventée).

## Actualités

Images prêtes : `actualite-01/02/03.webp`.  
Affichage conditionné aux actualités Supabase ; pas d’événements inventés présentés comme réels.

## Histoire d’impact

`/images/afd/impact/histoire-principale.webp`  
Texte neutre si aucune histoire publiée — pas de faux nom / citation.

## Provinces

Aucune association province ↔ photo confirmée à partir des métadonnées disponibles.  
Dossier `public/images/afd/provinces/` réservé pour localisations vérifiées.

## Démo carte

`src/config/demo-data/intervention-zones.ts` + `NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true`  
Badge « Données de démonstration » obligatoire.
