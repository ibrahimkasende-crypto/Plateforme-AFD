# Correctif — erreur « relation administrateurs n'existe pas »

## Cause

La migration `20260715_001_security_foundations.sql` copiait les lignes depuis `public.administrateurs`.  
Sur le projet Supabase AFD distant, cette table **n’existe pas** → erreur `42P01`.

## Correctif appliqué dans le dépôt

Le bloc d’insertion est désormais conditionnel : il ne s’exécute que si `administrateurs` existe.

## Que faire maintenant dans le SQL Editor

1. Recharger le fichier local mis à jour  
   `supabase/migrations/20260715_001_security_foundations.sql`
2. Coller **tout** le contenu dans le SQL Editor Supabase
3. Exécuter (**Run**)
4. Ensuite exécuter  
   `supabase/migrations/20260718_005_admin_auth_roles_journal.sql`

## Vérification

```sql
select to_regclass('public.profils_administrateurs');
select to_regclass('public.roles');
select nom from roles order by nom;
```
