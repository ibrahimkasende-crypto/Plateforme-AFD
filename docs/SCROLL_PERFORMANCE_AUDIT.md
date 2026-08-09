# Audit scroll & performance — Plateforme-AFD

**Date :** 2026-08-06  
**Périmètre :** site public (`src/components/public`, `mobile`, `effects`, `globals.css`)

## Problèmes critiques corrigés

| Fichier | Composant | Cause | Impact mobile | Impact desktop | Correction | Test |
|---------|-----------|-------|---------------|----------------|------------|------|
| `src/app/globals.css` | `.afd-h-rail` | `touch-action: pan-x` bloquait le pan vertical | Scroll page coincé sur les rails | Faible | `pan-x pan-y pinch-zoom` + overscroll | Swipe vertical sur rail accueil |
| `src/components/public/home/impact-image-banner.tsx` | `ImpactImageBanner` | `setPointerCapture` immédiat + `touch-pan-x` | Swipe vertical capturé | Molette OK | Seuil d’axe Δx/Δy avant capture | Drag vertical vs horizontal |
| `src/components/mobile/horizontal-card-rail.tsx` | `HorizontalCardRail` | `snap-mandatory` trop agressif | Accrochage scroll | N/A (grid md+) | `snap-proximity` + `overflow-y-visible` | Rails projets/programmes |
| `src/components/public/bibliotheque/library-masonry-gallery.tsx` | Lightbox | Pas de body lock | Scroll fond | Scroll fond | `useBodyScrollLock` | Ouvrir/fermer lightbox |
| `src/components/shared/app-entry-loader.tsx` | Loader entrée | Overlay sans lock | Scroll derrière | Idem | `useBodyScrollLock` | Premier chargement |
| `src/components/public/mobile-navigation.tsx` | Menu mobile | setState pendant render + lock manuel | Unlock fragile | N/A | Hook partagé + close via `useEffect(pathname)` | Ouvrir/fermer/naviguer |
| `src/components/mobile/mobile-filters-sheet.tsx` | Filtres | Lock manuel | Idem | N/A | `useBodyScrollLock` | Drawer documents |

## Non-problèmes confirmés

- Water ripple : `pointer-events: none`, desktop only (`PublicEffectsLayer`)
- Pas de Lenis / Locomotive / ScrollTrigger
- Listeners scroll publics en `passive: true`
- Layout public sans `h-screen overflow-hidden` global

## Hook central

`src/hooks/use-body-scroll-lock.ts` — compteur partagé, restaure overflow + padding scrollbar.
