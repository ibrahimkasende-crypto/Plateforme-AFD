# Audit — Domaines d’intervention & Actualités

**Date :** 18 juillet 2026  
**Projet :** `D:\Plateforme-AFD\AFD`

## 1. Contenus déjà présents

| Section | Source | État |
|---------|--------|------|
| 6 piliers home | `homeContent.pillars` | Hardcodé (titres partiellement alignés) |
| Page domaines | `/actions/domaines-intervention` | Liste plates des piliers |
| Actualités home | Supabase `actualites` | Dynamique si publiées, sinon vide |
| Actualités liste/détail | Supabase | Dynamique |
| Histoire d’impact | Table absente | Placeholder institutionnel |

## 2. Contenu Supabase

- `actualites` : titre, excerpt, content, image_url, category, published, published_at
- `programmes` / `projets` : liés indirectement
- Pas de table `domaines_intervention` ni `medias` dédiée

## 3. Hardcodé

- `home-content.ts` (pillars, publishedImpactStats)
- `afd-images.ts` (chemins webp obsolètes vs JPG réels)
- `demo-data/intervention-zones.ts`

## 4. Sujets manquants vs afd-rdc.org

- Santé maternelle et infantile (séparée de WASH)
- WASH distinct
- Urgences / populations déplacées (formulation)
- 3 sujets actualités éditoriaux à migrer sans dates inventées

## 5. Doublons

- Piliers réexportés via `institutional-content.ts` (même source)
- Pas de doublon Supabase détecté (admin actualités encore placeholder)

## 6. Composants réutilisables

- `FadeIn`, `Section`, `PublicEntityCard`, `EmptyState`
- Footer accordion (pattern aria-expanded)
- Pas de Collapsible Radix avant cette phase

## 7–8. Typo / disposition

- Cartes piliers trop compactes
- Pas de dépliable accessible
- Manifeste images désaligné des JPG

## 9. Plan

1. Structure éditoriale domaines + UI dépliable  
2. Actualités migrées locales + UI moderne (fallback si Supabase vide)  
3. Alignement images JPG  
4. Socle Studio / medias Supabase (migration non destructive)

