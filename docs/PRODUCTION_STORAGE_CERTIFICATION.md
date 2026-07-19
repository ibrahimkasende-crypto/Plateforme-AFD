# Certification Storage — production

**Date :** 2026-07-19  
**Statut :** **PENDING — vérification live non effectuée**

---

## Buckets attendus (migrations locales)

| Bucket | Public | Source migration (indicatif) |
|--------|--------|------------------------------|
| `gallery` | oui | `20260715_003_storage_security.sql` |
| `rapports-prives` | non | idem |
| `documents-publics` / `documents-prives` / `candidatures-privees` | mixte | `006` / `007` |
| `partenaires` | (logos) | `010` |
| Publication studio / médias | selon `008` | Studio |
| `documents-ocr-prives` | non | `040` |
| `admin-avatars` | non | `050` |
| `hr-private` / `hr-payslips-private` | non | `050` |

Règles cibles : MIME / chemins sans `..` ; lectures privées via **URL signées** ; jamais `service_role` côté client.

---

## Checklist (à cocher après vérif live sur `ndkcywqihtnuoydwicrq`)

| # | Contrôle | Statut |
|---|----------|--------|
| 1 | Buckets existent sur ADF_BD | PENDING |
| 2 | Policies `storage.objects` alignées migrations | PENDING |
| 3 | Anon ne liste pas les buckets privés | PENDING |
| 4 | Upload admin avatars / RH / OCR fonctionne | PENDING |
| 5 | URL signée expire / accès refusé après expiry | PENDING |
| 6 | Pas de bucket sensible en `public=true` par erreur | PENDING |
| 7 | Hostinger / app lit les bons noms de buckets | PENDING (app non déployée) |

---

## Preuves locales

| Élément | Note |
|---------|------|
| Migrations Storage | Présentes dans le repo |
| Docs | `PLATFORM_AFD_STORAGE.md`, `HR_STORAGE_SECURITY.md` |
| Test live prod | **Aucun** |

---

## Verdict

**Storage : NON CERTIFIÉ en production.**  
Checklist ci-dessus reste **PENDING**.
