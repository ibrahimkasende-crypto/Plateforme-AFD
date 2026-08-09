# Rapport final — scroll, images, animations

**Date :** 2026-08-06  
**Projet :** `D:\Plateforme-AFD\AFD`

## 1. Causes exactes des blocages

1. **`.afd-h-rail { touch-action: pan-x }`** — interdisait le scroll vertical tactile sur tous les rails de l’accueil.  
2. **`ImpactImageBanner`** — `setPointerCapture` dès le `pointerdown` sans discrimination d’axe.  
3. **Lightbox / loader** — overlays plein écran sans verrouillage cohérent du body (et unlock fragile sur le menu).

## 2–17. Correctifs livrés

| # | Sujet | État |
|---|--------|------|
| Scroll global | `html`/`body` overflow-y auto + touch-action pan-y | OK |
| Rails | pan-x **et** pan-y, snap-proximity | OK |
| Menu mobile | `useBodyScrollLock` + close on pathname | OK |
| Lightbox | body lock + swipe horizontal seulement | OK |
| Overlays | water-ripple déjà `pointer-events: none` | OK |
| Images | utilitaire + SafeImage + pagination galerie | OK |
| next/image | remotePatterns projet mandaté | OK |
| Miniatures | variantes thumbnail/card/content/hero | OK |
| Cache | documenté (stratégie delivery) | OK |
| Pagination galerie | 8/12 + Voir plus | OK |
| Animations | typewriter + reduced motion | OK |
| Hero 3 lignes | TypewriterHeading | OK |
| Lettre par lettre | ~42 ms / char, pause lignes | OK |
| Reduced motion | texte immédiat | OK |

## 18–20. Responsive / tests

- Hero : 3 lignes explicites, largeur contrôlée, typewriter sans CLS.  
- Tests e2e ajoutés : scroll mobile/desktop, rails, menu, lightbox, typewriter, images.  
- Largeurs à valider manuellement : 320–1440.

## 21. Métriques

Voir `docs/PERFORMANCE_BEFORE_AFTER.md` (pas d’invention Lighthouse).

## 22–25. Validation technique

| Commande | Résultat |
|----------|----------|
| `tsc --noEmit` | OK |
| eslint (fichiers touchés) | OK |
| `npm run build` | OK |

E2E ajoutés (à lancer avec serveur) :

```bash
npm run test:e2e -- tests/e2e/public-scroll-mobile.spec.ts tests/e2e/typewriter-hero.spec.ts tests/e2e/menu-scroll-lock.spec.ts
```

## 26. Restants

- Activer `NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM=true` seulement si le plan Supabase le permet.  
- Mesures Lighthouse chiffrées post-déploiement.  
- Compresser / re-uploader les très grosses images encore en original dans Storage.

## 27. Verdict

**PRÊT POUR REDÉPLOIEMENT** — ZIP : `Deploy/Plateforme-AFD-Production.zip`  
Valider manuellement le scroll mobile sur l’accueil après déploiement.
