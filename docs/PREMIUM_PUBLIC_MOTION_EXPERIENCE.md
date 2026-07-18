# Expérience motion premium — site public AFD

## 1. Ancien effet supprimé

- Composant `AfdCursor` retiré
- Styles `html.afd-custom-cursor` retirés de `globals.css`
- Curseur système natif conservé

## 2–4. Effet liquide

- Technologie : **Three.js** + **@react-three/fiber** + shader GLSL léger
- Fichiers : `src/components/effects/water-ripple/*`, `water-ripple-overlay.tsx`
- Plan plein écran transparent, `pointer-events: none`, `aria-hidden`
- Ondes radiales + reflets blancs faibles (pas de teinte bleue opaque)

## 5. Conditions d’activation

- Feature flag `NEXT_PUBLIC_ENABLE_WATER_RIPPLE`
- `(pointer: fine)` + `(hover: hover)`
- Largeur ≥ 1024 px
- Pas de `prefers-reduced-motion`
- Hors `/admin`, auth, paiements
- WebGL disponible ; sinon fallback Canvas 2D
- Désactivé si `saveData`

## 6. Fallback

`WaterRippleFallback` — anneau blanc transparent, dissipation ~720 ms.

## 7. Optimisations

- Dynamic import `ssr: false`
- Error boundary locale
- DPR max 1,5
- Dissipation puis arrêt de la boucle utile
- Pause si onglet caché

## 8–11. Animations de sections

Composants dans `src/components/motion/` :

`AnimatedSection`, `SectionReveal`, `SectionTransition`, `StaggerContainer`, `StaggerItem`, `SplitReveal`, `MaskReveal`, `ImageReveal`, `ParallaxMedia`, `MotionHeading`

Variantes : fade-up, soft-scale, slide-left/right, mask-up, parallax-soft, stagger, split.

## 12. Séparateurs

`SectionDivider` : wave-soft, curve, diagonal, line, none  
`SectionBridge` : chevauchement léger

## 13. Rails mobiles

`HorizontalCardRail` + indicateur compteur / flèches  
Sections : stats, domaines, actualités (home/grid), opportunités

## 14. Reduced motion / a11y

- Wrappers affichent le contenu immédiatement
- Rails focusables + boutons 44 px
- Canvas `aria-hidden`

## 15. Validation

- typecheck : OK
- lint : 0 erreur sur `src/components/effects` (warnings préexistants ailleurs)
- build : OK
- e2e dédiés (desktop-1440 + mobile-390) : **16 passed**

## Limites restantes

- Réfraction réelle du DOM non capturée (simulation visuelle uniquement — volontaire pour la perf)
- Parallaxe limitée au composant `ParallaxMedia` (non appliquée partout)
- Certains modules admin restent hors scope
