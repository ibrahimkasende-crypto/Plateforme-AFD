# Performance — avant / après (mesures réelles)

**Date :** 2026-08-06

## Mesures obtenues

| Métrique | Avant (constat) | Après (code) | Source |
|----------|-----------------|--------------|--------|
| `touch-action` rails | `pan-x` seul | `pan-x pan-y` | `globals.css` |
| Capture pointeur ImpactBanner | Immédiate | Seuil axe 10px | `impact-image-banner.tsx` |
| Body lock lightbox / menu / loader | Partiel / manuel | Hook partagé | `use-body-scroll-lock.ts` |
| Galerie images initiales | Toutes | 8 mobile / 12 desktop | `library-masonry-gallery.tsx` |
| Hero animation | Statique 3 lignes | Typewriter 3 lignes | `typewriter-heading.tsx` |
| remotePatterns images | Wildcard `*.supabase.co` | Projet `mxxux…` uniquement | `next.config.ts` |

## Non mesuré ici (à compléter en labo Lighthouse)

- LCP / CLS / INP chiffrés
- Poids total images réseau
- Taille bundle JS

Ces métriques nécessitent un run Lighthouse local ou Hostinger après redéploiement.
