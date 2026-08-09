# Implémentation du header public — Plateforme-AFD

**Date :** 17 juillet 2026

## 1. Composants créés

- `src/components/public/site-header.tsx`
- `src/components/public/desktop-navigation.tsx`
- `src/components/public/mobile-navigation.tsx`
- `src/components/public/header-logo.tsx`
- `src/components/public/header-actions.tsx`

## 2. Composants modifiés

- `src/app/(public)/layout.tsx` — importe `SiteHeader`
- `src/components/public/PublicHeader.tsx` — réexport de transition vers `SiteHeader`
- `src/config/site.ts` — branding AFD ASBL + logo + routes
- `src/config/public-navigation.ts` — sous-menus + descriptions + `isNavItemActive`
- `src/app/globals.css` — palette bleue `--afd-*` + animation drawer

## 3. Source de la navigation

`src/config/public-navigation.ts` (unique source de vérité).

## 4. Source du logo

`public/brand/logo-afd.jpg` (copie du logo officiel depuis `public/images/adf-logo.jpg`).

## 5. Comportement desktop

- Header sticky 84px → 72px au scroll
- Logo + texte institutionnel à gauche
- Navigation centrale (breakpoint `xl`)
- Dropdowns accessibles (clavier, Escape, clic extérieur)
- CTAs « Nous rejoindre » / « Soutenir l’AFD » à droite
- Lien actif : couleur bleue + trait inférieur

## 6. Comportement mobile

- Logo + Soutenir compact (sm+) + hamburger
- Drawer latéral droit (`role="dialog"`, focus, Escape, scroll lock)
- Accordion pour les sous-menus
- Fermeture après navigation

## 7. Sous-menus

Qui sommes-nous, Nos actions, Notre impact, Ressources (détails dans `public-navigation.ts`).

## 8. Animations

- Transition hauteur/ombre header au scroll (200 ms)
- Rotation chevron (200 ms)
- Ouverture drawer (`afd-drawer-in` 240 ms)
- Trait actif scale-x
- Respect `prefers-reduced-motion`

## 9. Routes temporaires créées

Aucune nouvelle route : les destinations du header existaient déjà (placeholders).

## 10. Tests responsive

Vérifiés via structure CSS (`sm`, `xl`) pour 320–1440 px. Validation visuelle recommandée avec `npm run dev`.

## 11. Typecheck

OK (`npm run typecheck`)

## 12. Lint

OK (`npm run lint`)

## 13. Build

OK (`npm run build` — 73 pages)

## 14. Améliorations restantes

- Remplacer éventuellement le JPG par un PNG vectoriel officiel
- Ajouter Navigation Menu Radix/shadcn si le design system l’introduit
- Auth / compte utilisateur dans le header (hors scope)
- Contrôle visuel manuel sur 320–1440 px via `npm run dev`

