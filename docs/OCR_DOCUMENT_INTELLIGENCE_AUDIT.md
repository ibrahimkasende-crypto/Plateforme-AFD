# Audit — Import intelligent / OCR Document Intelligence

Date : 2026-07-19  
Projet : `D:\Plateforme-AFD\AFD`  
Organisation : Alliance des Femmes pour le Développement — AFD ASBL

## Synthèse

La plateforme dispose d’un socle **documents / rapports / finances / Storage / RLS / journal / dashboard RPC**, mais **aucun pipeline OCR**, ni parsing PDF/DOCX/XLSX, ni file d’attente persistante. L’upload admin médias est largement un stub. Aucune donnée officielle ne doit être modifiée par OCR sans validation humaine.

---

## 1. Modules pouvant recevoir des rapports

| Module | État | Cible d’application OCR |
|--------|------|-------------------------|
| Rapports | Présent (`/admin/rapports`) | `rapports_generes`, annexes |
| Documents | Présent (`/admin/documents`) | métadonnées + stockage privé OCR |
| Finances / budgets / dépenses | Présent | `finances_budgets`, `finances_depenses` |
| Projets / activités | Présent | `activites`, progression |
| Bénéficiaires / indicateurs | Présent (agrégats) | `beneficiaires_agregats`, chiffres impact |
| Partenaires / opportunités / AO | Présent | pièces liées, pas données financières auto |
| Stocks / logistique | **Absent** (rôle seul) | mappings préparés, tables cibles futures |

## 2. Formats déjà acceptés

- Candidatures : PDF / DOCX (upload Storage réel)
- Partenaires : images logo
- Documents admin : chemin Storage texte, pas d’upload OCR
- Aucun parseur XLSX/CSV/TIFF en dépendances

## 3. Buckets existants

`gallery`, `rapports-prives`, `documents-publics`, `documents-prives`, `candidatures-privees`, `rapports-publics`, buckets CMS (`site-public`, `programmes`, …).

**À créer :** `documents-ocr-prives` (privé, jamais public).

## 4. Tables existantes pertinentes

- `documents`, `categories_documents`, `telechargements_documents`
- `medias` (+ `content_hash` non rempli côté app documents)
- `rapports_generes`, `finances_*`, `activites`, `beneficiaires_agregats`
- `journal_activite` + RPC `log_admin_activity`

**À créer :** suite `documents_importes`, `ocr_*`, `document_fingerprints`, `imports_donnees*`, etc.

## 5. Traitement asynchrone

Absent (pas de Bull/Inngest/workers). Edge Function unique : contact.

**Plan :** file PostgreSQL `ocr_jobs` + worker Node (`scripts/ocr-worker.ts`) + route `/api/ocr/process` (claim atomique). Pas de traitement lourd synchrone dans l’upload HTTP.

## 6. Fournisseurs OCR

Aucun configuré. Variables à ajouter (serveur uniquement). Mock réservé aux tests.

## 7. Données dashboard

RPC `get_admin_dashboard`, métriques secondaires. Tags `revalidateTag` : documents, rapports, finances…  
**Règle :** invalidation **uniquement après** `ocr_applications` réussie (statut `applied`).

## 8. Risques de sécurité

- RLS tables 030 trop permissives (`authenticated using true`) — OCR doit utiliser `has_permission('ocr.*')`
- Stub MediaUploader sans Storage
- Pas d’antivirus — hook prévu, non bloquant
- Risque d’exposer clés OCR si préfixées `NEXT_PUBLIC_` — interdit
- Faux sentiment d’authenticité OCR — statuts d’intégrité/provenance distincts

## 9. Données sensibles possibles

Finances, bénéficiaires, signatures, contacts, pièces justificatives → classification `interne` à `strictement_confidentiel`, URLs signées courtes, journal des consultations.

## 10. Migrations nécessaires

- Bucket `documents-ocr-prives` + policies Storage
- Tables OCR / imports / fingerprints / provenance / signatures
- Permissions `ocr.*` + attribution rôles
- RLS stricte
- Seeds modèles d’extraction et règles de validation

## 11. Plan d’implémentation

1. Migration + permissions + bucket  
2. Feature `document-intelligence` (upload, hash, queue, providers)  
3. Extraction native → OCR fallback  
4. Modèles / normalisation / anomalies  
5. UI admin + révision  
6. Approbation → plan d’application → apply + revalidate  
7. Notifications, tests, docs, commit local  

Principe absolu : **aucune écriture officielle avant approbation humaine**.
