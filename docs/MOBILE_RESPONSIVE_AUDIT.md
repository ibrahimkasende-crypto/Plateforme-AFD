# Audit responsive mobile — Page d’accueil Plateforme-AFD

Date : 2026-07-17  
Projet : `D:\Plateforme-AFD\AFD`  
Périmètre : header, hero, stats, domaines, programmes, impact/actualités, newsletter, popup, CTA, footer.

---

## 1. Problèmes identifiés

| Priorité | Problème | Impact |
|----------|----------|--------|
| P0 | Carte institutionnelle 80 % masquée sous `lg` (`hidden lg:flex`) | Contenu clé absent sur téléphone |
| P0 | Honeypot newsletter `absolute -left-[9999px]` sans conteneur borné | Risque de scroll horizontal |
| P1 | Hero `min-h-[600px]` + composition desktop non adaptée | Texte/CTAs peu confortables sur 320–390 px |
| P1 | Actualités en `sm:grid-cols-3` | Cartes trop étroites dès 640 px |
| P1 | Header mobile haut (80–86 px) sans CTA « Soutenir » visible < `sm` | Zones tactiles / conversion |
| P2 | Labels stats `max-w-[9.5rem]` + séparateurs pensés desktop | Lisibilité mobile |
| P2 | Newsletter bandeau en ligne dès `sm` | Formulaire moins confortable au clavier |
| P2 | Popup `88vh` / close `size-8` | Clavier virtuel + zone tactile |
| P3 | Animations hero ken-burns/glow actives sur mobile | Perf / batterie |
| P3 | Footer 4 colonnes empilées sans hiérarchie mobile | Longueur / navigation |

## 2. Composants concernés

- `site-header.tsx`, `header-logo.tsx`, `header-actions.tsx`, `mobile-navigation.tsx`
- `home/home-hero.tsx`
- `home/impact-statistics.tsx`
- `home/intervention-pillars.tsx`
- `home/featured-programs.tsx`
- `home/impact-and-news.tsx`
- `home/newsletter-section.tsx`
- `home/support-actions.tsx`
- `home/organization-introduction.tsx`
- `site-footer.tsx`
- `newsletter-dialog.tsx`, `newsletter-popup-form.tsx`
- `globals.css`, `SiteContainer.tsx`, `FadeIn.tsx`
- `app/layout.tsx`, `app/(public)/layout.tsx`

## 3. Débordements

- Honeypot hors viewport (`-left-[9999px]`) — corrigé via `sr-only`.
- Marquee partenaires (`w-max`) — déjà contenu par `overflow-hidden`.
- Glow hero `-left-[20%]` — déjà contenu par `overflow-hidden` du hero.
- Dropdown desktop `min-w-[20rem]` — hors mobile.

## 4. Tailles incorrectes

- Header 80–86 px → cible mobile 64–72 px.
- Logo header ~52 px → 42–48 px mobile.
- Carte 80 % desktop OK ; mobile absente.
- Inputs newsletter `text-sm` → risque zoom iOS ; cible `text-base` (16 px).
- Close popup 32 px → cible ≥ 44 px.

## 5. Images mal cadrées

- Hero `object-[68%_center]` déjà orienté groupe ; mobile : renforcer `object-[70%_center]` et overlay bas/gauche.
- Programmes / actualités : ratios OK ; `sizes` à affiner.

## 6. Sections mal empilées

- Carte 80 % absente du flux mobile.
- Impact + news : OK en stack `< lg`, mais news trop serrées dès `sm`.
- Newsletter : passer en carte verticale stricte sur mobile.

## 7. Correctifs appliqués

Voir `docs/HOMEPAGE_MOBILE_RESPONSIVE.md` pour le détail post-implémentation.

Résumé :

1. Header mobile compact + CTA Soutenir + drawer 88 %.
2. Hero mobile-first : texte bas, CTAs pleine largeur, carte 80 % sous le contenu.
3. Stats grille 1/2/3/6, labels libres, sans séparateurs mobiles.
4. Domaines `1` / `min-[360px]:2` / `lg:3`.
5. Programmes 1 col mobile, image 16/10, `sizes` corrigés.
6. Impact vertical + news 1/2/3.
7. Newsletter verticale + honeypot `sr-only` + inputs 16 px.
8. Popup `100dvh` / largeur `calc(100vw - 24px)` / close 44 px.
9. Footer accordéons mobiles.
10. CSS safe-area, overflow-x-clip, animations allégées mobile.
11. Tests Playwright `tests/e2e/homepage-responsive.spec.ts`.

## 8. Tests à réaliser

- Viewports : 320, 360, 375, 390, 412, 430, 768, 1024, 1280+.
- Absence de scroll horizontal (`document.documentElement.scrollWidth <= innerWidth`).
- Menu mobile ouvrir / Escape / navigation.
- Hero H1 visible, CTAs ≥ 44 px, carte 80 % visible.
- Stats / domaines / programmes / news lisibles.
- Newsletter et popup utilisables avec clavier virtuel.
- `npm run typecheck` / `lint` / `build` / e2e.

