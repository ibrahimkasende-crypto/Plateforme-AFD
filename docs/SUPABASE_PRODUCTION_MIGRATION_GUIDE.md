# Migrations Supabase — production

## Principes

- **Ne jamais** lancer `supabase db reset` en production.
- Le déploiement Next.js (GitHub Actions / `deploy-production.sh`) **n’applique pas** automatiquement les migrations SQL.
- Les données, Auth et Storage restent chez Supabase (`mxxuxnoqnwjygawvvhcb`).

## Emplacement

```text
supabase/migrations/*.sql
```

## Procédure sûre recommandée

1. Relire la migration localement.
2. Appliquer **explicitement** sur le projet prod (SQL Editor Supabase ou CLI avec lien prod), **avant** ou dans une fenêtre contrôlée **séparée** du deploy app.
3. Vérifier l’absence d’erreurs.
4. Déployer ensuite le code applicatif qui dépend de ces colonnes/tables.

Exemple CLI (seulement si le projet est lié et que vous savez ce que vous faites) :

```bash
# Sur une machine de confiance, jamais dans un job Actions non contrôlé :
npx supabase db push --linked
```

## Ce que le pipeline doit éviter

- Reset
- Seed destructif
- Suppression de buckets Storage
- Application aveugle de seeds démo

## Rollback schéma

Prévoir une migration inverse manuelle si une migration est risquée.  
Le rollback applicatif (`rollback-production.sh`) **ne remet pas** le schéma SQL en arrière.
