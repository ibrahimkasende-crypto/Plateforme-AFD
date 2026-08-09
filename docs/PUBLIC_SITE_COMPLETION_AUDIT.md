# Audit — Complétion du site public Plateforme-AFD

Date : 2026-07-17  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Routes publiques

Toutes les routes listées dans `public-navigation.ts` + CTAs + légal existent en fichiers.

## 2. Pages terminées (avant cette phase)

- `/` — homepage complète (Supabase + newsletter)

## 3–4. Pages incomplètes / temporaires

34 pages utilisaient `ModulePlaceholder` (« Module en préparation ») :
Qui sommes-nous (7), Actions (8), Impact (6), Actualités (2), Ressources (6), Contact, Adhésion, Soutenir, Mentions, Confidentialité.

## 5. Requêtes Supabase existantes

`src/lib/queries/home.ts` uniquement (stats, programmes featured, projets, news, partenaires, zones).

## 6–7. Formulaires

- Newsletter : connectée (`subscribeNewsletterAction`)
- Contact / adhésion / partenariat / dons : non connectés avant cette phase

## 8. Tables disponibles

`programmes`, `projets`, `actualites`, `galerie`, `partenaires`, `clusters`, `membres_equipe`, `membres`, `messages`, `dons`, `parametres_site`, `abonnes_newsletter` (migration)

## 9. Tables absentes (contenu géré sans inventer de données)

histoires_impact, temoignages, rapports, documents, appels_offres, opportunites, demandes_partenariat

→ Pages structurelles + états vides honnêtes ; partenariat via `messages` ; migration optionnelle non destructive si besoin.

## 10. Buckets

Voir migrations storage ; usage public via URLs dans colonnes `*_url`.

## 11. Données statiques

`home-content.ts`, contenu institutionnel validé (mission, valeurs, piliers).

## 12. Risques de régression

Header, homepage, newsletter popup, thème, responsive — ne pas modifier sauf intégration recherche.

## 13. Plan

1. Infrastructure queries/mutations/composants partagés  
2. Qui sommes-nous  
3. Actions / programmes / projets  
4. Impact / actualités  
5. Ressources  
6. Formulaires  
7. Légal / recherche / SEO / tests / commit

