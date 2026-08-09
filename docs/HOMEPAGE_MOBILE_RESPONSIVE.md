# Homepage mobile responsive — Plateforme-AFD

Date : 2026-07-17  
Commit message cible : `fix: make Plateforme-AFD homepage fully responsive`

## 1. Problèmes corrigés

- Carte 80 % absente sur mobile
- Hero trop « desktop » sur petit écran
- Stats / actualités / domaines trop serrés
- Honeypot newsletter causant un risque d’overflow horizontal
- Header mobile trop haut, sans CTA Soutenir
- Popup newsletter peu confortable sur téléphone
- Footer en colonnes peu adaptées
- Menu mobile refermé immédiatement (course backdrop / click)
- Animations hero lourdes sur mobile

## 2. Breakpoints utilisés

Tailwind existants + `min-[360px]`, `min-[400px]`, `min-[1200px]` :

| Largeur | Usage |
|---------|--------|
| < 360 px | 1 colonne (stats, domaines, CTA) |
| ≥ 360 px | 2 colonnes |
| ≥ 768 px (`md`) | tablette |
| ≥ 1024 px (`lg`) | desktop section layouts |
| ≥ 1200 px | navigation header desktop |

## 3. Header mobile

- Hauteur `64px` (+ safe-area)
- Logo ~44 px + libellé `AFD ASBL`
- CTA compact « Soutenir » + thème + hamburger
- Drawer `88vw` max, scrollable, Escape, lock scroll, touch ≥ 44 px

## 4. Hero mobile

- Image pleine largeur, `object-[70%_center]`
- Overlay bas/gauche fort (lisibilité)
- Contenu ancré en bas (`content-end`)
- CTAs empilés pleine largeur < 400 px
- Ken Burns / glow désactivés < `lg`

## 5. Carte 80 %

- Mobile / tablette : sous les CTAs, largeur 100 %
- Desktop (`lg+`) : bas à droite, format compact

## 6. Statistiques

- `1` / `min-[360px]:2` / `md:3` / `xl:6`
- Pas de séparateurs verticaux hors desktop
- Labels sans `max-w` restrictif

## 7. Domaines

- `1` / `min-[360px]:2` / `lg:3`
- Alignement gauche, icônes réduites, topics masqués sur très petit écran

## 8. Programmes

- 1 carte / ligne mobile, image 16/10, `sizes` corrigés
- 2 cols tablette, 4 cols desktop

## 9. Histoire d’impact

- Composition verticale mobile (image puis texte)
- Ratio 4/3 mobile, 4/5 tablette+

## 10. Actualités

- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Lien « Voir toutes… » sous la grille sur mobile

## 11. Newsletter page

- Stack vertical mobile
- Inputs `text-base` (16 px), hauteur ≥ 48 px
- Bouton pleine largeur mobile
- Honeypot `sr-only`

## 12. Popup newsletter

- `w-[calc(100vw-24px)]`, `max-h-[calc(100dvh-24px)]`
- Fermeture 44×44, contenu scrollable
- Champs / bouton pleine largeur

## 13. Footer mobile

- Logo + contact toujours visibles
- Colonnes en accordéons accessibles
- Réseaux sociaux (dont TikTok) + légal

## 14. Images / object-position

- Hero mobile `70%`, desktop gauche-droite clair
- `sizes` programmes / news adaptés

## 15. Animations réduites

- FadeIn plus court, délai plafonné
- Hero media/glow off < 1024 px
- `prefers-reduced-motion` respecté

## 16. Tests Playwright

- Fichier : `tests/e2e/homepage-responsive.spec.ts`
- Config : `playwright.config.ts` (Chromium, viewports 320–1440)
- Scripts : `npm run test:e2e`, `npm run test:e2e:install`

Résultat (mobile-375 + desktop-1440) : **7 passed, 1 skipped** (menu desktop skippé).

## 17. Typecheck

`npm run typecheck` → OK

## 18. Lint

`npm run lint` → OK (après correction backdrop ref)

## 19. Build

`npm run build` → OK

## 20. Limites restantes

- Liens réseaux sociaux encore vides dans `site.ts`
- Données impact / news dépendent de Supabase (placeholders possibles)
- Tests e2e limités à Chromium ; captures non versionnées
- Sections projets / zones / partenaires présentes mais hors checklist stricte « maquette »
- Menu : click Playwright nécessite parfois `force: true` (overlay loader/curseur)

