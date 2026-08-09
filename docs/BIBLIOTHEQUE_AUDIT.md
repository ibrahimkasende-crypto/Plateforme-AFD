# Audit — Bibliothèque institutionnelle AFD

**Date :** 2026-08-04  
**Projet :** `D:\Plateforme-AFD\AFD`  
**Branche de référence :** `fix/final-dashboard-and-hostinger`

---

## 1. Cause exacte de l’absence initiale

La bibliothèque **existait déjà en code** (`/bibliotheque` HTTP 200) mais n’était **pas perçue comme module visible** pour trois raisons cumulées :

1. **Navigation** — le lien était surtout sous le menu **Ressources** (dropdown), pas un item top-level évident pour tous les visiteurs.
2. **Base de données** — les tables `bibliotheque_*` n’étaient pas présentes / peuplées sur le projet Supabase actif ; le site s’appuyait sur un **catalogue JSON local** (14 activités), invisible côté admin “vivant”.
3. **Périmètre incomplet** — photothèque, vidéothèque, rapports/documents sous `/bibliotheque/*`, hubs domaines/projets/provinces et sous-pages admin absents → impression d’un module “non livré”.

**Statut actuel (post-corrections partielles déjà en place) :**
- Lien top-level **Bibliothèque** dans `public-navigation.ts`
- Footer + sitemap + menu mobile connectés
- Seed Supabase : 14 événements / 316 images
- Routes cœur : `/bibliotheque`, `/[slug]`, `/archives`

---

## 2. Inventaire détaillé

| Élément | Statut | Notes |
|--------|--------|-------|
| `/bibliotheque` | **existe** | Hub partiel |
| `/bibliotheque/[slug]` | **existe** | Détail + galerie |
| `/bibliotheque/archives` | **existe** | Partiel |
| `/bibliotheque/phototheque` | **n’existe pas** | → à créer |
| `/bibliotheque/videotheque` | **n’existe pas** | → à créer |
| `/bibliotheque/rapports` | **n’existe pas** | Contenu ailleurs : `/impact/rapports` |
| `/bibliotheque/documents` | **n’existe pas** | Contenu ailleurs : `/ressources/documents` |
| `/bibliotheque/domaines/[slug]` | **n’existe pas** | Filtre `?categorie=` à la place |
| `/bibliotheque/projets/[slug]` | **n’existe pas** | |
| `/bibliotheque/provinces/[slug]` | **n’existe pas** | Filtre `?province=` partiel |
| Nav desktop / mobile / footer | **connecté** | Top-level + Ressources |
| Sitemap | **partiel** | `/bibliotheque` + archives ; slugs dynamiques incomplets |
| Recherche globale site | **partiel** | Formulaire bibliothèque local |
| Composants UI | **partiel** | 5 composants `library-*` |
| Config + catalog JSON | **existe** | 14 activités, 26 catégories |
| Queries publiques | **existe** | Supabase + fallback catalog |
| Tables `bibliotheque_evenements` / `_images` | **existe** | Migrations 20260803 + 20260804 |
| Schéma `library_*` (brief) | **n’existe pas** | Réutiliser / consolider `bibliotheque_*` |
| RLS | **existe** | Lecture publique publiée uniquement |
| Admin `/admin/bibliotheque` | **partiel** | Liste seule |
| Admin CRUD | **partiellement** | Via `/admin/publications/archives` |
| Admin import | **n’existe pas** | Script seed CLI seulement |
| Lien domaines d’intervention | **non connecté** | |
| Lien actualités | **non connecté** | |
| OrganizationLogo circulaire | **existe** | À généraliser |
| Tests e2e library | **n’existe pas** | |
| `docs/BIBLIOTHEQUE_AUDIT.md` | **créé** | Ce fichier |

---

## 3. Fichiers clés existants

```
src/app/(public)/bibliotheque/page.tsx
src/app/(public)/bibliotheque/[slug]/page.tsx
src/app/(public)/bibliotheque/archives/page.tsx
src/app/admin/bibliotheque/page.tsx
src/components/public/bibliotheque/library-*.tsx
src/config/bibliotheque.ts
src/config/bibliotheque-catalog.json
src/config/public-navigation.ts
src/lib/queries/public/bibliotheque.ts
supabase/migrations/20260803_002_event_image_archive_library.sql
supabase/migrations/20260804_010_bibliotheque_institutionnelle.sql
scripts/generate-bibliotheque-catalog.mjs
scripts/seed-bibliotheque-from-catalog.mjs
src/components/branding/organization-logo.tsx
```

---

## 4. Plan de correction (immédiat)

1. Créer toutes les routes publiques manquantes (données réelles / vides propres).
2. Enrichir le hub (stats dynamiques, sections, liens).
3. Brancher domaines → activités bibliothèque.
4. Étendre admin `/admin/bibliotheque/*` + page import.
5. Consolider schéma (vues / tables complémentaires sans casser `bibliotheque_*`).
6. Tests e2e + validation build.
7. Rapport final `docs/BIBLIOTHEQUE_IMPLEMENTATION_FINAL_REPORT.md`.
