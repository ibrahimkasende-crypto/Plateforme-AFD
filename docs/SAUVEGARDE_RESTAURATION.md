# Sauvegarde et restauration Supabase

## Avant toute migration

1. Identifier le projet Supabase cible et arrêter les scripts historiques.
2. Exporter le schéma et les données avec Supabase CLI ou les outils PostgreSQL autorisés.
3. Exporter les objets Storage, en distinguant les buckets publics et privés.
4. Stocker les exports chiffrés dans un emplacement contrôlé, avec date, environnement et responsable.
5. Tester les migrations sur une restauration de préproduction avant toute application production.

## Restauration

La restauration doit être exécutée uniquement par une personne autorisée, selon le plan de reprise validé par l’AFD. Elle comprend la base, les politiques RLS, les fonctions, les buckets et leurs objets.

Ne pas affirmer qu’une sauvegarde automatique existe tant que sa fréquence, sa rétention et son test de restauration ne sont pas documentés dans le tableau de bord Supabase.

