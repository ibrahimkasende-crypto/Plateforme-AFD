# Import des logos partenaires officiels AFD

## 1. URL analysée

https://afd-rdc.org/ — section « Ils nous font confiance » / « Nos partenaires »

## 2. Partenaires détectés

**13** partenaires actifs avec logo (API publique de l’ancien site) :

1. MINISTERE DE LA SANTE PUBLIQUE, HYGIENE ET PREVOYANCE SOCIALE  
2. CHWID  
3. CARITAS  
4. ROJAF  
5. CASAMED  
6. IMPACT SANTE AFRIQUE  
7. CS4ME  
8. UAF  
9. RACOJ  
10. PSDS  
11. ALLEVIATE  
12. PNSR  
13. SI JEUNESSE SAVAIT  

Aucun UNICEF / OCHA / CARE / USAID ajouté (absents de l’affichage source).

## 3. Logos téléchargés

13 fichiers originaux dans  
`C:\Users\IKAS\Documents\Banque des images AFD\08_Partenaires\00_Originaux\`

## 4. Logos non identifiés

0

## 5. Doublons

0 (SHA-256 distincts)

## 6. Fichiers optimisés

13 PNG dans `01_Optimises/` et `public/images/afd/partenaires/`  
(largeur max 1000 px, proportions conservées, transparence préservée)

## 7. Bucket utilisé

`partenaires` (public)

## 8. Lignes Supabase créées

- Migration `supabase/migrations/20260718_010_partenaires_logos_import.sql`  
  - enrichit `partenaires` + `medias.source_url`  
  - upsert des 13 partenaires (UUID legacy conservés)  
  - désactive les seeds historiques non vérifiés  
  - policy Storage write admin  
- Script `scripts/import-partner-logos-from-legacy-site.ts` : upload Storage + `medias` si `SUPABASE_SERVICE_ROLE_KEY` est définie

## 9. Partenaires mis à jour

Upsert idempotent sur les 13 UUID ; seeds historiques désactivés.

## 10. Section d’accueil

`src/components/public/home/partners-section.tsx`  
Titre « Ils nous font confiance » / « Nos partenaires », grille responsive, données via `getActivePublicPartners()`.

## 11. Page partenaires

`/partenaires` — introduction, filtres catégorie, grille, liste descriptive (sans invention), CTA partenariat.

## 12. CRUD

- `/admin/partenaires`  
- `/admin/partenaires/nouveau`  
- `/admin/partenaires/[id]`  
- `/admin/partenaires/[id]/modifier`  

Fonctions : créer, modifier, importer logo, publier/dépublier, activer/désactiver, ordre numérique, archiver/restaurer, prévisualiser.

## 13. RLS

- Public : lecture `active + publie + deleted_at is null`  
- Admin : `partenaires_gerer` / permissions app `partenaires:read|write`  
- Storage : lecture publique ; écriture admin sur bucket `partenaires`

## 14. Tests

Validation manuelle responsive prévue (320 → 1440).  
Commandes automatisées : typecheck, lint, build (voir ci-dessous).

## 15. Typecheck

`npm run typecheck` → **succès** (exit 0)

## 16. Lint

`npm run lint` → **succès** (exit 0)  
4 warnings préexistants (newsletter / impact-and-news) — hors périmètre partenaires.

## 17. Build

`npm run build` → **succès** (exit 0)  
Routes confirmées : `/partenaires`, `/admin/partenaires`, `/admin/partenaires/nouveau`, `/admin/partenaires/[id]`, `/admin/partenaires/[id]/modifier`.

## Notes d’exécution

- Runtime du site : **aucune dépendance live** à afd-rdc.org  
- Logos locaux `/images/afd/partenaires/...` jusqu’à upload Storage  
- Clé `service_role` jamais exposée au navigateur  
- Pas de push GitHub dans cette opération

