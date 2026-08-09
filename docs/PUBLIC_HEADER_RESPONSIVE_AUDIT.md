# Audit — Header public responsive

Date : 2026-08-06  
Projet : `D:\Plateforme-AFD\AFD`

## Composants concernés

| Fichier | Rôle |
|---|---|
| `src/components/public/site-header.tsx` | Shell sticky, grille, breakpoints |
| `src/components/public/header-logo.tsx` | Logo + nom ONG |
| `src/components/public/desktop-navigation.tsx` | Nav desktop + dropdowns |
| `src/components/public/mobile-navigation.tsx` | Drawer mobile |
| `src/components/public/header-actions.tsx` | CTA Soutenir / Rejoindre |
| `src/components/public/theme-toggle.tsx` | Thème |
| `src/config/public-navigation.ts` | Liens |
| `src/config/site.ts` | Marque / brandLines |
| `src/app/(public)/layout.tsx` | Montage SiteHeader |

Pas de TrustBar / TopBar / MegaMenu séparés actuellement.

---

## Problèmes identifiés

### 1. Collision logo / Accueil

- **Fichier :** `site-header.tsx`, `header-logo.tsx`, `desktop-navigation.tsx`
- **Cause :** dès `min-[1200px]`, le nom complet (`brandLines` × 3 lignes) + navigation complète (`gap-4`→`gap-6`) + CTA coexistent dans une grille trop étroite.
- **Largeurs :** 1200–1366 px (laptops)
- **Correction :** bascule desktop à `1280px` ; marque `full` seulement ≥ `1440px` ; marque `compact` (AFD) entre 1280–1439 ; gap réduit ; menu « Plus ».

### 2. Zone intermédiaire cassée

- **Fichier :** `site-header.tsx`
- **Cause :** bascule unique à 1200 px sans mode compact : soit trop de liens, soit hamburger trop tard.
- **Largeurs :** 1024–1279 px
- **Correction :** hamburger jusqu’à 1279 px ; desktop compact 1280–1439 ; desktop full ≥ 1440.

### 3. `whitespace-nowrap` + gaps trop grands

- **Fichier :** `desktop-navigation.tsx`
- **Cause :** tous les labels en `whitespace-nowrap` avec `gap-5/6` → débordement / compression de la zone logo.
- **Largeurs :** 1280–1440
- **Correction :** gaps `gap-2.5` / `gap-3` / `gap-4` selon densité ; labels secondaires dans « Plus ».

### 4. Actions droites sur mobile

- **Fichier :** `mobile-navigation.tsx`
- **Cause :** bouton « Soutenir » + hamburger + thème à côté du logo → barre trop dense.
- **Largeurs :** ≤ 767 px
- **Correction :** barre mobile = thème + hamburger ; CTA uniquement dans le drawer.

### 5. Hauteur header qui change

- **Fichier :** `site-header.tsx`
- **Cause :** `h-16` puis `h-[86px]` / `h-[80px]` au scroll → léger saut.
- **Largeurs :** ≥ 1200
- **Correction :** hauteurs stables `h-16` / `xl:h-[4.5rem]` / `min-[1440px]:h-[5rem]` ; scroll = ombre seulement, pas de changement de hauteur.

### 6. Dropdown centrés hors viewport

- **Fichier :** `desktop-navigation.tsx`
- **Cause :** `left-1/2 -translate-x-1/2` peut sortir à gauche/droite sur derniers items.
- **Largeurs :** tous desktop
- **Correction :** alignement `left-0` pour premiers items, `right-0` pour derniers ; `max-w` viewport.

---

## Statut

Corrections **appliquées** dans le code (voir `PUBLIC_HEADER_RESPONSIVE_FINAL_REPORT.md`).

## Stratégie retenue

| Largeur | Marque | Navigation | Droite |
|---|---|---|---|
| &lt; 1280 | logo + AFD | hamburger | thème + menu |
| 1280–1439 | logo + AFD | desktop compact + Plus | thème + CTA |
| ≥ 1440 | logo + nom complet | desktop complet | thème + CTA |
