# Disaster recovery

1. Restaurer snapshot PostgreSQL Supabase
2. Restaurer buckets Storage
3. Vérifier Auth users
4. Rejouer migrations manquantes si besoin
5. Tester connexion admin + RLS

Ne pas utiliser `supabase db reset` en production.
