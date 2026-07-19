-- Audit RLS exécutable — preuve standard opérationnel
-- Fonction security definer pour lecture catalogue pg_policies uniquement.

create or replace function public.afd_rls_audit_report()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  result jsonb;
begin
  -- Réservé aux admins actifs (ou service_role)
  if auth.role() = 'authenticated' and not public.is_active_admin() then
    raise exception 'forbidden';
  end if;

  select jsonb_build_object(
    'checked_at', now(),
    'tables_without_rls', coalesce((
      select jsonb_agg(c.relname order by c.relname)
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relkind = 'r'
        and c.relname = any(array[
          'activites','finances_budgets','finances_depenses','finances_transactions',
          'urgences','stock_articles','stock_mouvements','stock_entrepots',
          'background_jobs','notifications','logistique_demandes',
          'indicateur_valeurs','agent_appareils','beneficiaires_agregats'
        ])
        and not c.relrowsecurity
    ), '[]'::jsonb),
    'permissive_true_policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'table', tablename,
        'policy', policyname,
        'cmd', cmd,
        'qual', qual
      ) order by tablename, policyname)
      from pg_policies
      where schemaname = 'public'
        and tablename = any(array[
          'activites','finances_budgets','finances_depenses','finances_transactions',
          'urgences','stock_articles','stock_mouvements','beneficiaires_agregats',
          'newsletter_campagnes','rapports_generes','logistique_demandes'
        ])
        and (
          coalesce(qual, '') ~* '^\s*true\s*$'
          or coalesce(with_check, '') ~* '^\s*true\s*$'
          or coalesce(qual, '') ilike '%using (true)%'
        )
    ), '[]'::jsonb),
    'rls_enabled_count', (
      select count(*)::int
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relkind = 'r'
        and c.relrowsecurity
        and c.relname = any(array[
          'activites','finances_budgets','finances_depenses','finances_transactions',
          'urgences','stock_articles','stock_mouvements','stock_entrepots',
          'background_jobs','notifications','logistique_demandes',
          'indicateur_valeurs','agent_appareils','beneficiaires_agregats'
        ])
    ),
    'pass', (
      select
        not exists (
          select 1
          from pg_class c
          join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 'public'
            and c.relkind = 'r'
            and c.relname = any(array[
              'activites','finances_budgets','finances_depenses','finances_transactions',
              'urgences','stock_articles','stock_mouvements','stock_entrepots',
              'background_jobs','notifications','logistique_demandes',
              'indicateur_valeurs','agent_appareils','beneficiaires_agregats'
            ])
            and not c.relrowsecurity
        )
        and not exists (
          select 1
          from pg_policies
          where schemaname = 'public'
            and tablename = any(array[
              'activites','finances_budgets','finances_depenses','finances_transactions',
              'urgences','stock_articles','stock_mouvements','beneficiaires_agregats',
              'newsletter_campagnes','rapports_generes','logistique_demandes'
            ])
            and (
              coalesce(qual, '') ~* '^\s*true\s*$'
              or coalesce(with_check, '') ~* '^\s*true\s*$'
            )
        )
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.afd_rls_audit_report() from public;
grant execute on function public.afd_rls_audit_report() to authenticated;
grant execute on function public.afd_rls_audit_report() to service_role;
