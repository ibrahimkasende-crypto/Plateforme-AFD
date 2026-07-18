# Cartes — Plateforme-AFD

## `rdc-provinces.svg`

Carte SVG des **26 provinces** de la République démocratique du Congo.

- **Source :** [Simplemaps.com](https://simplemaps.com/svg/country/cd)
- **Licence :** libre pour usage commercial et personnel  
  ([conditions](https://simplemaps.com/resources/svg-license))
- **Attribution :** Simplemaps.com (mentionnée sous la carte interactive)

Chaque province est un `<path>` distinct avec :

- `id` stable (`CDKN`, `CDSK`, …)
- `name` (libellé officiel)

Les chemins sont également extraits vers  
`src/features/intervention-zones/data/rdc-province-paths.ts`  
via `node scripts/extract-rdc-paths.mjs`.
