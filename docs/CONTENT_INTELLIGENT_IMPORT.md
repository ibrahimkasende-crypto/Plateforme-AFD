# Import intelligent de contenus

## Objectif

Créer un projet, programme, activité ou actualité en **moins de 2 minutes** à partir d’un document (PDF, Word, Excel, image), avec validation humaine avant publication.

Le formulaire manuel reste disponible en secours.

## Parcours utilisateur

1. **Nouveau projet** (idem programmes / activités / actualités)
2. Choix : **Import intelligent** (recommandé) ou **Création manuelle**
3. Assistant 5 étapes : Importer → Analyse → Extraction → Correction → Publication
4. Aperçu avant import : ✔ reconnu · ⚠ doute · ❌ non trouvé
5. Validation → écriture Supabase + `revalidatePublicContent`

## Routes

| Entité | Choix | Import | Manuel |
|--------|-------|--------|--------|
| Projet | `/admin/projets/nouvelle` | `…/import` | `…/manuelle` |
| Programme | `/admin/programmes/nouvelle` | `…/import` | `…/manuelle` |
| Activité | `/admin/activites/nouvelle` | `…/import` | `…/manuelle` |
| Actualité | `/admin/publications/actualites/nouvelle` | `…/import` | `…/manuelle` |

## Technique

- Feature : `src/features/content-import/`
- OCR : réutilise `document-intelligence` (native → Tesseract / Azure selon `OCR_PROVIDER`)
- Extraction métier : heuristiques FR (`heuristic-extractor.ts`) — remplaçable par LLM sans changer le contrat
- Catalogue de champs générique pour 10 types d’entités
- Aucune auto-publication sans case « Publier immédiatement »

## Limites actuelles (non bloquantes)

- PowerPoint / ZIP : conversion PDF recommandée
- Images bibliothèque auto : à brancher sur `saveEventArchive` / Storage (phase suivante)
- Création programme liée + indicateurs multi-tables : enrichissement progressif
- Hub `/admin/import-intelligent` reste le pipeline finance / révision lourde

## Fournisseurs OCR

Conservés sans changer l’architecture : `native`, `tesseract`, `azure`, `google` (stub), `aws` (stub).
