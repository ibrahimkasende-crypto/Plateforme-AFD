# Supabase Media Storage

## Buckets publics

programmes, projets, actualites, histoires-impact, zones-intervention, equipe, partenaires, documents-publics, rapports-publics, site-public, opportunites, appels-offres

## Buckets privés

documents-prives, candidatures-privees

## Table `medias`

Métadonnées uniquement (chemin, MIME, alt, crédit, consentement, visibilité…).

## Migration locale

`npx tsx scripts/migrate-local-assets-to-supabase.ts --dry-run`

Nécessite `SUPABASE_SERVICE_ROLE_KEY` pour un upload réel. Ne supprime pas les fichiers locaux.

