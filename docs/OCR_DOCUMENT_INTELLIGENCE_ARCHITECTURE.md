# Architecture — Import intelligent / OCR

## Flux obligatoire

Document importé → Analyse sécurité → Empreinte SHA-256 → Classification → Extraction native / OCR → Contrôles → Révision humaine → Approbation → Plan d’application → Écriture Supabase → Recalcul graphiques → Journal.

**Aucune donnée extraite n’est officielle avant validation.**

## Composants

| Couche | Emplacement |
|--------|-------------|
| Feature | `src/features/document-intelligence/` |
| Routes admin | `src/app/admin/import-intelligent/` |
| API worker | `src/app/api/ocr/process/route.ts` |
| Worker Node | `scripts/ocr-worker.ts` |
| Migrations | `supabase/migrations/20260719_040_*` et `041_*` |
| Bucket | `documents-ocr-prives` |

## File asynchrone

Table `ocr_jobs` + RPC `claim_ocr_job` (SKIP LOCKED). L’upload HTTP ne traite pas les gros documents de façon synchrone ; `after()` tente un job, sinon le worker reprend.

