# Studio de publication Supabase

## Routes

- `/admin/publications`
- `/admin/publications/actualites`
- `/admin/publications/programmes`
- `/admin/publications/histoires-impact`
- `/admin/publications/zones-intervention`
- `/admin/publications/notre-impact`
- `/admin/publications/appels-offres`
- `/admin/publications/opportunites`
- `/admin/publications/documents`
- `/admin/publications/rapports`

## Workflow

Statuts : brouillon → en_revision → approuve → programme → publie → depublie → archive

## Principes

- Pas de Decap CMS fichier/Git comme source principale
- PostgreSQL + Storage + RLS
- Revalidation `revalidatePath` / `revalidateTag` après publication
- Médiathèque : `/admin/mediatheque` + composants MediaPicker / MediaUploader

## Migration

`supabase/migrations/20260718_008_publication_studio_foundations.sql`

