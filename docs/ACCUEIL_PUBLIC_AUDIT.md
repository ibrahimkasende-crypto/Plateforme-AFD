# Audit page d’accueil publique — Plateforme-AFD

**Date :** 17 juillet 2026  
**Chemin :** `D:\Plateforme-AFD\AFD`

## 1. Sections déjà présentes

| Section | État |
|---------|------|
| Hero (PageHero générique) | Présent — placeholder fondation, pas le Hero premium |
| Liens Qui sommes-nous / Actions / Impact | Présents — cartes basiques |
| Domaines d’intervention | Présents — liste plate depuis `sectors.ts` |
| Valeurs, stats, programmes, projets, zones, histoires, actus, partenaires, newsletter, CTA | Absents |

## 2. Composants réutilisables

- `SiteContainer`, `Section`, `SectionHeading`, `FadeIn`
- `EmptyState`, `ContentSkeleton`, `StatCard`
- Header `SiteHeader` (ne pas modifier)
- Footer `PublicFooter` (à remplacer / améliorer en `site-footer`)
- Config `site.ts`, `public-navigation.ts`
- Clients Supabase SSR

## 3. Composants à améliorer

- Remplacer le Hero générique par un Hero photographique
- Remplacer la grille secteurs plate par 6 piliers éditoriaux
- Footer : logo, domaines, placeholders coordonnées, newsletter

## 4. Données déjà connectées à Supabase

Tables typées pertinentes : `programmes`, `projets`, `actualites`, `partenaires`, `galerie`, `clusters`.  
Aucune requête homepage n’est encore branchée.

## 5. Données encore statiques

- Textes de fondation sur `/`
- Liste `sectors`
- Coordonnées placeholder dans `site.ts` (téléphone générique)

## 6. Images disponibles

- `public/brand/logo-afd.jpg`
- `public/images/adf-logo.jpg`, `adf-logo0.jpg`, `adf1.jpg`, `adf2.png`
- SVG template Next (à ignorer pour le Hero)

## 7. Images manquantes

- Photos terrain documentées AFD pour Hero / programmes / histoires
- Logos partenaires
- SVG carte RDC officielle

## 8. Risques de régression

- `createClient()` lève une erreur si env Supabase absente → la homepage doit rester stable
- Ne pas casser le header
- Ne pas afficher de fausses stats / témoignages

## 9. Éléments à supprimer / remplacer

- Contenu « plateforme en construction » de l’accueil actuel
- Usage exclusif de `PageHero` pour l’accueil

## 10. Plan d’implémentation

1. `home-content.ts` + audit doc  
2. `lib/queries/home.ts` (safe)  
3. Sections home/* dans l’ordre  
4. Newsletter Server Action  
5. Footer  
6. Assemblage `page.tsx` + SEO  
7. typecheck / lint / build + commit local  
