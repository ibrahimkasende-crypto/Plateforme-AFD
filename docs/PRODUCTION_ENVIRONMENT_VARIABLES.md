# Variables d’environnement — production

**Date :** 2026-07-19  
**Références :** `.env.example`, `src/config/env.ts`  
**Aucune valeur secrète dans ce document.**

Légende statut : `requis` · `recommandé` · `optionnel` · `interdit_prod` (si true / mal placé)

---

## Table des variables

| Nom | Obligatoire | Public / Server | Service | Où configurer | Statut |
|-----|-------------|-----------------|---------|---------------|--------|
| `NEXT_PUBLIC_APP_ENV` | Oui (prod) | Public | App Next | Hostinger / runtime | `production` requis — **non vérifié live** |
| `NEXT_PUBLIC_SITE_URL` | Oui (prod) | Public | App / auth redirect | Hostinger + Supabase Auth URLs | Candidat `https://afd-rdc.org` — **non vérifié** |
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | Public | Supabase client | Hostinger | Doit cibler `ndkcywqihtnuoydwicrq` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui* | Public | Supabase | Hostinger | *ou publishable |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Oui* | Public | Supabase | Hostinger | Alternative à anon |
| `NEXT_PUBLIC_APP_NAME` | Non | Public | Branding | Hostinger | Défaut `Plateforme-AFD` |
| `NEXT_PUBLIC_ENABLE_DEMO_CONTENT` | Oui (false) | Public | Contenu public | Hostinger | **false** en prod |
| `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA` | Oui (false) | Public | Dashboard démo | Hostinger | **false** en prod — critique |
| `NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS` | Non | Public | Candidatures | Hostinger | false par défaut |
| `NEXT_PUBLIC_ENABLE_WATER_RIPPLE` | Non | Public | UI | Hostinger | optionnel |
| `NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS` | Non | Public | UI | Hostinger | optionnel |
| `NEXT_PUBLIC_ENABLE_MOBILE_RAILS` | Non | Public | UI | Hostinger | optionnel |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui (invites / jobs) | Server | Supabase admin API | Hostinger secrets | Jamais `NEXT_PUBLIC_` |
| `NEWSLETTER_SEND_ENABLED` | Non | Server | Newsletter | Hostinger | false tant que non configuré |
| `EMAIL_PROVIDER` | Si envoi | Server | Newsletter | Hostinger | Absent → « Configuration requise » |
| `EMAIL_API_KEY` | Si envoi | Server | Newsletter | Hostinger | Secret |
| `EMAIL_FROM` | Si envoi | Server | Newsletter | Hostinger | |
| `EMAIL_REPLY_TO` | Non | Server | Newsletter | Hostinger | optionnel |
| `SERDIPAY_ENABLED` | Non | Server | Paiements | Hostinger | false → pas de faux succès |
| `SERDIPAY_ENVIRONMENT` | Si pay | Server | SerdiPay | Hostinger | |
| `SERDIPAY_BASE_URL` | Si pay | Server | SerdiPay | Hostinger | |
| `SERDIPAY_MERCHANT_ID` | Si pay | Server | SerdiPay | Hostinger | |
| `SERDIPAY_API_KEY` | Si pay | Server | SerdiPay | Hostinger | Secret |
| `SERDIPAY_API_SECRET` | Si pay | Server | SerdiPay | Hostinger | Secret |
| `SERDIPAY_WEBHOOK_SECRET` | Si pay | Server | SerdiPay | Hostinger | Secret |
| `SERDIPAY_CALLBACK_URL` | Si pay | Server | SerdiPay | Hostinger | |
| `SERDIPAY_RETURN_URL` | Si pay | Server | SerdiPay | Hostinger | |
| `SERDIPAY_DEFAULT_CURRENCY` | Non | Server | SerdiPay | Hostinger | défaut USD |
| `OCR_CLOUD_ENABLED` | Non | Server | OCR | Hostinger | false = native / local |
| `OCR_PROVIDER` | Non | Server | OCR | Hostinger | défaut `native` |
| `OCR_MAX_FILE_SIZE_MB` | Non | Server | OCR | Hostinger | |
| `OCR_MAX_PAGES` | Non | Server | OCR | Hostinger | |
| `OCR_DEFAULT_LANGUAGE` | Non | Server | OCR | Hostinger | |
| `OCR_SECONDARY_LANGUAGES` | Non | Server | OCR | Hostinger | |
| `OCR_MIN_CONFIDENCE` | Non | Server | OCR | Hostinger | |
| `OCR_ENABLE_TABLE_EXTRACTION` | Non | Server | OCR | Hostinger | |
| `OCR_ENABLE_SIGNATURE_DETECTION` | Non | Server | OCR | Hostinger | |
| `OCR_ORGANISATION_ID` | Non | Server | OCR | Hostinger | |
| `OCR_WORKER_SECRET` | Si worker | Server | OCR worker | Hostinger | Secret |
| `OCR_WORKER_POLL_MS` | Non | Server | OCR worker | Hostinger | |
| `AZURE_DOCUMENT_INTELLIGENCE_*` | Si Azure | Server | OCR cloud | Hostinger | optionnel |
| `GOOGLE_DOCUMENT_AI_*` / `GOOGLE_APPLICATION_CREDENTIALS` | Si Google | Server | OCR cloud | Hostinger | optionnel |
| `AWS_TEXTRACT_*` / `AWS_ACCESS_KEY_*` | Si AWS | Server | OCR cloud | Hostinger | optionnel |
| `BACKUP_STATUS_PROVIDER` | Non | Server | UI sauvegardes | Hostinger | informatif |
| `BACKUP_LAST_KNOWN_AT` | Non | Server | UI sauvegardes | Hostinger | informatif |
| Secrets CI `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` | Pour job RLS | CI | GitHub Actions | GitHub Secrets | Job RLS skip si vides |

---

## Règles production

1. `assertProductionPublicEnv()` exige `SITE_URL` + URL Supabase + (anon **ou** publishable).  
2. Intégrations désactivées par défaut : pas de succès fictif (SerdiPay, newsletter).  
3. Hostinger : **non configuré** à ce jour — toutes les lignes « où configurer » sont **PENDING**.

**Statut global env prod :** **NON CONFIGURÉ / BLOQUANT**.
