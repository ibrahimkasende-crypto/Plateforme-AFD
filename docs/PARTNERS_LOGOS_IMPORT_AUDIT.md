# Audit — gestion des logos partenaires

Date : 2026-07-18  
Projet : Plateforme-AFD (`D:\Plateforme-AFD\AFD`)  
Source de vérité affichée : [afd-rdc.org](https://afd-rdc.org/) — section « Ils nous font confiance » / « Nos partenaires »

## 1. Partenaires actuellement codés en dur

| Emplacement | Contenu | Statut |
|---|---|---|
| Seeds SQL historiques (`20260223_*`, `20260224_setup_complet.sql`) | UNICEF, ONU Femmes, OMS, UE, etc. **sans logos** | À désactiver — absents de afd-rdc.org |
| `home-content.ts` → `partenairesActifs` | KPI numérique | Aligné sur **13** partenaires vérifiés |
| `src/config/legacy-partners.ts` | Liste officielle des 13 partenaires + chemins logos locaux | Source de secours / import |
| UI home (`partners-section.tsx`) | Plus de placeholders inventés | Données via `getActivePublicPartners()` |

## 2. Logos locaux existants

| Chemin | État |
|---|---|
| `public/assets/partenaires/` | Vide (`.gitkeep`) |
| `public/images/afd/partenaires/` | **13 PNG optimisés** importés depuis afd-rdc.org |
| Banque locale `Documents\Banque des images AFD\08_Partenaires\` | Originaux + optimisés + inventaire CSV |

## 3. Partenaires présents dans Supabase (plateforme)

Schéma de base (avant migration `20260718_010`) :

- `id`, `name`, `logo_url`, `category`, `order`, `active`, `created_at`

Après migration :

- + `acronyme`, `slug`, `description`, `website_url`, `logo_media_id`, `publie`, `mise_en_avant`, `source_url`, `source_imported_at`, `updated_at`, `deleted_at`

Les seeds historiques (UNICEF…) ne correspondent **pas** aux partenaires affichés sur l’ancien site.

## 4. Doublons possibles

| Type | Résultat |
|---|---|
| Hash SHA-256 des 13 originaux | **Aucun doublon binaire** |
| Seeds SQL vs partenaires réels | Doublons **sémantiques** (noms inventés) → désactivation SQL |
| Ancien site vs plateforme | Même UUID conservés pour l’upsert idempotent |

## 5. Bucket disponible

- Bucket public `partenaires` (migration `20260718_008`)
- Lecture publique Storage déjà créée
- Écriture admin ajoutée dans `20260718_010` (`partenaires_gerer` / `medias_gerer` / `super_admin`)

Structure cible :

```
partenaires/{partner_id}/logo-principal.ext
partenaires/{partner_id}/logo-original.ext
```

## 6. Composants à modifier / créés

| Fichier | Rôle |
|---|---|
| `src/components/public/home/partners-section.tsx` | Section accueil modernisée |
| `src/components/public/partners/partner-logo-card.tsx` | Carte logo |
| `src/components/public/partners/partners-grid.tsx` | Grille responsive |
| `src/app/(public)/partenaires/page.tsx` | Page publique |
| `src/app/admin/partenaires/**` | CRUD admin |
| `src/lib/queries/partenaires.ts` | `getActivePublicPartners()` |
| `src/features/partenaires/**` | Actions serveur |
| `src/services/partenaires.service.ts` | `revalidateTag("partenaires")` |

## 7. Risques de régression

1. Migration non appliquée → colonnes `publie` / `deleted_at` absentes → requête enrichie échoue, fallback minimal ou liste legacy.
2. Seeds historiques encore `active=true` avant migration → faux partenaires visibles.
3. Upload Storage sans permission admin → logo non remplacé depuis le CRUD.
4. `SUPABASE_SERVICE_ROLE_KEY` absente → script d’import reste en mode local (logos publics `/images/afd/partenaires/...`).
5. Ancienne section marquee remplacée par grille → comportement d’animation différent (volontaire).

## 8. Plan d’import

1. Audit DOM / API legacy → 13 partenaires confirmés  
2. Téléchargement originaux → banque `08_Partenaires/00_Originaux`  
3. Optimisation PNG → `01_Optimises` + `public/images/afd/partenaires`  
4. Migration SQL upsert + désactivation seeds  
5. Script `scripts/import-partner-logos-from-legacy-site.ts` (idempotent, upload si service role)  
6. UI publique + CRUD + RLS Storage write  
7. Validation typecheck / lint / build  
8. Commit local (pas de push)

