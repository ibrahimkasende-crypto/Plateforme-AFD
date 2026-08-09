# Stratégie de livraison des images Supabase — AFD

## Principes

1. **Bucket public** `afd-media` sur le projet `mxxuxnoqnwjygawvvhcb`.
2. **next/image** optimise toujours côté Hostinger (formats modernes, tailles).
3. **Transformations Storage** (`/render/image/public`) optionnelles via  
   `NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM=true` (plan Pro+).
4. URLs **signées** : jamais transformées (signature cassée sinon).

## Variantes (`src/lib/images/supabase-image.ts`)

| Variante | Largeur | Qualité | Usage |
|----------|---------|---------|--------|
| thumbnail | 320 | 70 | Miniatures listes |
| card | 640 | 75 | Cartes / rails |
| content | 960 | 80 | Contenu article |
| hero | 1600 | 82 | Hero / lightbox HD |

## Cache

- Upload public : `cacheControl: "3600"` (ou plus si image stable).
- Remplacement : nouveau nom ou query `?v=` pour invalider.
- CDN Supabase + cache navigateur ; pas d’invalidation globale forcée.

## Fallback

`SafeImage` (`src/components/media/safe-image.tsx`) : placeholder neutre si 404/403.

## Galeries

Chargement progressif (8 mobile / 12 desktop, +8) — HD seulement en lightbox.
