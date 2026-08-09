# Audit — Import offre Mambasa

Date d’audit : 2026-07-18  
Projet : `D:\Plateforme-AFD\AFD`

## 1. Routes existantes

| Route | Rôle |
|-------|------|
| `/ressources/opportunites` | Liste publique filtrée |
| `/ressources/opportunites/[slug]` | Fiche détail + formulaire inline |
| `/rejoindre-equipe` | Carrières + spontanée (feature flag) |
| `/admin/opportunites` | Liste admin |
| `/admin/opportunites/nouvelle` | Création minimale |
| `/admin/opportunites/[id]` | Actions publish / close |
| `/admin/opportunites/[id]/modifier` | Édition partielle |
| `/admin/candidatures` | Liste + statut + CV signé |

## 2. Composants existants

- `src/components/public/home/open-opportunities.tsx`
- `src/components/public/opportunites/opportunity-card.tsx`
- `src/components/public/opportunites/application-form.tsx`
- `src/features/opportunites/actions/*`

## 3. Tables existantes

- `opportunites` (slug UNIQUE)
- `candidatures`
- `documents_candidature`
- `medias` (Studio, générique)
- `departements`, `categories_opportunites`

## 4. Buckets

- `opportunites` (public) — assets offres
- `candidatures-privees` (privé) — CV
- `documents-publics` / `documents-prives`

## 5. Fonctionnalités manquantes (avant import)

- Pas de page `/postuler` dédiée multi-étapes
- Pas de confirmation dédiée
- Formulaire admin incomplet vs schéma
- Document d’offre non branché sur la fiche
- Accordion / sidebar récap absents
- RLS : insert `documents_candidature` non public (risque upload métadonnées)
- Aucune offre seed `chef-de-projet-base-a-mambasa` dans le repo

## 6. Risques de doublons

- Contrainte UNIQUE sur `slug`
- Soft-delete ne libère pas le slug
- Plan : upsert par slug `chef-de-projet-base-a-mambasa`

## 7. Plan d’intégration

1. Extraire contenu vérifié (API publique ancien site + PDF)
2. Stocker PDF localement + copie `public/documents/...`
3. Seed / fallback applicatif + migration SQL
4. Moderniser section accueil (masquée si 0 offre ouverte)
5. Page détail + document + postuler
6. Sécuriser dépôt candidature
7. Docs + tests + commit local (pas de push)

