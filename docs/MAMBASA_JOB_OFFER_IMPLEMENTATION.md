# Implémentation — Offre Mambasa & candidatures

## 1. Page source

https://afd-rdc.org/emplois/chef-de-projet-base-a-mambasa

## 2. Informations extraites

Voir `docs/MAMBASA_JOB_SOURCE_CONTENT.md`.

## 3. Fichier téléchargé

`1784241669013-offre-afd-chef-de-projet-et-officier-sante-nutrition.pdf` (PDF scanné, 7,86 Mo).

## 4. Emplacement local

`C:\Users\IKAS\Documents\Banque des documents AFD\Offres-emploi\Chef-projet-Mambasa\`

## 5. Emplacement plateforme / Supabase

- Copie publique Next : `public/documents/offres/chef-de-projet-mambasa/chef-projet-mambasa-afd.pdf`
- Seed SQL : `supabase/migrations/20260718_009_mambasa_opportunity_seed.sql`
- Upload bucket `opportunites` : à faire après application migration + credentials admin (le PDF reste servi localement en attendant)

## 6. Offre créée

- Slug : `chef-de-projet-base-a-mambasa`
- Fallback code : `src/config/migrated-opportunities.ts`
- Statut : `ouverte` (aucune date limite fournie par la source)

## 7. Section d’accueil

`src/components/public/home/open-opportunities-section.tsx`  
Masquée si aucune offre ouverte.

## 8. Page publique

`/ressources/opportunites/chef-de-projet-base-a-mambasa`  
Composant : `opportunity-detail.tsx`

## 9. Page pour postuler

`/ressources/opportunites/[slug]/postuler`  
Wizard : `application-wizard.tsx`

## 10. Champs formulaire

Perso, profil, motivation, CV obligatoire, lettre facultative, consentement + exactitude.

## 11. Bucket privé

`candidatures-privees` + RPC `attach_candidature_document`

## 12. Tables

`opportunites`, `candidatures`, `documents_candidature`

## 13. RLS

Seed SQL ajoute RPC security definer pour métadonnées fichiers.  
CV non publics.

## 14. Permissions RH

Existantes : `opportunites:*`, `candidatures:*` (rôle ressources_humaines).

## 15. SEO

`generateMetadata` + JSON-LD `JobPosting` (champs vérifiés uniquement).

## 16. Tests

- `tests/e2e/mambasa-job-offer.spec.ts`
- `tests/e2e/mambasa-job-application.spec.ts`
- `tests/e2e/admin-mambasa-applications.spec.ts`

## 17. Informations manquantes

Date limite, contrat, responsabilités texte, profil, compétences, pièces listées (PDF image).

## 18. Typecheck

`npm run typecheck` — OK (exit 0)

## 19. Lint

`npm run lint` — OK (0 erreur ; 4 warnings préexistants React Hook Form / unused)

## 20. Build

`npm run build` — OK (Next.js 16.2.10)

## Note opérationnelle

Appliquer sur Supabase la migration `20260718_009_mambasa_opportunity_seed.sql` pour que les candidatures passent la contrainte FK `opportunite_id`. Sans migration, l’offre reste visible via le fallback `migrated-opportunities.ts`.
