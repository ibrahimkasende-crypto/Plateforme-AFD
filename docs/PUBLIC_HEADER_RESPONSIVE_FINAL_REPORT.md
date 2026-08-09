# Rapport final — Header public responsive

Date : 2026-08-06  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Cause du chevauchement

Dès 1200 px, le header affichait simultanément :
- le **nom complet** AFD (3 lignes),
- **tous** les liens desktop en `whitespace-nowrap`,
- des **gaps** élevés (4→6),
- les **CTA** à droite.

Sur laptops 1280–1366 px, « Accueil » entrait en collision avec la marque.

## 2. Composants corrigés

| Fichier | Action |
|---|---|
| `organization-brand.tsx` | **Nouveau** — variantes full / compact / auto |
| `site-header.tsx` | 3 zones + breakpoints 1280 / 1440 |
| `desktop-navigation.tsx` | Mode compact + menu **Plus** |
| `mobile-navigation.tsx` | CTA retirés de la barre, restés dans le drawer |
| `header-logo.tsx` | Alias vers OrganizationBrand |
| `public-navigation.ts` | Split primary / secondary |

## 3. Breakpoints

| Plage | Comportement |
|---|---|
| &lt; 1280 px | Hamburger + marque compacte |
| 1280–1439 px | Desktop compact + menu **Plus** |
| ≥ 1440 px | Desktop complet + marque full |

## 4. Variante compacte

Oui — `OrganizationBrand` (`full` / `compact` / `icon-only` / `auto`).

## 5. Menu « Plus »

Oui — entre 1280 et 1439 px : Bibliothèque, Actualités, Ressources, Contact.

## 6. Menu mobile

Oui — hamburger seul dans la barre ; drawer complet avec accordéons, Échap, fermeture route, CTA.

## 7–8. Header sticky / scroll

Hauteurs stables (`h-16` / `4.5rem` / `5rem`). Le scroll n’ajoute que l’ombre, sans changer la structure.

## 9. Dropdowns

Alignement start/center/end + `max-w` viewport.

## 10. Scroll horizontal

Corrigé par architecture (pas de `overflow-x-hidden` global). Tests e2e de détection ajoutés.

## 11. Tailles testées (e2e)

320, 360, 375, 390, 430, 768, 820, 912, 1024, 1100, 1180, 1280, 1366, 1440, 1600.

## 12. Navigateurs

Couverture via Playwright Chromium (projet desktop/mobile). Validation manuelle Chrome/Edge recommandée après déploiement.

## 13. Typecheck

`npm run typecheck` → **OK**

## 14. Lint

Fichiers header ciblés → à valider en CI (`eslint` fichiers modifiés).

## 15. Tests

Fichiers ajoutés :
- `tests/e2e/public-header-responsive.spec.ts`
- `tests/e2e/public-header-overlap.spec.ts`
- `tests/e2e/public-header-mobile-menu.spec.ts`
- `tests/e2e/public-header-dropdowns.spec.ts`
- `tests/e2e/public-header-scroll-state.spec.ts`

## 16. Build

Typecheck OK. Build production à lancer avant redeploy Hostinger.

## 17. Problèmes restants

- Pas de TrustBar à corriger (absente).
- Pas de sélecteur de langue / recherche dans le header actuel.
- Zoom 110–125 % : à valider manuellement après deploy.

## 18. Verdict

**Prêt pour validation visuelle locale puis redéploiement**, sous réserve d’un `npm run build` + smoke test header sur 390 / 1280 / 1440.
