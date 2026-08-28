# Complétion du site public — Plateforme-AFD

Date : 2026-07-17  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Routes publiques terminées

Toutes les routes listées ci-dessous sont fonctionnelles (pas de `ModulePlaceholder`) :

- `/`
- `/qui-sommes-nous` (+ histoire, mission-vision-valeurs, gouvernance, equipe, organigramme, politiques-engagements)
- `/actions` (+ domaines, programmes, programmes/[slug], projets, projets/[slug], urgences, zones, clusters)
- `/impact` (+ resultats, histoires, histoires/[slug], temoignages, rapports)
- `/actualites` (+ [slug])
- `/ressources` (+ mediatheque, documents, appels-offres, appels-offres/[slug], opportunites, opportunites/[slug], newsletter)
- `/contact`, `/adhesion`, `/partenariat`, `/soutenir`
- `/recherche`
- `/mentions-legales`, `/politique-confidentialite`
- `loading`, `error`, `not-found`

## 2–3. Pages et composants

- Shell : `PublicPageShell`, `PublicEntityCard`, `PublicPagination`, `PublicSearchForm`
- Formulaires : contact, membership, partnership, support, newsletter-page
- Contenu institutionnel : `src/config/institutional-content.ts`

## 4–5. Requêtes et mutations Supabase

**Queries** (`src/lib/queries/public/`) :

- organisation, programmes, projets, impact, actualites, medias, documents, appels-offres, opportunites, newsletter, partenaires, clusters, equipe, recherche, client

**Mutations** (`src/lib/mutations/public/`) :

- contact, adhesion, partnership, newsletter, dons

## 6–9. Tables, migrations, RLS, buckets

Tables utilisées côté public : programmes, projets, actualites, galerie, partenaires, clusters, membres_equipe, membres, messages, dons, parametres_site, abonnes_newsletter (migration `20260717_004`).

Tables absentes (états vides honnêtes) : histoires_impact, temoignages, rapports, appels_offres, opportunites, demandes_partenariat.

Aucune migration destructive ajoutée pour inventer du contenu. RLS existantes conservées. Buckets via migrations storage déjà présentes.

## 10–14. Formulaires

| Formulaire | Action | Mutation / table |
|---|---|---|
| Contact | `submitContactAction` | `messages` |
| Adhésion | `submitMembershipAction` | `membres` |
| Partenariat | `submitPartnershipAction` | `messages` (préfixe) |
| Newsletter | `subscribeNewsletterAction` | `abonnes_newsletter` |
| Soutenir | `createDonationIntentAction` | `dons` (intention) |

## 15. Paiement carte

Architecture `src/lib/payments/providers/card/` + `CARD_PAYMENT_ENABLED=false`.
Si non configuré : intention / virement uniquement, message clair, **aucun faux succès carte**.
SerdiPay hors périmètre (Campus Food).

## 16–18. Recherche, filtres, pagination

- `/recherche?q=`
- Filtres URL + pagination partagée sur listes dynamiques

## 19–20. SEO et tests

- `metadata` / `generateMetadata` sur pages dynamiques
- `src/app/sitemap.ts`, `src/app/robots.ts`
- Playwright : `public-site.spec.ts`, `public-forms.spec.ts`, `public-responsive.spec.ts`

## 21–23. Validation technique

- `npm run typecheck` : OK
- `npm run lint` : OK (1 warning React Hook Form `watch` sur newsletter-page-form)
- `npm run build` : OK (77 routes générées)
- Playwright public : `public-site`, `public-forms`, `public-responsive` — OK sur serveur de prod local (port 3010)

## 24. Données institutionnelles manquantes

- Adresse / téléphone / hébergeur complets (marqueurs légaux)
- Tableaux histoires, témoignages, rapports, AO, opportunités
- Logos partenaires et médias via Supabase
- Credentials paiement carte AFD (après contrat marchand)

## 25. Prochaine phase

Dashboard administrateur complet.

