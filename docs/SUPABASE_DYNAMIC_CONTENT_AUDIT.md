# Audit — Contenus dynamiques Supabase

**Date :** 18 juillet 2026  
**Projet :** `D:\Plateforme-AFD\AFD`

## 1. Contenus encore hardcodés (avant / pendant migration)

| Contenu | Emplacement | Statut cible |
|---------|-------------|--------------|
| Domaines d’intervention | `intervention-domains.ts` (secours) | Table `domaines_intervention` |
| Actualités migrées | `migrated-news.ts` (secours) | Table `actualites` |
| Stats impact validées | `homeContent.publishedImpactStats` | Table `chiffres_impact` |
| Démo zones | `demo-data/intervention-zones.ts` (`isDemo`) | `zones_intervention` + `is_demo` |
| Images locales | `public/images/afd/**` | Buckets Storage + `medias` |

## 2. Images locales

- `public/images/afd/programmes/*.jpg`
- `public/images/afd/actualites/*.jpg`
- Logos / favicons restent dans `public`

## 3. Tables disponibles / ajoutées

Existantes : `actualites`, `programmes`, `projets`, `partenaires`, opportunités, documents…  
Ajout migration `20260718_008` : `medias`, `domaines_intervention`, `chiffres_impact`, `histoires_impact`, `journal_publication`, `zones_intervention`

## 4. Buckets

`site-public`, `programmes`, `projets`, `actualites`, `histoires-impact`, `zones-intervention`, `equipe`, `partenaires`, `opportunites`, `appels-offres`, `documents-publics`, `rapports-publics`, `documents-prives`, `candidatures-privees`

## 5. Déjà dynamiques

- Programmes / projets / partenaires (Supabase)
- Actualités publiées (Supabase, avec secours migré)
- Opportunités / documents (modules existants)

## 6–10. Doublons, migrations, risques

- Éviter doublons actualités par slug / titre / source
- Ne pas supprimer les constantes avant migration réussie
- Risque : migration SQL non appliquée → secours local actif
- Script : `scripts/migrate-local-assets-to-supabase.ts --dry-run`
