# Schéma base OCR

Migrations : `20260719_040_document_intelligence.sql`, `20260719_041_document_intelligence_review_columns.sql`.

Tables principales : `documents_importes`, `ocr_jobs`, `ocr_pages`, `ocr_blocs`, `ocr_tables`, `ocr_champs_extraits`, `ocr_valeurs_normalisees`, `ocr_modeles_extraction`, `ocr_regles_validation`, `ocr_anomalies`, `ocr_revisions`, `ocr_approbations`, `ocr_applications`, `document_fingerprints`, `document_signatures`, `document_provenance`, `document_versions`, `imports_donnees`, `imports_donnees_lignes`, `ocr_notifications`.

RLS via `has_permission('ocr.*')`. Bucket Storage privé `documents-ocr-prives`.

