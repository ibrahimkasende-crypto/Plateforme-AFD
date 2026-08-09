# Architecture alignée V2 — Plateforme-AFD

**Date :** 17 juillet 2026  
**Branche :** `reconstruction-nextjs`

## 1. Architecture publique

Groupe de routes `src/app/(public)/` avec layout header/footer, hero, pages temporaires professionnelles.

## 2. Architecture administrative

`src/app/admin/` avec sidebar centralisée, dashboard KPI/graphiques préparés (sans fausses données), modules placeholders.

## 3. Navigation publique

`src/config/public-navigation.ts` — Accueil, Qui sommes-nous, Nos actions, Notre impact, Actualités, Ressources, Contact + CTA Nous rejoindre / Soutenir l’AFD. Sous-menus accessibles (desktop hover/click, mobile accordéon).

## 4. Navigation administrative

`src/config/admin-navigation.ts` — groupes Tableau de bord, Gestion des actions, Finances, Communication, Organisation, Demandes, Suivi et rapports, Administration.

## 5. Features

`src/features/*` : organisation, programmes, projets, activites, beneficiaires, indicateurs, impact, actualites, mediatheque, newsletter, adhesions, contact, dons, paiements, partenaires, statistiques, rapports, utilisateurs, journal-activite.

## 6. Services

`src/services/*.service.ts` — accès data centralisé (stubs typés, pas d’appels dans les composants de présentation).

## 7. Providers

`src/providers/` — QueryProvider (TanStack), ThemeProvider, ToasterProvider, AppProviders.

## 8. Rôles

`src/config/roles.ts` — super_admin, direction_generale, secretariat, charge_programmes, coordinations, logistique, RH, finance, communication, lecture_partenaire.

## 9. Permissions

`src/config/permissions.ts` — matrice indicative ; vérification future RLS + serveur obligatoire.

## 10. Graphiques prévus

`src/components/charts/` — BeneficiaryEvolution, ProjectStatus/Sector, BeneficiariesByProvince, MonthlyActivities, BudgetComparison, NewsletterGrowth, DonationsEvolution, IndicatorProgress (props typées, Recharts).

## 11. Newsletter

Schémas Zod, services préparés, interface `NewsletterProvider` — pas d’envoi fictif.

## 12. Rapports

Routes admin rapports + `ReportPreview` + `report-types.ts`.

## 13. Module Soutenir l’AFD

Route `/soutenir`, types de soutien dans `site.ts`, schéma intention de don Zod, séparation intention / transaction.

## 14. Architecture SerdiPay

`PaymentProvider` + provider `serdipay/` + routes API create/status/webhook/return. Erreurs explicites « SerdiPay n’est pas encore configuré ». Aucun faux succès.

## 15. Informations SerdiPay manquantes

Voir `docs/SERDIPAY_INTEGRATION_REQUIREMENTS.md`.

## 16. Tables Supabase existantes

programmes, projets, actualites, galerie, membres_equipe, partenaires, clusters, membres, dons, messages, parametres_site, administrateurs (+ RBAC phase 4).

## 17. Tables proposées

Voir `docs/SUPABASE_TARGET_SCHEMA.md` (additif, non destructif).

## 18. Routes temporaires

Toutes les routes publiques/admin non encore métier affichent `ModulePlaceholder` (« Module en préparation »).

## 19. Tests réalisés

| Commande | Résultat |
|----------|----------|
| `npm run typecheck` | OK |
| `npm run lint` | OK |
| `npm run build` | OK (73 pages générées) |

Commit local : `chore: align Plateforme-AFD architecture for development` (`6f5ec54`).

## 20. Prochaines étapes

1. Brancher Supabase SSR sur programmes / projets / actualités réels  
2. Auth admin + enforcement rôles  
3. Formulaire Soutenir + intentions_don  
4. Intégration SerdiPay dès documentation officielle  
5. Newsletter provider réel  
6. Contenu institutionnel page par page  

## Redirections anciennes URLs

`/about`, `/programs`, `/projects`, `/news`, `/donate`, `/gallery`, etc. → nouvelles routes FR.

