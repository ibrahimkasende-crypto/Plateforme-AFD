# Comparaison visuelle mobile — Plateforme-AFD

Référence : `docs/references/maquette-mobile-afd.png`  
Date : 2026-07-18  

> Note : la maquette fournie décrit surtout la composition desktop ; l’adaptation téléphone suit le brief « responsive par composant » (rails + container queries) plutôt qu’une réduction de cette grille.

## Sections

| Section | Maquette / intention | Implémentation mobile | Écart restant |
|---------|----------------------|------------------------|---------------|
| Header | Logo + CTAs + nav | Logo + Soutenir + hamburger `<1200px` | OK |
| Hero | Image + H1 + CTAs + carte 80 % | Composition dédiée, carte dans le flux, focal `65%` | OK |
| Stats | Bandeau 6 colonnes | Rail snap 78–86 vw + indicateur | OK (rail vs bandeau) |
| Domaines | Grille 6 | Rail cartes éditoriales | OK |
| Programmes | 4 cartes | Rail horizontal | OK |
| Terrain | Bento | Rail + AdaptiveCard | OK |
| RDC | Carte | Pleine largeur + fiche tactile | OK |
| Histoires | Split | Carte verticale 4:3 / 4:5 | Via bannière + composant dédié |
| Actualités | 3 cartes | Rail | OK |
| Newsletter | Bandeau | Carte stack + champs 16px | OK |
| CTA fin | 4 colonnes | Rail « Agir avec l’AFD » | OK |
| Footer | Colonnes | Accordéons Liens / Actions / Ressources / Nous rejoindre | OK |

## Captures

Les captures pleine page temporaires ne sont pas versionnées (poids). Contrôle manuel recommandé aux largeurs 320 / 375 / 390 / 430 / 768 / 1440.

## Corrections appliquées suite comparaison

- Tokens CSS `--mobile-gutter`, `--text-*`, `--section-space-mobile`
- Kit `src/components/responsive/*`
- Rails + `AdaptiveCard` (layouts CQ)
- Filtres en drawer mobile
- Hero focal téléphone / tablette / desktop

