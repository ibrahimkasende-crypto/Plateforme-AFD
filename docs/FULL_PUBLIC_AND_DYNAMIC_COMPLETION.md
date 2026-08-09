# Finalisation site public et contenus dynamiques AFD

Date : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`

## Routes publiques header

Toutes les routes du header (`src/config/public-navigation.ts`) ouvrent une page réelle :

- Accueil, Qui sommes-nous (+ sous-pages), Nos actions (+ sous-pages)
- Notre impact (+ histoires, témoignages, rapports, résultats)
- Actualités, Ressources (+ médiathèque, documents, AO, opportunités, newsletter)
- Contact, CTAs (`/adhesion`, `/partenariat`, `/soutenir`, `/rejoindre-equipe`, `/recherche`)
- Pages légales

## Pages temporaires

- Aucun `ModulePlaceholder` côté public
- Histoires, témoignages et appels d’offres branchés sur Supabase + EmptyState professionnel

## Contenus dynamiques

| Module | Public | Admin CRUD |
|---|---|---|
| Histoires d’impact | `/impact/histoires` | `/admin/publications/histoires-impact` |
| Témoignages | `/impact/temoignages` | `/admin/publications/temoignages` |
| Appels d’offres | `/ressources/appels-offres` | `/admin/publications/appels-offres` |
| Pages CMS | lecture par route | `/admin/publications/pages` |
| Enquêtes | `/enquetes/[slug]` | `/admin/enquetes` |
| Agents | — | `/admin/agents` |

## CMS institutionnel

Les pages Qui sommes-nous lisent d’abord `pages` / `sections_pages`.  
Si aucune page CMS publiée n’existe, un contenu de référence (`institutional-content`) reste affiché pour éviter une page vide, en attendant publication admin.

## Migration

`supabase/migrations/20260718_011_content_surveys_agents_foundations.sql`

Tables : `temoignages`, `appels_offres`, `appels_offres_documents`, `pages`, `sections_pages`, `agents_terrain`, `enquetes`, `questions_enquete`, `options_questions`, `reponses_enquete`, `reponses_questions`.

## Validation attendue

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- tests e2e routes publiques

## Non exécuté

- `git push`
- `supabase db reset`

