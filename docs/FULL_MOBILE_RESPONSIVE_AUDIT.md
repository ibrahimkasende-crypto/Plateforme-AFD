# Audit responsive mobile — Plateforme-AFD (site public)

Date : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`  
Référence visuelle : `docs/references/maquette-mobile-afd.png`  
Stack : Next.js 16 · React 19 · Tailwind CSS v4 · Motion  

## Synthèse

La version desktop est conservée. La version mobile était encore trop proche d’un empilement de blocs desktop : titres forcés en `nowrap`, sections trop hautes, grilles denses, filtres avec `min-w` agressifs, cartes sans container queries, et programmes / CTAs d’engagement absents de l’accueil.

## Tableau d’audit

| Route | Composant | Problème | Résolution | Cause | Correction | Test |
|-------|-----------|----------|------------|-------|------------|------|
| `/` | `home-hero` | Titres `whitespace-nowrap` | 320–430 | Lignes typewriter non adaptatives | Wrap mobile + clamp | overflow OK |
| `/` | `impact-statistics` | Stats peu « app-like » | <768 | Empilement / rail générique | Rail + carte `@container` | rail snap |
| `/` | `organization-introduction` | Image 4/5 trop haute | <768 | Ratio desktop | Ratio 16/11 mobile | hauteur OK |
| `/` | `intervention-domains-section` | Cartes empilées | <768 | Pas de composition rail premium | Rail + CQ card | peek OK |
| `/` | `featured-programs` | Absent + grille 1 col | <768 | Section non branchée | Branchée + rail | visible |
| `/` | `intervention-zones` | Copy « survol » | tactile | Texte desktop | Copy touch-friendly | lisible |
| `/` | `news-grid` / `news-card` | Cartes desktop empilées | <768 | Pas de CQ | Rail + CQ | snap OK |
| `/` | `open-opportunities-section` | Idem | <768 | — | Rail + CQ | snap OK |
| `/` | `newsletter-section` | Formulaire large | <640 | Layout desktop | Stack mobile | champs 16px |
| `/` | `support-actions-section` | Absent | <768 | Non branché | Nouveau + rail | 4 actions |
| `/` | `partners-grid` | Logos OK | <768 | — | Conservé | OK |
| `*` | `site-header` | — | <1200 | Déjà adapté | Conservé + CTA Soutenir | menu OK |
| `*` | `site-footer` | — | <md | Accordéons | Conservé | OK |
| `*` | `PageHero` | Titre trop grand | <640 | `text-3xl` fixe | Clamp mobile | OK |
| filtres | documents / AO / pagination | `min-w-56` / `220px` | 320 | Largeurs fixes | `min-w-0 w-full` | pas d’overflow |
| cartes | stats, news, domaines, opportunités, programmes | Pas de CQ | colonnes variables | Styles viewport only | `@container` | adaptatif |
| rails | `horizontal-card-rail` | Peek / padding | <768 | Générique | Peek 84–88vw, indicateur | e2e |

## À conserver

- Design desktop validé  
- Rails horizontaux (pas de scroll global)  
- Curseur natif + effet liquide desktop uniquement  
- Server Components par défaut  
- Safe-areas header / drawer / donate  

## À supprimer / éviter

- `whitespace-nowrap` sur titres hero mobile  
- `min-w-*` sur champs de filtres mobiles  
- Empilement vertical de 4–6 cartes sans rail  
- Masquer le débordement avec `overflow-x-hidden` sans corriger la cause  

## Stratégie

1. Fondations CSS mobile-first + container queries  
2. Rails & cartes adaptatives  
3. Scénarisation accueil (programmes + CTAs)  
4. Pages secondaires (filtres, PageHero)  
5. Tests multi-viewports + typecheck / lint / build  

