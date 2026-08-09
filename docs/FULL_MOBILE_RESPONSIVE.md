# Refonte mobile-first — site public Plateforme-AFD

Date : 2026-07-18  
Référence : `docs/references/maquette-mobile-afd.png`  
Audit : `docs/FULL_MOBILE_RESPONSIVE_AUDIT.md`

## Objectif

Transformer l’expérience publique téléphone en composition mobile premium, sans altérer le desktop validé ni les données Supabase.

## Fondations

- Tailwind CSS v4 + container queries (`@container/card`, `@min-[…]/card`)
- Variables : `--afd-section-y`, `--afd-mobile-card-w`, `--afd-mobile-gutter`
- Rails : `HorizontalCardRail` (snap, peek ~86vw, indicateurs)
- Wrapper : `CqCard`

## Accueil — ordre

1. Hero (wrap mobile, hauteur `svh` adaptée)  
2. Statistiques (rail + CQ)  
3. Présentation  
4. Domaines (rail + CQ)  
5. Programmes prioritaires (réintroduits, rail)  
6. Zones RDC (copy tactile)  
7. Actualités + bannières impact  
8. Opportunités  
9. Newsletter (stack vertical)  
10. Actions d’engagement (nouveau rail)  
11. Partenaires  
12. Footer  

## Desktop

Layouts `md+` / `lg+` / `xl+` inchangés dans l’esprit (grilles, hero panneau gauche, stats en bandeau).

## Accessibilité

- Rails `role="region"` + label + Tab  
- Boutons prev/next ≥ 44 px  
- `prefers-reduced-motion` respecté  
- Pas de scroll horizontal global  

## Tests

- Viewports : 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920  
- `tests/e2e/homepage-responsive.spec.ts`  
- `tests/e2e/mobile-horizontal-rails.spec.ts`  
- `tests/e2e/full-mobile-responsive.spec.ts`  

## Validation technique

- typecheck : OK  
- lint (fichiers touchés) : OK  
- build : OK  
- e2e (`full-mobile-responsive` + `mobile-horizontal-rails` + `homepage-responsive`, mobile-390 + desktop-1440) : OK  


## Limites

- Certaines pages secondaires (CMS longues) restent principalement en stack vertical institutionnel — volontaire.  
- La carte RDC reste verticale (pas de rail).  
- Container queries dépendent du support navigateur moderne (OK pour cibles AFD).  

