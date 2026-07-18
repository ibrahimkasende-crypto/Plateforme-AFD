# Carte interactive RDC — implémentation

**Date :** 18 juillet 2026  
**Branche :** `reconstruction-nextjs`  
**Projet :** `D:\Plateforme-AFD\AFD`

---

## 1. Source du SVG

| Élément | Détail |
|--------|--------|
| Fichier | `public/maps/rdc-provinces.svg` |
| Source | [Simplemaps.com — carte RDC admin1](https://simplemaps.com/svg/country/cd) |
| Licence | Free for Commercial and Personal Use — [svg-license](https://simplemaps.com/resources/svg-license) |
| Attribution | Mention sous la carte : « Carte SVG — Simplemaps.com (usage libre commercial) » |
| Extraction | `node scripts/extract-rdc-paths.mjs` → `src/features/intervention-zones/data/rdc-province-paths.ts` |
| ViewBox | `0 0 1000 994` |

Aucun fichier SVG fiable n’existait dans le dépôt avant cette livraison.  
Une image statique n’est **pas** utilisée comme remplacement de la carte interactive.

---

## 2. Provinces disponibles (26)

| ID SVG | Code | Nom |
|--------|------|-----|
| CDBU | BU | Bas-Uele |
| CDEQ | EQ | Equateur |
| CDHK | HK | Haut-Katanga |
| CDHL | HL | Haut-Lomami |
| CDHU | HU | Haut-Uele |
| CDIT | IT | Ituri |
| CDKS | KS | Kasaï |
| CDKC | KC | Kasaï-Central |
| CDKE | KE | Kasaï-Oriental |
| CDKN | KN | Kinshasa |
| CDBC | BC | Kongo-Central |
| CDKG | KG | Kwango |
| CDKL | KL | Kwilu |
| CDLO | LO | Lomami |
| CDLU | LU | Lualaba |
| CDMN | MN | Maï-Ndombe |
| CDMA | MA | Maniema |
| CDMO | MO | Mongala |
| CDNK | NK | Nord-Kivu |
| CDNU | NU | Nord-Ubangi |
| CDSA | SA | Sankuru |
| CDSK | SK | Sud-Kivu |
| CDSU | SU | Sud-Ubangi |
| CDTA | TA | Tanganyika |
| CDTO | TO | Tshopo |
| CDTU | TU | Tshuapa |

---

## 3. Correspondance SVG ↔ Supabase

- Les projets publiés (`projets.active = true`) exposent un champ texte `location`.
- `matchLocationToProvinceId()` normalise ce texte (accents, casse, séparateurs) et le compare aux noms SVG + alias (`Sud-Kivu`, `Kinshasa`, `Kongo-Central`, etc.).
- Les programmes associés sont chargés via `program_id` → table `programmes` (titre / slug).
- **Aucune donnée inventée** : si aucune localisation ne correspond, la province reste inactive (fond neutre).
- Il n’existe pas de table `secteurs` dédiée : les titres de programmes publiés sont exposés comme domaines d’action visibles.

---

## 4. Composants

| Fichier | Rôle |
|---------|------|
| `src/components/maps/drc-interactive-map.tsx` | Carte SVG + stats + orchestration |
| `src/components/maps/province-tooltip.tsx` | Tooltip desktop / clavier |
| `src/components/maps/province-details.tsx` | Fiche province sélectionnée |
| `src/components/maps/province-list.tsx` | Liste textuelle accessible |
| `src/lib/queries/intervention-zones.ts` | `getPublicInterventionZones()` |
| `src/features/intervention-zones/types/intervention-zone.ts` | Types |
| `src/features/intervention-zones/utils/*` | Matching + intensité couleurs |

---

## 5. Interactions desktop

- Survol : tooltip (nom, projets, bénéficiaires, secteurs, invitation à cliquer).
- Clic / Entrée / Espace : sélection + fiche détail.
- Focus clavier visible (contour orange).
- Transitions couleur ~200 ms ; respect de `prefers-reduced-motion`.

## 6. Interactions mobiles

- Pas de dépendance au hover (`pointer: coarse`).
- Toucher = sélection ; détail affiché sous la carte.
- Liste des provinces pour sélection si la zone SVG est petite.

## 7. Accessibilité

- Chaque path : `role="button"`, `aria-label`, `tabIndex={0}`, `aria-pressed`.
- Résumé textuel : « L’AFD intervient actuellement dans X provinces… »
- Description `sr-only` pour les lecteurs d’écran.
- L’information ne dépend pas uniquement de la couleur (liste + compteurs + libellés).

## 8. État sans données

- Carte complète toujours visible (26 provinces neutres).
- Note : « Les données d’intervention par province seront affichées dès leur publication par l’AFD. »
- Plus de grand placeholder « Zones à renseigner ».

## 9. Pages

- Accueil : section « Nos zones d’intervention » → `InterventionZones` + carte `variant="home"`.
- Page complète : `/actions/zones-intervention` → même carte `variant="page"` + liste des provinces actives.
- Lien « Voir la carte interactive ».

## 10. Données manquantes / limites

- Localisations hors nomenclature des 26 provinces → non rattachées (pas inventées).
- Bénéficiaires absents → affichage « — » / « non renseignés ».
- Pas de table secteurs / actualités liées par province pour l’instant.

## 11. Tests & validation

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | OK (exit 0) |
| `npm run lint` | OK — 0 erreur (1 warning préexistant `newsletter-page-form` / react-hook-form) |
| `npm run build` | OK (exit 0) — Next.js 16.2.10 Turbopack |

Breakpoints cibles : 320 / 375 / 430 / 768 / 1024 / 1440 — disposition carte au-dessus + stats/liste en dessous sur mobile ; grille horizontale sur desktop.
