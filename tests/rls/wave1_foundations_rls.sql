/**
 * Tests RLS documentaires / exécutables via SQL Editor ou psql.
 * Exécuter avec des sessions SET ROLE / set_config('request.jwt.claim.sub', ...)
 * selon l'environnement Supabase.
 *
 * Preuve Vague 1 — politiques tables 030 + stocks.
 */

-- Attendu : anon ne lit pas finances_budgets
-- Attendu : authenticated sans rôle admin → pas de lignes (is_active_admin = false)
-- Attendu : finance avec finances:read → SELECT ok
-- Attendu : agent_terrain sans finances:read → SELECT vide / denied
-- Attendu : super_admin / platform_owner → SELECT ok

select
  'finances_budgets' as table_name,
  has_table_privilege('authenticated', 'public.finances_budgets', 'select') as auth_can_select;

select polname, cmd, qual::text, with_check::text
from pg_policies
where schemaname = 'public'
  and tablename in (
    'activites',
    'finances_budgets',
    'finances_depenses',
    'urgences',
    'stock_articles',
    'stock_mouvements',
    'background_jobs',
    'notifications'
  )
order by tablename, polname;

-- Vérifier absence de USING (true) sur policies afd_*
select polname, tablename, qual::text
from pg_policies
where schemaname = 'public'
  and tablename in (
    'activites',
    'finances_budgets',
    'finances_depenses',
    'beneficiaires_agregats',
    'urgences',
    'newsletter_campagnes',
    'rapports_generes',
    'partenariats_demandes'
  )
  and qual::text ilike '%true%';
