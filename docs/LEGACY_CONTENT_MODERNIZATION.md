# Modernisation des contenus hérités (domaines & actualités)

## 1. Sujets récupérés (source éditoriale afd-rdc.org)

- Domaines d’intervention (6 axes)
- Actualités : VBG Est RDC, formation entrepreneuriale Kinshasa, santé maternelle

## 2. Sujets normalisés

Titres et slugs normalisés côté Plateforme-AFD ; design ancien non repris.

## 3. Domaines créés

1. Autonomisation économique des femmes  
2. Protection, VBG et droits des femmes  
3. Santé maternelle et infantile  
4. Eau, hygiène et assainissement — WASH  
5. Femmes, leadership et gouvernance communautaire  
6. Femmes dans la réponse humanitaire et d’urgence  

## 4. Actualités migrées

| Slug | Statut dates |
|------|--------------|
| `afd-actions-vbg-est-rdc` | date vide |
| `formation-entrepreneuriale-kinshasa` | date vide |
| `sensibilisation-sante-maternelle` | date vide |

## 5. Doublons évités

Fusion slug/titre dans `getPublishedNews` / `getFeaturedNews`.

## 6. Textes à valider

- Dates de publication
- Auteurs
- Statistiques / effectifs
- Enrichissement éditorial depuis le Studio

## 7. Composants dépliables

- `intervention-domain-card` (Collapsible + aria)
- `news-expandable-preview`

## 8–9. Typo & responsive

Manrope (heading) / Inter (body) via classes projet ; grilles 1/2/3 colonnes.

## 10. Supabase

Requêtes : `intervention-domains.ts`, `news.ts` ; migration fondations studio.

## 11. Images

JPG programmes / actualites sous `public/images/afd/` (secours local).

## 12–16. SEO, tests, validation

- SEO : métadonnées domaines / actualités + JSON-LD Article
- E2E : `intervention-domains`, `news-section`, `news-detail` (OK sur mobile-320 + desktop-1440)
- typecheck : OK
- lint : OK (0 erreur ; warning préexistant newsletter form)
- build : OK

