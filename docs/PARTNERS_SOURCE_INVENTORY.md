# Inventaire source — partenaires afd-rdc.org

Date d’extraction : 2026-07-18  
URL analysée : https://afd-rdc.org/  
Section UI : eyebrow « Ils nous font confiance », titre « Nos partenaires »  
Source données : API publique Supabase de l’ancien site (`partenaires`, `select=*`)

## Méthode

1. Inspection du bundle JS de afd-rdc.org (requête `from("partenaires")`)
2. Appel REST public `partenaires?select=*`
3. Téléchargement individuel de chaque `logo_url` (bucket `gallery/partenaires`)
4. Empreinte SHA-256 — aucun doublon binaire
5. Optimisation PNG (largeur max 1000 px, transparence conservée)

## Partenaires vérifiés (13)

| Ordre | Nom | Acronyme | Catégorie source | Fichier optimisé |
|---|---|---|---|---|
| 1 | MINISTERE DE LA SANTE PUBLIQUE, HYGIENE ET PREVOYANCE SOCIALE | — | gouvernement | `ministere-de-la-sante-publique-hygiene-et-prevoyance-sociale.png` |
| 2 | CHWID | CHWID | international | `chwid.png` |
| 3 | CARITAS | CARITAS | international | `caritas.png` |
| 4 | ROJAF | ROJAF | ong | `rojaf.png` |
| 5 | CASAMED | CASAMED | ong | `casamed.png` |
| 6 | IMPACT SANTE AFRIQUE | — | international | `impact-sante-afrique.png` |
| 7 | CS4ME | CS4ME | ong | `cs4me.png` |
| 8 | UAF | UAF | international | `uaf.png` |
| 9 | RACOJ | RACOJ | ong | `racoj.png` |
| 10 | PSDS | PSDS | ong | `psds.png` |
| 11 | ALLEVIATE | ALLEVIATE | international | `alleviate.png` |
| 12 | PNSR | PNSR | ong | `pnsr.png` |
| 13 | SI JEUNESSE SAVAIT | — | ong | `si-jeunesse-savait.png` |

## Non inventé

- Aucune URL de site web n’était présente dans la source → `website_url = null`
- Aucune description textuelle → `description = null`
- Catégories reprises **telles quelles** depuis la base de l’ancien site (pas d’attribution speculative)

## Logos non identifiés

Aucun. Les 13 logos sont associés à un nom explicite dans l’API.

## Doublons

0 fichier identique (SHA-256).

## Emplacements

- Banque : `C:\Users\IKAS\Documents\Banque des images AFD\08_Partenaires\`
- CSV : `...\08_Partenaires\inventaire-partenaires.csv`
- Public Next : `public/images/afd/partenaires/`
- Config : `src/config/legacy-partners.ts`
