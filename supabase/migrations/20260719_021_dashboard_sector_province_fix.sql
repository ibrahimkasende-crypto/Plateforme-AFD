-- Dashboard admin — correctifs secteur, province, mode présentation.
-- Non destructif : colonnes ajoutées uniquement si absentes.

-- Add secteur column to projets if table exists
DO $$ BEGIN
  IF to_regclass('public.projets') IS NOT NULL THEN
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS secteur text;
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS demo_batch_id text;
  END IF;
  IF to_regclass('public.programmes') IS NOT NULL THEN
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS demo_batch_id text;
    ALTER TABLE public.programmes ADD COLUMN IF NOT EXISTS secteur text;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- RPC principale : get_admin_dashboard (correctifs secteur / province / démo)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_admin_dashboard(
  p_date_start date DEFAULT NULL,
  p_date_end date DEFAULT NULL,
  p_programme_id uuid DEFAULT NULL,
  p_province text DEFAULT NULL,
  p_projet_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start date := coalesce(p_date_start, date_trunc('month', current_date - interval '5 months')::date);
  v_end date := coalesce(p_date_end, current_date);
  v_mois_start date := date_trunc('month', v_start)::date;
  v_used_demo boolean := false;
  v_presentation_mode boolean := false;
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
  v_projects_by_status jsonb := '[]'::jsonb;
  v_projects_by_sector jsonb := '[]'::jsonb;
  v_projects_by_province jsonb := '[]'::jsonb;
  v_top_projects jsonb := '[]'::jsonb;
  v_beneficiaries_by_province jsonb := '[]'::jsonb;
  v_filter_programmes jsonb := '[]'::jsonb;
  v_filter_provinces jsonb := '[]'::jsonb;
  v_filter_projects jsonb := '[]'::jsonb;
  v_has_projets boolean := to_regclass('public.projets') is not null;
  v_has_programmes boolean := to_regclass('public.programmes') is not null;
  v_projets_demo_used boolean := false;
  v_province_norm_expr text := $e$
    case
      when coalesce(p.location, '') ilike '%Kinshasa%' then 'Kinshasa'
      when coalesce(p.location, '') ilike '%Kwilu%' then 'Kwilu'
      when coalesce(p.location, '') ilike '%Kwango%' then 'Kwango'
      when coalesce(p.location, '') ilike '%Haut-Katanga%' then 'Haut-Katanga'
      when coalesce(p.location, '') ilike '%Ituri%' then 'Ituri'
      when coalesce(p.location, '') ilike '%Tshopo%' then 'Tshopo'
      when coalesce(p.location, '') ilike '%Tshuapa%' then 'Tshuapa'
      when coalesce(p.location, '') ilike '%Nord-Kivu%' then 'Nord-Kivu'
      else coalesce(nullif(trim(p.location), ''), 'Non localisé')
    end
  $e$;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  IF NOT public._dashboard_can_access() THEN
    RAISE EXCEPTION 'Accès refusé — profil administrateur actif avec rôle requis';
  END IF;

  -- Détection données démo utilisées (tables dashboard + projets / programmes)
  SELECT
    bool_or(coalesce(is_demo, false)),
    max(demo_batch_id) FILTER (WHERE demo_batch_id IS NOT NULL)
  INTO v_used_demo, v_demo_batch_id
  FROM (
    SELECT is_demo, demo_batch_id
    FROM public.dashboard_stats_mensuelles
    WHERE mois BETWEEN v_mois_start AND v_end
      AND (p_province IS NULL OR province ILIKE p_province)
      AND (p_programme_id IS NULL OR programme_id = p_programme_id)
      AND (p_projet_id IS NULL OR projet_id = p_projet_id)
    UNION ALL
    SELECT is_demo, demo_batch_id
    FROM public.dashboard_activites_mensuelles
    WHERE mois BETWEEN v_mois_start AND v_end
    UNION ALL
    SELECT is_demo, demo_batch_id
    FROM public.dashboard_budget_mensuel
    WHERE mois BETWEEN v_mois_start AND v_end
      AND (p_programme_id IS NULL OR programme_id = p_programme_id)
    UNION ALL
    SELECT is_demo, demo_batch_id
    FROM public.admin_alertes
    WHERE created_at::date BETWEEN v_start AND v_end
  ) demo_probe;

  v_used_demo := coalesce(v_used_demo, false);

  IF v_has_projets THEN
    SELECT coalesce(bool_or(coalesce(p.is_demo, false)), false)
    INTO v_projets_demo_used
    FROM public.projets p
    WHERE coalesce(p.active, true)
      AND (p_programme_id IS NULL OR p.program_id = p_programme_id)
      AND (p_projet_id IS NULL OR p.id = p_projet_id)
      AND (
        p_province IS NULL
        OR coalesce(p.location, '') ILIKE '%' || p_province || '%'
      );
  END IF;

  IF v_has_programmes AND NOT v_projets_demo_used THEN
    SELECT coalesce(bool_or(coalesce(pr.is_demo, false)), false)
    INTO v_projets_demo_used
    FROM public.programmes pr
    WHERE coalesce(pr.active, true)
      AND (p_programme_id IS NULL OR pr.id = p_programme_id);
  END IF;

  v_presentation_mode := v_used_demo OR coalesce(v_projets_demo_used, false);

  -- KPI personnes / femmes : stats mensuelles (dernier mois de la période) + fallback projets
  SELECT
    coalesce(sum(s.total), 0),
    coalesce(sum(s.femmes), 0)
  INTO v_personnes, v_femmes
  FROM public.dashboard_stats_mensuelles s
  WHERE s.mois = (
    SELECT max(mois)
    FROM public.dashboard_stats_mensuelles
    WHERE mois BETWEEN v_mois_start AND v_end
  )
    AND (p_province IS NULL OR s.province ILIKE p_province)
    AND (p_programme_id IS NULL OR s.programme_id = p_programme_id)
    AND (p_projet_id IS NULL OR s.projet_id = p_projet_id);

  IF v_personnes = 0 AND v_has_projets THEN
    SELECT coalesce(sum(p.beneficiaries), 0)
    INTO v_personnes
    FROM public.projets p
    WHERE coalesce(p.active, true)
      AND (p_programme_id IS NULL OR p.program_id = p_programme_id)
      AND (p_projet_id IS NULL OR p.id = p_projet_id)
      AND (
        p_province IS NULL
        OR coalesce(p.location, '') ILIKE '%' || p_province || '%'
      );
  END IF;

  IF v_has_projets THEN
    SELECT count(*)::integer
    INTO v_projets_actifs
    FROM public.projets p
    WHERE coalesce(p.active, true)
      AND (p_programme_id IS NULL OR p.program_id = p_programme_id)
      AND (p_projet_id IS NULL OR p.id = p_projet_id)
      AND (
        p_province IS NULL
        OR coalesce(p.location, '') ILIKE '%' || p_province || '%'
      )
      AND coalesce(lower(p.status), 'en_cours') IN (
        'en_cours', 'active', 'actif', 'ongoing', 'planifie', 'planifié', 'planned', 'futur'
      );
  END IF;

  SELECT coalesce(sum(a.value), 0)::integer
  INTO v_activites
  FROM public.dashboard_activites_mensuelles a
  WHERE a.mois BETWEEN v_mois_start AND v_end;

  IF to_regclass('public.partenaires') IS NOT NULL THEN
    SELECT count(*)::integer
    INTO v_partenaires
    FROM public.partenaires pt
    WHERE coalesce(pt.active, true)
      AND NOT coalesce(pt.is_demo, false);
  END IF;

  SELECT coalesce(sum(b.depense), 0)
  INTO v_budget_depense
  FROM public.dashboard_budget_mensuel b
  WHERE b.mois BETWEEN v_mois_start AND v_end
    AND (p_programme_id IS NULL OR b.programme_id = p_programme_id);

  IF to_regclass('public.messages') IS NOT NULL THEN
    SELECT count(*)::integer
    INTO v_pending_messages
    FROM public.messages m
    WHERE NOT coalesce(m.is_demo, false)
      AND coalesce(lower(m.status), 'unread') IN (
        'unread', 'pending', 'nouveau', 'new', 'non_lu'
      );
  END IF;

  IF to_regclass('public.membres') IS NOT NULL THEN
    SELECT count(*)::integer
    INTO v_pending_adhesions
    FROM public.membres mb
    WHERE NOT coalesce(mb.is_demo, false)
      AND coalesce(lower(mb.status), 'pending') IN (
        'pending', 'en_attente', 'nouveau'
      );
  END IF;

  IF to_regclass('public.dons') IS NOT NULL THEN
    SELECT count(*)::integer
    INTO v_dons_intentions
    FROM public.dons d
    WHERE NOT coalesce(d.is_demo, false)
      AND coalesce(lower(d.status), 'pending') IN (
        'pending', 'intent', 'intention'
      );
  END IF;

  IF to_regclass('public.abonnes_newsletter') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$
        SELECT count(*)::integer
        FROM public.abonnes_newsletter
        WHERE statut = 'actif'
      $q$ INTO v_newsletter;
    EXCEPTION WHEN OTHERS THEN
      v_newsletter := null;
    END;
  END IF;

  -- Agrégats projets (officiels + démo pour présentation)
  IF v_has_projets THEN
    EXECUTE format($q$
      SELECT coalesce((
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', st.status_label,
            'value', st.cnt,
            'percent', round(st.cnt * 100.0 / nullif(st.total_cnt, 0), 1)
          )
          ORDER BY st.cnt DESC
        )
        FROM (
          SELECT
            CASE
              WHEN coalesce(lower(p.status), '') ~ '(en.?cours|active|actif|ongoing)' THEN 'En cours'
              WHEN coalesce(lower(p.status), '') ~ '(planif|planned|futur|à.?venir|a.?venir)' THEN 'Planifiés'
              WHEN coalesce(lower(p.status), '') ~ '(termin|complet|done|finished)' THEN 'Terminés'
              WHEN coalesce(lower(p.status), '') ~ '(suspend|pause)' THEN 'Suspendus'
              WHEN coalesce(lower(p.status), '') ~ '(archiv)' THEN 'Archivés'
              ELSE coalesce(nullif(trim(p.status), ''), 'Autres')
            END AS status_label,
            count(*) AS cnt,
            sum(count(*)) OVER () AS total_cnt
          FROM public.projets p
          WHERE coalesce(p.active, true)
            AND ($1 IS NULL OR p.program_id = $1)
            AND ($2 IS NULL OR p.id = $2)
            AND (
              $3 IS NULL
              OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
            )
          GROUP BY 1
        ) st
      ), '[]'::jsonb)
    $q$)
    INTO v_projects_by_status
    USING p_programme_id, p_projet_id, p_province;

    IF v_has_programmes THEN
      EXECUTE format($q$
        SELECT coalesce((
          SELECT jsonb_agg(
            jsonb_build_object(
              'name', sec.sector_name,
              'value', sec.cnt,
              'percent', round(sec.cnt * 100.0 / nullif(sec.total_cnt, 0), 1)
            )
            ORDER BY sec.cnt DESC
          )
          FROM (
            SELECT
              coalesce(
                nullif(trim(p.secteur), ''),
                nullif(trim(pr.secteur), ''),
                pr.title,
                'Non classé'
              ) AS sector_name,
              count(*) AS cnt,
              sum(count(*)) OVER () AS total_cnt
            FROM public.projets p
            LEFT JOIN public.programmes pr ON pr.id = p.program_id
            WHERE coalesce(p.active, true)
              AND ($1 IS NULL OR p.program_id = $1)
              AND ($2 IS NULL OR p.id = $2)
              AND (
                $3 IS NULL
                OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
              )
            GROUP BY 1
          ) sec
        ), '[]'::jsonb)
      $q$)
      INTO v_projects_by_sector
      USING p_programme_id, p_projet_id, p_province;
    ELSE
      EXECUTE format($q$
        SELECT coalesce((
          SELECT jsonb_agg(
            jsonb_build_object(
              'name', sec.sector_name,
              'value', sec.cnt,
              'percent', round(sec.cnt * 100.0 / nullif(sec.total_cnt, 0), 1)
            )
            ORDER BY sec.cnt DESC
          )
          FROM (
            SELECT
              coalesce(nullif(trim(p.secteur), ''), 'Non classé') AS sector_name,
              count(*) AS cnt,
              sum(count(*)) OVER () AS total_cnt
            FROM public.projets p
            WHERE coalesce(p.active, true)
              AND ($1 IS NULL OR p.program_id = $1)
              AND ($2 IS NULL OR p.id = $2)
              AND (
                $3 IS NULL
                OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
              )
            GROUP BY 1
          ) sec
        ), '[]'::jsonb)
      $q$)
      INTO v_projects_by_sector
      USING p_programme_id, p_projet_id, p_province;
    END IF;

    EXECUTE format($q$
      SELECT coalesce((
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', pv.province_name,
            'value', pv.cnt,
            'percent', round(pv.cnt * 100.0 / nullif(pv.total_cnt, 0), 1),
            'activities', pv.activities,
            'beneficiaries', pv.beneficiaries
          )
          ORDER BY pv.cnt DESC
        )
        FROM (
          SELECT
            %s AS province_name,
            count(*) AS cnt,
            sum(count(*)) OVER () AS total_cnt,
            count(*) FILTER (
              WHERE coalesce(lower(p.status), '') IN (
                'en_cours', 'active', 'actif', 'ongoing', 'planifie', 'planifié', 'planned', 'futur'
              )
            ) AS activities,
            coalesce(sum(p.beneficiaries), 0) AS beneficiaries
          FROM public.projets p
          WHERE coalesce(p.active, true)
            AND ($1 IS NULL OR p.program_id = $1)
            AND ($2 IS NULL OR p.id = $2)
            AND (
              $3 IS NULL
              OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
            )
          GROUP BY 1
        ) pv
      ), '[]'::jsonb)
    $q$, v_province_norm_expr)
    INTO v_projects_by_province
    USING p_programme_id, p_projet_id, p_province;

    EXECUTE format($q$
      SELECT coalesce((
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', tp.id,
            'title', tp.title,
            'location', tp.location,
            'beneficiaries', tp.beneficiaries,
            'image_url', tp.image_url
          )
          ORDER BY tp.beneficiaries DESC NULLS LAST
        )
        FROM (
          SELECT p.id, p.title, p.location, p.beneficiaries, p.image_url
          FROM public.projets p
          WHERE coalesce(p.active, true)
            AND ($1 IS NULL OR p.program_id = $1)
            AND ($2 IS NULL OR p.id = $2)
            AND (
              $3 IS NULL
              OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
            )
          ORDER BY p.beneficiaries DESC NULLS LAST
          LIMIT 5
        ) tp
      ), '[]'::jsonb)
    $q$)
    INTO v_top_projects
    USING p_programme_id, p_projet_id, p_province;

    EXECUTE format($q$
      SELECT coalesce((
        SELECT jsonb_agg(jsonb_build_object('id', p.id, 'title', p.title) ORDER BY p.title)
        FROM public.projets p
        WHERE coalesce(p.active, true)
          AND ($1 IS NULL OR p.program_id = $1)
      ), '[]'::jsonb)
    $q$)
    INTO v_filter_projects
    USING p_programme_id;
  END IF;

  IF v_has_programmes THEN
    SELECT coalesce((
      SELECT jsonb_agg(jsonb_build_object('id', pr.id, 'title', pr.title) ORDER BY pr.title)
      FROM public.programmes pr
      WHERE coalesce(pr.active, true)
    ), '[]'::jsonb)
    INTO v_filter_programmes;
  END IF;

  SELECT coalesce((
    SELECT jsonb_agg(
      jsonb_build_object('name', bp.province, 'value', bp.total)
      ORDER BY bp.total DESC
    )
    FROM (
      SELECT s.province, sum(s.total) AS total
      FROM public.dashboard_stats_mensuelles s
      WHERE s.mois BETWEEN v_mois_start AND v_end
        AND s.mois = (
          SELECT max(mois)
          FROM public.dashboard_stats_mensuelles
          WHERE mois BETWEEN v_mois_start AND v_end
        )
        AND (p_programme_id IS NULL OR s.programme_id = p_programme_id)
        AND (p_projet_id IS NULL OR s.projet_id = p_projet_id)
        AND (p_province IS NULL OR s.province ILIKE p_province)
      GROUP BY s.province
      HAVING sum(s.total) > 0
    ) bp
  ), '[]'::jsonb)
  INTO v_beneficiaries_by_province;

  IF v_beneficiaries_by_province = '[]'::jsonb AND v_has_projets THEN
    EXECUTE format($q$
      SELECT coalesce((
        SELECT jsonb_agg(
          jsonb_build_object('name', bp.province_name, 'value', bp.total)
          ORDER BY bp.total DESC
        )
        FROM (
          SELECT
            %s AS province_name,
            coalesce(sum(p.beneficiaries), 0) AS total
          FROM public.projets p
          WHERE coalesce(p.active, true)
            AND ($1 IS NULL OR p.program_id = $1)
            AND ($2 IS NULL OR p.id = $2)
            AND (
              $3 IS NULL
              OR coalesce(p.location, '') ILIKE '%%' || $3 || '%%'
            )
          GROUP BY 1
          HAVING coalesce(sum(p.beneficiaries), 0) > 0
        ) bp
      ), '[]'::jsonb)
    $q$, v_province_norm_expr)
    INTO v_beneficiaries_by_province
    USING p_programme_id, p_projet_id, p_province;
  END IF;

  SELECT coalesce((
    SELECT jsonb_agg(DISTINCT prov ORDER BY prov)
    FROM (
      SELECT DISTINCT s.province AS prov
      FROM public.dashboard_stats_mensuelles s
    ) pv
    WHERE prov IS NOT NULL AND prov <> ''
  ), '[]'::jsonb)
  INTO v_filter_provinces;

  v_result := jsonb_build_object(
    'summary', jsonb_build_object(
      'demo_mode', v_presentation_mode,
      'presentation_mode', v_presentation_mode,
      'kpis', jsonb_build_object(
        'personnes_touchees', public._dashboard_kpi(
          'Personnes touchées',
          v_personnes,
          v_personnes > 0,
          null,
          CASE WHEN v_presentation_mode THEN 'Données de démonstration incluses' ELSE null END
        ),
        'femmes_touchees', public._dashboard_kpi(
          'Femmes touchées',
          v_femmes,
          v_femmes > 0,
          null,
          CASE WHEN v_femmes = 0 THEN 'Ventilation genre non disponible' ELSE null END
        ),
        'projets_actifs', public._dashboard_kpi('Projets actifs', v_projets_actifs, true),
        'activites_realisees', public._dashboard_kpi(
          'Activités réalisées',
          v_activites,
          v_activites > 0,
          null,
          CASE WHEN v_activites = 0 THEN 'Aucune activité agrégée sur la période' ELSE null END
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
      SELECT jsonb_agg(
        jsonb_build_object(
          'label', to_char(m.mois, 'Mon'),
          'mois', m.mois,
          'femmes', m.femmes,
          'hommes', m.hommes,
          'enfants', m.enfants,
          'jeunes', m.jeunes,
          'total', m.total
        )
        ORDER BY m.mois
      )
      FROM (
        SELECT
          s.mois,
          sum(s.femmes) AS femmes,
          sum(s.hommes) AS hommes,
          sum(s.enfants) AS enfants,
          sum(s.jeunes) AS jeunes,
          sum(s.total) AS total
        FROM public.dashboard_stats_mensuelles s
        WHERE s.mois BETWEEN v_mois_start AND v_end
          AND (p_province IS NULL OR s.province ILIKE p_province)
          AND (p_programme_id IS NULL OR s.programme_id = p_programme_id)
          AND (p_projet_id IS NULL OR s.projet_id = p_projet_id)
        GROUP BY s.mois
      ) m
    ), '[]'::jsonb),
    'projects_by_status', v_projects_by_status,
    'projects_by_sector', v_projects_by_sector,
    'projects_by_province', v_projects_by_province,
    'top_projects', v_top_projects,
    'beneficiaries_by_province', v_beneficiaries_by_province,
    'monthly_activities', coalesce((
      SELECT jsonb_agg(
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
        ORDER BY m.mois
      )
      FROM (
        SELECT
          a.mois,
          sum(a.value) FILTER (WHERE a.category = 'Formations') AS formations,
          sum(a.value) FILTER (WHERE a.category = 'Sensibilisations') AS sensibilisations,
          sum(a.value) FILTER (WHERE a.category = 'Distributions') AS distributions,
          sum(a.value) FILTER (WHERE a.category = 'Réunions') AS reunions,
          sum(a.value) FILTER (WHERE a.category = 'Missions') AS missions,
          sum(a.value) FILTER (WHERE a.category = 'Autres') AS autres
        FROM public.dashboard_activites_mensuelles a
        WHERE a.mois BETWEEN v_mois_start AND v_end
        GROUP BY a.mois
      ) m
    ), '[]'::jsonb),
    'budget_comparison', coalesce((
      SELECT jsonb_agg(
        jsonb_build_object(
          'label', to_char(b.mois, 'Mon'),
          'mois', b.mois,
          'planned', b.prevu,
          'actual', b.depense,
          'currency', b.currency
        )
        ORDER BY b.mois
      )
      FROM (
        SELECT
          bm.mois,
          sum(bm.prevu) AS prevu,
          sum(bm.depense) AS depense,
          max(bm.currency) AS currency
        FROM public.dashboard_budget_mensuel bm
        WHERE bm.mois BETWEEN v_mois_start AND v_end
          AND (p_programme_id IS NULL OR bm.programme_id = p_programme_id)
        GROUP BY bm.mois
      ) b
    ), '[]'::jsonb),
    'alerts', coalesce((
      SELECT jsonb_agg(
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
        ORDER BY al.created_at DESC
      )
      FROM public.admin_alertes al
      WHERE (
        al.created_at::date BETWEEN v_start AND v_end
        OR NOT al.is_read
      )
      LIMIT 20
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
        'formatted', CASE WHEN v_newsletter IS NULL THEN '—' ELSE to_char(v_newsletter, 'FM999G999G999G999') END,
        'href', '/admin/newsletter/abonnes',
        'available', v_newsletter IS NOT NULL
      )
    ),
    'filter_options', jsonb_build_object(
      'programmes', v_filter_programmes,
      'provinces', v_filter_provinces,
      'projects', v_filter_projects
    ),
    'is_demo', v_presentation_mode,
    'presentation_mode', v_presentation_mode,
    'demo_batch_id', v_demo_batch_id,
    'generated_at', now()
  );

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_dashboard(date, date, uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard(date, date, uuid, text, uuid) TO authenticated;
