# Implémentation finale — responsive mobile-first Plateforme-AFD

Date : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`  
Commit cible : `fix: rebuild Plateforme-AFD public responsive experience`

## 1. Approche mobile-first

Styles et tokens définis d’abord pour téléphone ; `md` / `lg` / `xl` enrichissent le desktop validé.

## 2. Responsive par composant

Chaque widget (stats, domaines, programmes, terrain, news, opportunités, CTAs) possède une variante mobile (rail / stack) distincte du layout desktop.

## 3. Container queries

- `CqCard` / `AdaptiveCard` (`@container/card`)
- Layouts : étroit (stack) · moyen (image latérale) · large (éditorial)
- `stackOnly` pour les rails

## 4. Breakpoints

320 → 430 (téléphone), 768 / 820 (tablette), 1024+ (desktop), 1200 (nav header).

## 5. Composants créés

`src/components/responsive/*`, `horizontal-rail-item`, `mobile-filters-sheet`, renforcements rails / AdaptiveCard.

## 6–18. Sections

Header mobile, Hero dédié (carte 80 % en flux), stats/domaines/programmes/terrain/actualités/opportunités/CTA en rails, RDC tactile, newsletter stack, footer 4 accordéons, partenaires grille 2 col.

## 19. Pages internes

Filtres drawer (opportunités, documents), `PageHero` clamp, formulaires `text-base` / `min-h-[50px]`, shell `MobileContentShell`.

## 20–22. Rails, images, formulaires

Snap + indicateur ; `sizes` adaptés ; anti-zoom iOS.

## 23. Accessibilité

Zones 44 px, drawer Escape, rails `aria-label`, reduced motion, focus visible.

## 24–25. Tests & captures

Voir `tests/e2e/full-public-mobile-responsive.spec.ts`, `mobile-navigation`, `mobile-forms`, `mobile-overflow`, `MOBILE_VISUAL_COMPARISON.md`.

## 26–28. Validation

- typecheck : OK  
- lint (fichiers responsive/mobile) : OK  
- build : OK  
- e2e mobile-390 + desktop-1440 (navigation, forms, rails, full-public) : OK  
- e2e overflow 11 routes @ 390px : **11 passed**

## 29. Limites

- Maquette PNG = référence desktop ; composition téléphone = rails premium.
- Toutes les listes admin hors scope.
- PDF iframes restent en `70vh` scrollable.
