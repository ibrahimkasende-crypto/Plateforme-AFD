-- Dashboard admin — agrégats mensuels, alertes et RPC get_admin_dashboard.
-- Non destructif : colonnes is_demo ajoutées uniquement si absentes.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Colonne is_demo sur tables existantes (marquage données de démo)
-- ---------------------------------------------------------------------------
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'projets', 'programmes', 'partenaires', 'messages', 'membres', 'dons', 'actualites'
  ]
  loop
    if to_regclass(format('public.%I', tbl)) is not null then
      execute format(
        'alter table public.%I add column if not exists is_demo boolean not null default false',
        tbl
      );
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- dashboard_stats_mensuelles — agrégats bénéficiaires par mois / province
-- ---------------------------------------------------------------------------
create table if not exists public.dashboard_stats_mensuelles (
  id uuid primary key default gen_random_uuid(),
  mois date not null,
  province text not null,
  programme_id uuid references public.programmes (id) on delete set null,
  projet_id uuid references public.projets (id) on delete set null,
  femmes integer not null default 0,
  hommes integer not null default 0,
  enfants integer not null default 0,
  jeunes integer not null default 0,
  total integer not null default 0,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_stats_mensuelles_mois_idx
  on public.dashboard_stats_mensuelles (mois desc);

create index if not exists dashboard_stats_mensuelles_province_idx
  on public.dashboard_stats_mensuelles (province);

create index if not exists dashboard_stats_mensuelles_demo_batch_idx
  on public.dashboard_stats_mensuelles (demo_batch_id)
  where demo_batch_id is not null;

-- ---------------------------------------------------------------------------
-- dashboard_activites_mensuelles
-- ---------------------------------------------------------------------------
create table if not exists public.dashboard_activites_mensuelles (
  id uuid primary key default gen_random_uuid(),
  mois date not null,
  category text not null
    check (category in (
      'Formations', 'Sensibilisations', 'Distributions',
      'Réunions', 'Missions', 'Autres'
    )),
  value integer not null default 0,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_activites_mensuelles_mois_idx
  on public.dashboard_activites_mensuelles (mois desc);

create index if not exists dashboard_activites_mensuelles_demo_batch_idx
  on public.dashboard_activites_mensuelles (demo_batch_id)
  where demo_batch_id is not null;

-- ---------------------------------------------------------------------------
-- dashboard_budget_mensuel
-- ---------------------------------------------------------------------------
create table if not exists public.dashboard_budget_mensuel (
  id uuid primary key default gen_random_uuid(),
  mois date not null,
  prevu numeric not null default 0,
  depense numeric not null default 0,
  currency text not null default 'USD',
  programme_id uuid references public.programmes (id) on delete set null,
  is_demo boolean not null default false,
  demo_batch_id text,
  created_at timestamptz not null default now()
);

create index if not exists dashboard_budget_mensuel_mois_idx
  on public.dashboard_budget_mensuel (mois desc);

create index if not exists dashboard_budget_mensuel_demo_batch_idx
  on public.dashboard_budget_mensuel (demo_batch_id)
  where demo_batch_id is not null;

-- ---------------------------------------------------------------------------
-- admin_alertes
-- ---------------------------------------------------------------------------
create table if not exists public.admin_alertes (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info'
    check (level in ('info', 'warning', 'critical')),
  title text not null,
  summary text not null,
  href text not null default '/admin',
  created_at timestamptz not null default now(),
  is_read boolean not null default false,
  is_demo boolean not null default false,
  demo_batch_id text
);

create index if not exists admin_alertes_created_at_idx
  on public.admin_alertes (created_at desc);

create index if not exists admin_alertes_demo_batch_idx
  on public.admin_alertes (demo_batch_id)
  where demo_batch_id is not null;

-- ---------------------------------------------------------------------------
-- RLS — nouvelles tables dashboard
-- ---------------------------------------------------------------------------
alter table public.dashboard_stats_mensuelles enable row level security;
alter table public.dashboard_activites_mensuelles enable row level security;
alter table public.dashboard_budget_mensuel enable row level security;
alter table public.admin_alertes enable row level security;

drop policy if exists "Admins lisent dashboard stats mensuelles" on public.dashboard_stats_mensuelles;
create policy "Admins lisent dashboard stats mensuelles"
on public.dashboard_stats_mensuelles for select to authenticated
using (public.is_active_admin());

drop policy if exists "Admins gerent dashboard stats mensuelles" on public.dashboard_stats_mensuelles;
create policy "Admins gerent dashboard stats mensuelles"
on public.dashboard_stats_mensuelles for all to authenticated
using (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
)
with check (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
);

drop policy if exists "Admins lisent dashboard activites mensuelles" on public.dashboard_activites_mensuelles;
create policy "Admins lisent dashboard activites mensuelles"
on public.dashboard_activites_mensuelles for select to authenticated
using (public.is_active_admin());

drop policy if exists "Admins gerent dashboard activites mensuelles" on public.dashboard_activites_mensuelles;
create policy "Admins gerent dashboard activites mensuelles"
on public.dashboard_activites_mensuelles for all to authenticated
using (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
)
with check (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
);

drop policy if exists "Admins lisent dashboard budget mensuel" on public.dashboard_budget_mensuel;
create policy "Admins lisent dashboard budget mensuel"
on public.dashboard_budget_mensuel for select to authenticated
using (public.is_active_admin());

drop policy if exists "Admins gerent dashboard budget mensuel" on public.dashboard_budget_mensuel;
create policy "Admins gerent dashboard budget mensuel"
on public.dashboard_budget_mensuel for all to authenticated
using (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
)
with check (
  public.has_role('super_admin')
  or (select auth.jwt() ->> 'role') = 'service_role'
);

drop policy if exists "Admins lisent admin alertes" on public.admin_alertes;
create policy "Admins lisent admin alertes"
on public.admin_alertes for select to authenticated
using (public.is_active_admin());

drop policy if exists "Admins gerent admin alertes" on public.admin_alertes;
create policy "Admins gerent admin alertes"
on public.admin_alertes for all to authenticated
using (
  public.has_role('super_admin')
  or public.has_permission('dashboard:read')
  or (select auth.jwt() ->> 'role') = 'service_role'
)
with check (
  public.has_role('super_admin')
  or public.has_permission('dashboard:read')
  or (select auth.jwt() ->> 'role') = 'service_role'
);

-- ---------------------------------------------------------------------------
-- Helpers internes (non exposés)
-- ---------------------------------------------------------------------------
create or replace function public._dashboard_can_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and public.is_active_admin()
    and (
      public.has_permission('dashboard:read')
      or public.has_permission('statistiques:read')
      or public.has_role('super_admin')
      or public.has_role('administrateur')
      or public.has_role('editeur')
      or public.has_role('finance')
      or exists (
        select 1
        from public.utilisateurs_roles ur
        where ur.utilisateur_id = auth.uid()
      )
    );
$$;

revoke all on function public._dashboard_can_access() from public;

create or replace function public._dashboard_kpi(
  p_label text,
  p_value numeric,
  p_available boolean default true,
  p_variation_pct numeric default null,
  p_tooltip text default null
)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object(
    'label', p_label,
    'value', case when p_available then p_value else null end,
    'formatted', case
      when not p_available or p_value is null then '—'
      else to_char(round(p_value), 'FM999G999G999G999')
    end,
    'variation_pct', p_variation_pct,
    'available', p_available,
    'tooltip', p_tooltip
  );
$$;

-- ---------------------------------------------------------------------------
-- RPC principale : get_admin_dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_admin_dashboard(
  p_date_start date default null,
  p_date_end date default null,
  p_programme_id uuid default null,
  p_province text default null,
  p_projet_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_start date := coalesce(p_date_start, date_trunc('month', current_date - interval '5 months')::date);
  v_end date := coalesce(p_date_end, current_date);
  v_used_demo boolean := false;
  v_demo_batch_id text := null;
  v_personnes numeric := 0;
  v_femmes numeric := 0;
  v_projets_actifs integer := 0;
  v_activites integer := 0;
  v_partenaires integer := 0;
  v_budget_depense numeric := 0;
  v_pending_messages integer := 0;
  v_pending_adhesions integer := 0;
  v_dons_intentions integer := 0;
  v_newsletter integer := null;
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Non authentifié';
  end if;

  if not public._dashboard_can_access() then
    raise exception 'Accès refusé — profil administrateur actif avec rôle requis';
  end if;

  -- Détection données démo utilisées
  select
    bool_or(coalesce(is_demo, false)),
    max(demo_batch_id) filter (where demo_batch_id is not null)
  into v_used_demo, v_demo_batch_id
  from (
    select is_demo, demo_batch_id
    from public.dashboard_stats_mensuelles
    where mois between v_start and v_end
      and (p_province is null or province ilike p_province)
      and (p_programme_id is null or programme_id = p_programme_id)
      and (p_projet_id is null or projet_id = p_projet_id)
    union all
    select is_demo, demo_batch_id
    from public.dashboard_activites_mensuelles
    where mois between v_start and v_end
    union all
    select is_demo, demo_batch_id
    from public.dashboard_budget_mensuel
    where mois between v_start and v_end
      and (p_programme_id is null or programme_id = p_programme_id)
    union all
    select is_demo, demo_batch_id
    from public.admin_alertes
    where created_at::date between v_start and v_end
  ) demo_probe;

  v_used_demo := coalesce(v_used_demo, false);

  -- KPI personnes / femmes : stats mensuelles (dernier mois de la période) + fallback projets
  select
    coalesce(sum(s.total), 0),
    coalesce(sum(s.femmes), 0)
  into v_personnes, v_femmes
  from public.dashboard_stats_mensuelles s
  where s.mois = (
    select max(mois)
    from public.dashboard_stats_mensuelles
    where mois between v_start and v_end
  )
    and (p_province is null or s.province ilike p_province)
    and (p_programme_id is null or s.programme_id = p_programme_id)
    and (p_projet_id is null or s.projet_id = p_projet_id);

  if v_personnes = 0 and to_regclass('public.projets') is not null then
    select coalesce(sum(p.beneficiaries), 0)
    into v_personnes
    from public.projets p
    where coalesce(p.active, true)
      and coalesce(p.is_demo, false) = false
      and (p_programme_id is null or p.program_id = p_programme_id)
      and (p_projet_id is null or p.id = p_projet_id)
      and (
        p_province is null
        or coalesce(p.location, '') ilike '%' || p_province || '%'
      );
  end if;

  if to_regclass('public.projets') is not null then
    select count(*)::integer
    into v_projets_actifs
    from public.projets p
    where coalesce(p.active, true)
      and not coalesce(p.is_demo, false)
      and (p_programme_id is null or p.program_id = p_programme_id)
      and (p_projet_id is null or p.id = p_projet_id)
      and (
        p_province is null
        or coalesce(p.location, '') ilike '%' || p_province || '%'
      )
      and coalesce(lower(p.status), 'en_cours') in (
        'en_cours', 'active', 'actif', 'ongoing', 'planifie', 'planifié', 'planned', 'futur'
      );
  end if;

  select coalesce(sum(a.value), 0)::integer
  into v_activites
  from public.dashboard_activites_mensuelles a
  where a.mois between v_start and v_end;

  if to_regclass('public.partenaires') is not null then
    select count(*)::integer
    into v_partenaires
    from public.partenaires pt
    where coalesce(pt.active, true)
      and not coalesce(pt.is_demo, false);
  end if;

  select coalesce(sum(b.depense), 0)
  into v_budget_depense
  from public.dashboard_budget_mensuel b
  where b.mois between v_start and v_end
    and (p_programme_id is null or b.programme_id = p_programme_id);

  if to_regclass('public.messages') is not null then
    select count(*)::integer
    into v_pending_messages
    from public.messages m
    where not coalesce(m.is_demo, false)
      and coalesce(lower(m.status), 'unread') in (
        'unread', 'pending', 'nouveau', 'new', 'non_lu'
      );
  end if;

  if to_regclass('public.membres') is not null then
    select count(*)::integer
    into v_pending_adhesions
    from public.membres mb
    where not coalesce(mb.is_demo, false)
      and coalesce(lower(mb.status), 'pending') in (
        'pending', 'en_attente', 'nouveau'
      );
  end if;

  if to_regclass('public.dons') is not null then
    select count(*)::integer
    into v_dons_intentions
    from public.dons d
    where not coalesce(d.is_demo, false)
      and coalesce(lower(d.status), 'pending') in (
        'pending', 'intent', 'intention'
      );
  end if;

  if to_regclass('public.abonnes_newsletter') is not null then
    begin
      execute $q$
        select count(*)::integer
        from public.abonnes_newsletter
        where statut = 'actif'
      $q$ into v_newsletter;
    exception when others then
      v_newsletter := null;
    end;
  end if;

  v_result := jsonb_build_object(
    'summary', jsonb_build_object(
      'demo_mode', v_used_demo,
      'kpis', jsonb_build_object(
        'personnes_touchees', public._dashboard_kpi(
          'Personnes touchées',
          v_personnes,
          v_personnes > 0,
          null,
          case when v_used_demo then 'Données de démonstration incluses' else null end
        ),
        'femmes_touchees', public._dashboard_kpi(
          'Femmes touchées',
          v_femmes,
          v_femmes > 0,
          null,
          case when v_femmes = 0 then 'Ventilation genre non disponible' else null end
        ),
        'projets_actifs', public._dashboard_kpi('Projets actifs', v_projets_actifs, true),
        'activites_realisees', public._dashboard_kpi(
          'Activités réalisées',
          v_activites,
          v_activites > 0,
          null,
          case when v_activites = 0 then 'Aucune activité agrégée sur la période' else null end
        ),
        'partenaires_actifs', public._dashboard_kpi('Partenaires actifs', v_partenaires, true),
        'budget_depense', public._dashboard_kpi(
          'Budget dépensé',
          v_budget_depense,
          v_budget_depense > 0,
          null,
          'Somme des dépenses mensuelles agrégées'
        )
      )
    ),
    'beneficiary_evolution', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(m.mois, 'Mon'),
          'mois', m.mois,
          'femmes', m.femmes,
          'hommes', m.hommes,
          'enfants', m.enfants,
          'jeunes', m.jeunes,
          'total', m.total
        )
        order by m.mois
      )
      from (
        select
          s.mois,
          sum(s.femmes) as femmes,
          sum(s.hommes) as hommes,
          sum(s.enfants) as enfants,
          sum(s.jeunes) as jeunes,
          sum(s.total) as total
        from public.dashboard_stats_mensuelles s
        where s.mois between v_start and v_end
          and (p_province is null or s.province ilike p_province)
          and (p_programme_id is null or s.programme_id = p_programme_id)
          and (p_projet_id is null or s.projet_id = p_projet_id)
        group by s.mois
      ) m
    ), '[]'::jsonb),
    'projects_by_status', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'name', st.status_label,
          'value', st.cnt,
          'percent', round(st.cnt * 100.0 / nullif(st.total_cnt, 0), 1)
        )
        order by st.cnt desc
      )
      from (
        select
          case
            when coalesce(lower(p.status), '') ~ '(en.?cours|active|actif|ongoing)' then 'En cours'
            when coalesce(lower(p.status), '') ~ '(planif|planned|futur|à.?venir|a.?venir)' then 'Planifiés'
            when coalesce(lower(p.status), '') ~ '(termin|complet|done|finished)' then 'Terminés'
            when coalesce(lower(p.status), '') ~ '(suspend|pause)' then 'Suspendus'
            when coalesce(lower(p.status), '') ~ '(archiv)' then 'Archivés'
            else coalesce(nullif(trim(p.status), ''), 'Autres')
          end as status_label,
          count(*) as cnt,
          sum(count(*)) over () as total_cnt
        from public.projets p
        where coalesce(p.active, true)
          and not coalesce(p.is_demo, false)
          and (p_programme_id is null or p.program_id = p_programme_id)
          and (p_projet_id is null or p.id = p_projet_id)
          and (
            p_province is null
            or coalesce(p.location, '') ilike '%' || p_province || '%'
          )
        group by 1
      ) st
    ), '[]'::jsonb),
    'projects_by_sector', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'name', sec.sector_name,
          'value', sec.cnt,
          'percent', round(sec.cnt * 100.0 / nullif(sec.total_cnt, 0), 1)
        )
        order by sec.cnt desc
      )
      from (
        select
          coalesce(pr.title, 'Non rattaché') as sector_name,
          count(*) as cnt,
          sum(count(*)) over () as total_cnt
        from public.projets p
        left join public.programmes pr on pr.id = p.program_id
        where coalesce(p.active, true)
          and not coalesce(p.is_demo, false)
          and (p_programme_id is null or p.program_id = p_programme_id)
          and (p_projet_id is null or p.id = p_projet_id)
          and (
            p_province is null
            or coalesce(p.location, '') ilike '%' || p_province || '%'
          )
        group by coalesce(pr.title, 'Non rattaché')
      ) sec
    ), '[]'::jsonb),
    'top_projects', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', tp.id,
          'title', tp.title,
          'location', tp.location,
          'beneficiaries', tp.beneficiaries,
          'image_url', tp.image_url
        )
        order by tp.beneficiaries desc nulls last
      )
      from (
        select
          p.id,
          p.title,
          p.location,
          p.beneficiaries,
          p.image_url
        from public.projets p
        where coalesce(p.active, true)
          and not coalesce(p.is_demo, false)
          and (p_programme_id is null or p.program_id = p_programme_id)
          and (p_projet_id is null or p.id = p_projet_id)
          and (
            p_province is null
            or coalesce(p.location, '') ilike '%' || p_province || '%'
          )
        order by p.beneficiaries desc nulls last
        limit 5
      ) tp
    ), '[]'::jsonb),
    'beneficiaries_by_province', coalesce((
      select jsonb_agg(
        jsonb_build_object('name', bp.province, 'value', bp.total)
        order by bp.total desc
      )
      from (
        select
          s.province,
          sum(s.total) as total
        from public.dashboard_stats_mensuelles s
        where s.mois between v_start and v_end
          and s.mois = (
            select max(mois)
            from public.dashboard_stats_mensuelles
            where mois between v_start and v_end
          )
          and (p_programme_id is null or s.programme_id = p_programme_id)
          and (p_projet_id is null or s.projet_id = p_projet_id)
          and (p_province is null or s.province ilike p_province)
        group by s.province
        having sum(s.total) > 0
        union all
        select
          coalesce(nullif(trim(p.location), ''), 'Non précisée'),
          sum(coalesce(p.beneficiaries, 0))
        from public.projets p
        where coalesce(p.active, true)
          and not coalesce(p.is_demo, false)
          and (p_programme_id is null or p.program_id = p_programme_id)
          and (p_projet_id is null or p.id = p_projet_id)
          and (p_province is null or coalesce(p.location, '') ilike '%' || p_province || '%')
          and not exists (
            select 1
            from public.dashboard_stats_mensuelles ds
            where ds.mois between v_start and v_end
          )
        group by 1
      ) bp
    ), '[]'::jsonb),
    'monthly_activities', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(m.mois, 'Mon'),
          'mois', m.mois,
          'formations', coalesce(m.formations, 0),
          'sensibilisations', coalesce(m.sensibilisations, 0),
          'distributions', coalesce(m.distributions, 0),
          'reunions', coalesce(m.reunions, 0),
          'missions', coalesce(m.missions, 0),
          'autres', coalesce(m.autres, 0)
        )
        order by m.mois
      )
      from (
        select
          a.mois,
          sum(a.value) filter (where a.category = 'Formations') as formations,
          sum(a.value) filter (where a.category = 'Sensibilisations') as sensibilisations,
          sum(a.value) filter (where a.category = 'Distributions') as distributions,
          sum(a.value) filter (where a.category = 'Réunions') as reunions,
          sum(a.value) filter (where a.category = 'Missions') as missions,
          sum(a.value) filter (where a.category = 'Autres') as autres
        from public.dashboard_activites_mensuelles a
        where a.mois between v_start and v_end
        group by a.mois
      ) m
    ), '[]'::jsonb),
    'budget_comparison', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'label', to_char(b.mois, 'Mon'),
          'mois', b.mois,
          'planned', b.prevu,
          'actual', b.depense,
          'currency', b.currency
        )
        order by b.mois
      )
      from (
        select
          bm.mois,
          sum(bm.prevu) as prevu,
          sum(bm.depense) as depense,
          max(bm.currency) as currency
        from public.dashboard_budget_mensuel bm
        where bm.mois between v_start and v_end
          and (p_programme_id is null or bm.programme_id = p_programme_id)
        group by bm.mois
      ) b
    ), '[]'::jsonb),
    'alerts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', al.id,
          'level', al.level,
          'title', al.title,
          'summary', al.summary,
          'message', al.summary,
          'href', al.href,
          'is_read', al.is_read,
          'date_label', to_char(al.created_at, 'DD/MM/YYYY'),
          'created_at', al.created_at
        )
        order by al.created_at desc
      )
      from public.admin_alertes al
      where (
        al.created_at::date between v_start and v_end
        or not al.is_read
      )
      limit 20
    ), '[]'::jsonb),
    'secondary_stats', jsonb_build_array(
      jsonb_build_object(
        'id', 'messages',
        'label', 'Messages non traités',
        'value', v_pending_messages,
        'formatted', coalesce(to_char(v_pending_messages, 'FM999G999G999G999'), '—'),
        'href', '/admin/messages',
        'available', true
      ),
      jsonb_build_object(
        'id', 'adhesions',
        'label', 'Adhésions en attente',
        'value', v_pending_adhesions,
        'formatted', coalesce(to_char(v_pending_adhesions, 'FM999G999G999G999'), '—'),
        'href', '/admin/adhesions',
        'available', true
      ),
      jsonb_build_object(
        'id', 'dons',
        'label', 'Intentions de dons',
        'value', v_dons_intentions,
        'formatted', coalesce(to_char(v_dons_intentions, 'FM999G999G999G999'), '—'),
        'href', '/admin/dons/intentions',
        'available', true
      ),
      jsonb_build_object(
        'id', 'newsletter',
        'label', 'Abonnés newsletter',
        'value', v_newsletter,
        'formatted', case when v_newsletter is null then '—' else to_char(v_newsletter, 'FM999G999G999G999') end,
        'href', '/admin/newsletter/abonnes',
        'available', v_newsletter is not null
      )
    ),
    'filter_options', jsonb_build_object(
      'programmes', coalesce((
        select jsonb_agg(jsonb_build_object('id', pr.id, 'title', pr.title) order by pr.title)
        from public.programmes pr
        where coalesce(pr.active, true)
          and not coalesce(pr.is_demo, false)
      ), '[]'::jsonb),
      'provinces', coalesce((
        select jsonb_agg(distinct prov order by prov)
        from (
          select distinct s.province as prov
          from public.dashboard_stats_mensuelles s
          union
          select distinct trim(p.location) as prov
          from public.projets p
          where coalesce(p.location, '') <> ''
        ) pv
        where prov is not null and prov <> ''
      ), '[]'::jsonb),
      'projects', coalesce((
        select jsonb_agg(jsonb_build_object('id', p.id, 'title', p.title) order by p.title)
        from public.projets p
        where coalesce(p.active, true)
          and not coalesce(p.is_demo, false)
          and (p_programme_id is null or p.program_id = p_programme_id)
      ), '[]'::jsonb)
    ),
    'is_demo', v_used_demo,
    'demo_batch_id', v_demo_batch_id,
    'generated_at', now()
  );

  return v_result;
end;
$$;

revoke all on function public.get_admin_dashboard(date, date, uuid, text, uuid) from public;
grant execute on function public.get_admin_dashboard(date, date, uuid, text, uuid) to authenticated;
