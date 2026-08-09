# Audit configuration Supabase & variables d’environnement

**Date :** 2026-08-04  
**Projet :** `D:\Plateforme-AFD\AFD`  
**Projet Supabase mandaté :** `mxxuxnoqnwjygawvvhcb`  
**Aucune valeur secrète dans ce document.**

---

## Synthèse

| Contrôle | Résultat |
|----------|----------|
| Clients Supabase (public / serveur / middleware) | ✓ Passent uniquement par `process.env` |
| URL Supabase codée en dur dans `src/` | ✓ Aucune |
| `.env*` secrets gitignorés | ✓ (seul `.env.example` versionné) |
| Clés `NEXT_PUBLIC_*` sans secrets serveur | ✓ |
| `.env.example` à jour | ✓ Mis à jour |
| Panel Hostinger (vars fournies) | ⚠ Compatible public, **manque `SUPABASE_SERVICE_ROLE_KEY`** |
| Prêt déploiement | ⚠ **Oui côté public** ; **bloquant admin avancé** sans service_role |

---

## 1. Variables trouvées — tableau

Légende présence : **E** = `.env.example` · **L** = `.env.local` (clés) · **P** = `.env.production` / panel Hostinger

| Nom | Obligatoire | Trouvée | Utilisée | À ajouter | À supprimer | Commentaires |
|-----|-------------|---------|----------|-----------|-------------|--------------|
| `NEXT_PUBLIC_APP_ENV` | Oui (prod) | E L* P | Oui | — | — | *peut manquer en local |
| `NEXT_PUBLIC_SITE_URL` | Oui (prod) | E L P | Oui | — | — | Auth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | E L P | Oui | — | — | Doit être `…mxxux….supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui* | E L P | Oui | Remplir si dispo | — | *ou publishable |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Oui* | E L P | Oui | — | — | Utilisée actuellement |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui (admin jobs) | E L P | Oui | **Valeur réelle Hostinger** | — | Clé présente mais **vide** L/P |
| `NEXT_PUBLIC_APP_NAME` | Non | E L P | Oui | — | — | |
| `NEXT_PUBLIC_ENABLE_DEMO_CONTENT` | Oui false prod | E L P | Oui | — | — | |
| `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA` | Oui false prod | E P | Oui | L si besoin | — | |
| `NEXT_PUBLIC_ENABLE_SPONTANEOUS_APPLICATIONS` | Non | E P | Oui | — | — | |
| `NEXT_PUBLIC_ENABLE_WATER_RIPPLE` | Non | E P | Oui | — | — | |
| `NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS` | Non | E P | Oui | — | — | |
| `NEXT_PUBLIC_ENABLE_MOBILE_RAILS` | Non | E P | Oui | — | — | |
| `NEWSLETTER_SEND_ENABLED` | Non | E P | Oui | — | — | false OK |
| `SERDIPAY_ENABLED` | Non | E P | Oui | — | — | false OK |
| `OCR_CLOUD_ENABLED` | Non | E P | Oui | — | — | false OK |
| `OCR_PROVIDER` | Non | E P | Oui | — | — | |
| `OCR_MAX_FILE_SIZE_MB` | Non | E P | Oui | — | — | |
| `OCR_MAX_PAGES` | Non | E P | Oui | — | — | |
| `OCR_DEFAULT_LANGUAGE` | Non | E P | Oui | — | — | |
| `OCR_ORGANISATION_ID` | Non | E P | Oui | — | — | |
| `OCR_*` (autres) | Non | E | Oui | P si OCR avancé | — | Documentés dans example |
| `SERDIPAY_*` | Si paiements | E | Oui | P si activation | — | |
| `EMAIL_*` | Si envoi | E (ajouté) | Oui | P si newsletter send | — | |
| `DATABASE_URL` | Scripts seed | E (ajouté) L | Scripts only | Pas Hostinger app | — | Pas Prisma/Drizzle |
| `NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED` | Non | E L | Oui | P optionnel | — | |
| `NEXT_PUBLIC_APP_VERSION` | Non | E | Oui | — | — | |
| `NEXT_PUBLIC_SOCIAL_*` | Non | E | Oui | Optionnel | — | |
| `NEXT_PUBLIC_AFD_ADMIN_DEMO` | Non | — | Alias | Ne pas utiliser | Obsolète | Préférer ENABLE_ADMIN_DEMO_DATA |
| `PLATFORM_OWNER_EMAIL` | Scripts | E L | Scripts | — | — | |
| `BACKUP_*` | Non | E | Oui | — | — | |
| `AFD_E2E_*` | E2E | E e2e | Oui | — | — | Jamais Hostinger |
| `LEGACY_SUPABASE_*` | Migration legacy | E | Scripts | — | — | Ancien projet only |
| `SUPABASE_SECRET_KEY` | — | Non | **Non** | Ne pas ajouter | — | Non utilisé |
| `SUPABASE_KEY` | — | Non | **Non** | Ne pas ajouter | — | Non used |
| `SUPABASE_ANON_KEY` (sans NEXT_PUBLIC) | — | Non | **Non** | Ne pas ajouter | — | Utiliser `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `DIRECT_URL` | — | Non | **Non** | Ne pas ajouter | — | Pas Prisma |
| `POSTGRES_URL` | — | Non | **Non** | Ne pas ajouter | — | |
| `SUPABASE_DB_URL` | — | Non | **Non** | Ne pas ajouter | — | |
| `SUPABASE_ACCESS_TOKEN` | — | Non | **Non** | Ne pas ajouter | — | CLI only externe |
| `SUPABASE_PROJECT_REF` | — | Non | **Non** | Ne pas ajouter | — | Dérivé de l’URL |
| `SUPABASE_JWT_SECRET` | — | Non | **Non** | Ne pas ajouter | — | |
| `SUPABASE_STORAGE_BUCKET` | — | Non | **Non** | Ne pas ajouter | — | Buckets en code |
| `E2E_ADMIN_EMAIL/PASSWORD` | — | Non | Corrigé | — | Obsolète | → `AFD_E2E_*` |
| `AUTH_*` | — | Non | **Non** | — | — | Auth via Supabase SSR |

\* Au moins une clé publique (anon JWT **ou** publishable).

---

## 2. Variables manquantes (avant correction)

Ajoutées dans `.env.example` :
- `DATABASE_URL` (scripts)
- `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`
- `NEXT_PUBLIC_APP_VERSION`, réseaux sociaux documentés
- `NEXT_PUBLIC_NEWSLETTER_GOOGLE_OAUTH_ENABLED`
- `PLATFORM_OWNER_EMAIL`, `BACKUP_*`, E2E, legacy
- Section explicite des variables **non utilisées**

---

## 3. Variables inutilisées / obsolètes

**Ne pas configurer sur Hostinger :**  
`SUPABASE_SECRET_KEY`, `SUPABASE_KEY`, `DIRECT_URL`, `POSTGRES_URL`, `SUPABASE_DB_URL`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_JWT_SECRET`, `SUPABASE_STORAGE_BUCKET`, `E2E_ADMIN_*`.

**Alias déprécié :** `NEXT_PUBLIC_AFD_ADMIN_DEMO` (garder `NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA=false`).

---

## 4. Connexion Supabase — validée

| Couche | Fichier | Env |
|--------|---------|-----|
| Public browser | `src/lib/supabase/client.ts` | `getSupabasePublicEnv()` |
| Serveur | `src/lib/supabase/server.ts` | idem |
| Safe / queries | `src/lib/supabase/safe.ts` | idem |
| Middleware session | `src/middleware.ts` | idem |
| Service role | `src/lib/supabase/admin-service.ts` | `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| Edge function | `supabase/functions/submit-contact` | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (runtime Deno Supabase) |

Aucune URL `*.supabase.co` hardcodée dans `src/`.

---

## 5. Storage — buckets (noms logiques, pas d’URL)

| Bucket | Usage |
|--------|--------|
| `admin-avatars` | Avatars admin |
| `afd-archives` | Archives bibliothèque |
| `documents-ocr-prives` | OCR |
| `partenaires` | Logos partenaires |
| `candidatures-privees` | Candidatures |
| `hr-payslips-private` | Bulletins paie |

À créer / vérifier sur le projet `mxxux…` avec politiques RLS adaptées.

---

## 6. Auth — validée

- Login / logout / session : actions + middleware SSR cookies  
- Callback : `{SITE_URL}/auth/callback`  
- Refresh : `@supabase/ssr` via middleware  
- Aucune dépendance à un ancien project ref dans le code runtime

---

## 7. Base PostgreSQL

- Runtime Next : **client Supabase JS uniquement** (pas Prisma / Drizzle).  
- `DATABASE_URL` : scripts (`seed-bibliotheque-from-catalog.mjs`) uniquement.  
- `DIRECT_URL` / `POSTGRES_URL` : **non utilisés**.

---

## 8. Sécurité

- ✓ Pas de `service_role` en `NEXT_PUBLIC_*`  
- ✓ `.env.local` / `.env.production` gitignorés  
- ⚠ La clé publishable et un mot de passe DB ont pu apparaître dans des logs d’outils : **rotation DB recommandée** si exposition hors machine locale  
- ⚠ `SUPABASE_SERVICE_ROLE_KEY` vide en local/prod fichier → à renseigner sur Hostinger depuis le dashboard Supabase (API → service_role)

---

## 9. Checklist Hostinger (alignement panel fourni)

| Variable panel | Statut |
|----------------|--------|
| `NEXT_PUBLIC_APP_ENV=production` | ✓ |
| `NEXT_PUBLIC_SITE_URL=https://afd-rdc.org` | ✓ |
| `NEXT_PUBLIC_SUPABASE_URL=…mxxux…` | ✓ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✓ |
| Flags demo / UI | ✓ |
| `NEWSLETTER_SEND_ENABLED=false` | ✓ |
| `SERDIPAY_ENABLED=false` | ✓ |
| OCR flags | ✓ |
| **`SUPABASE_SERVICE_ROLE_KEY`** | ❌ **À AJOUTER** (secret Hostinger) |

Optionnel : `NEXT_PUBLIC_SUPABASE_ANON_KEY` (JWT) en complément.

---

## 10. Fichiers modifiés

- `.env.example` — inventaire complet + exemples  
- `src/config/env.ts` — contrôles projet mandaté + détection service_role  
- `src/features/system/services/health.service.ts` — indicateurs config  
- `tests/e2e/admin-tenant-isolation.spec.ts` — `AFD_E2E_*`  
- `src/app/admin/systeme/page.tsx` — indicateurs service_role / projet  
- `docs/SUPABASE_CONFIGURATION_AUDIT.md` — ce rapport  

**Non modifié :** `.env.local`, `.env.production` (vos vraies clés).

---

## 11. Variables ajoutées / supprimées

**Ajoutées (example uniquement) :** `DATABASE_URL`, `EMAIL_*`, docs sociales / OAuth / E2E / legacy / backup.  

**Supprimées du code :** usage obsolète `E2E_ADMIN_*` → `AFD_E2E_*`.  

**Aucune variable secrète réelle écrite.**

---

## 12. Projet prêt pour le déploiement ?

| Critère | Verdict |
|---------|---------|
| Site public + auth utilisateur (anon/publishable) | **Prêt** si panel Hostinger = vars fournies |
| Admin invitations / OCR worker / service_role | **Non prêt** tant que `SUPABASE_SERVICE_ROLE_KEY` vide |
| Migrations DB | À confirmer séparément sur `mxxux…` |
| Storage buckets | À vérifier sur le projet |
| `npm run typecheck` | ✓ OK |
| `npm run lint` | ✓ OK (warnings historiques hors scope Supabase) |
| `npm run build` | ✓ OK (exit 0) |

**Verdict global :** compatible avec le nouveau projet Supabase **sous réserve** d’ajouter `SUPABASE_SERVICE_ROLE_KEY` sur Hostinger, puis de valider un smoke `/connexion` + page admin Système.

---

## Action immédiate Hostinger

Ajouter la variable secrète (sans préfixe `NEXT_PUBLIC_`) :

```
SUPABASE_SERVICE_ROLE_KEY=<clé service_role depuis Supabase Dashboard → Settings → API>
```

Sans cette clé : le site public fonctionne ; les invitations utilisateurs, certains jobs OCR et scripts admin restent indisponibles.
