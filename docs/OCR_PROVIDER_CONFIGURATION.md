# Configuration fournisseurs OCR

Variables serveur uniquement (voir `.env.example`).

| OCR_PROVIDER | Comportement |
|--------------|--------------|
| `native` (défaut) | PDF texte (unpdf), DOCX (mammoth), XLSX (exceljs), CSV |
| `azure` | Azure Document Intelligence — endpoint/key env |
| `tesseract` | Fallback images — limites déclarées |
| `google` / `aws` | Adaptateurs prêts, SDK officiel requis |
| `mock` | Tests uniquement (`NODE_ENV=test` ou non-prod) |

Fallback Tesseract : jamais présenté comme succès cloud. Échec principal non masqué.

