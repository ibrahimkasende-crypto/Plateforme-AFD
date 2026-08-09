# Gestion des contenus — administration AFD

## Studio de publication

Entrée : `/admin/publications`

Modules :

- Actualités
- Programmes
- Histoires d’impact
- Témoignages
- Pages institutionnelles (CMS)
- Zones d’intervention
- Notre impact (indicateurs)
- Appels d’offres
- Opportunités
- Documents / Rapports

## Fonctions communes

- Création / modification via server actions + Zod
- Brouillon / publication
- Archivage soft (`deleted_at`)
- Blocage publication sans consentement (histoires, témoignages)
- `revalidatePath` après mutation

## Médiathèque

`/admin/mediatheque` — images et documents Supabase Storage.

Les formulaires acceptent une URL Storage ; le picker média avancé peut être branché progressivement sur ces champs.

