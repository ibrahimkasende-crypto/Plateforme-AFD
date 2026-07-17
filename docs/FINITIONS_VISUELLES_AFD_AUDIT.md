# Audit finitions visuelles — Plateforme-AFD

**Date :** 17 juillet 2026  
**Projet :** `D:\Plateforme-AFD\AFD`  
**Références :** maquette desktop AFD + respiration institutionnelle (inspirée COSAMED, non copiée)

## 1. Différences site actuel / maquette

| Zone | Actuel | Maquette |
|------|--------|----------|
| Polices | Source Sans 3 + Source Serif 4 | Manrope (titres) + Inter (corps) |
| Conteneur | `max-w-7xl` (~1280px), `px-4/6/8` | ~1320–1380px, paddings 18–48px |
| Sections | `py-12 md:py-16` | 96–120px desktop |
| Header | Nav dense (`gap-0.5`, `px-2.5`), breakpoint `xl` | Onglets aérés (26–34px), menu dès ~1200px |
| Hero | `min-h-[78vh]`, H1 ~3.15rem, description concaténée | ~600–680px, H1 56–64px, texte maquette |
| Stats | Overlay partiel | Grande carte blanche flottante 6 colonnes |
| Domaines | Grille variable | 6 colonnes alignées, icônes rondes |
| Histoire / actus | Empilées ou peu liées | Deux colonnes desktop |
| Loader | Absent | Cœur + logo AFD |
| Popup newsletter | Absent | Popup intelligent post-loader |

## 2. Tailles typographiques incorrectes

- H1 Hero trop petit (≈36–50px vs 56–64px desktop).
- Brand header en `10–11px` peu lisible.
- Pas d’échelle H2/H3 unifiée (mélange `text-2xl` / `text-3xl`).
- Titres en Source Serif au lieu de Manrope.

## 3. Espacements insuffisants

- Sections trop serrées (`py-12` / `py-16`).
- Gap nav quasi nul.
- Dropdowns avec padding compact (`p-2`, `gap-1`).
- Conteneur étroit par rapport à la maquette.

## 4. Cartes mal alignées

- Programmes / actualités sans hauteur égale ni liens bas-alignés systématiquement.
- Histoire d’impact et actualités non juxtaposées comme sur la maquette.

## 5. Problèmes du header

- Compression au scroll (72px) trop agressive.
- Logo 40–48px vs 56–64px maquette.
- CTAs et nav masqués avant 1280px.
- Wordmark trop petit.

## 6. Problèmes du Hero

- Hauteur viewport trop haute.
- Contenu config (`eyebrow`, `secondaryCta`) divergents du rendu.
- Carte 80 % correcte en intention mais texte à affiner (pas un KPI bénéficiaires).
- Stats chevauchement à renforcer.

## 7. Responsive

- Tablette longtemps en menu burger (`xl`).
- Carte institutionnelle masquée sans alternative claire.
- Risque de densification sur petits écrans.

## 8. Newsletter

- Bandeau page : UI RHF + Zod + Sonner OK.
- Service stub (pas de persist).
- Aucune table newsletter dans les migrations.
- Pas de popup.

## 9. Loader

- Aucun loader d’entrée de marque.
- Pas de `sessionStorage` dédié.

## 10. Composants à conserver

- Structure `home/*` et assemblage `page.tsx`.
- Requêtes `src/lib/queries/home.ts` + pattern safe Supabase.
- Header sticky / drawer mobile (à aérer, pas réécrire).
- `FadeIn`, footer, actions newsletter existantes (à étendre).
- Palette bleue AFD (à recentrer sur le bleu logo `#0877D1`).
