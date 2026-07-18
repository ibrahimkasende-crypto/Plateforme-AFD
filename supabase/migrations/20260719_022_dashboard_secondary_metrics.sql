-- Métriques secondaires de présentation (documents / rapports)
-- et helper d’enrichissement. Ne modifie PAS get_admin_dashboard.

CREATE TABLE IF NOT EXISTS public.dashboard_metric_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text NOT NULL,
  metric_value integer NOT NULL DEFAULT 0,
  label text,
  href text,
  is_demo boolean NOT NULL DEFAULT false,
  demo_batch_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (metric_key, demo_batch_id)
);

ALTER TABLE public.dashboard_metric_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dashboard_metric_snapshots_select_authenticated"
  ON public.dashboard_metric_snapshots;
CREATE POLICY "dashboard_metric_snapshots_select_authenticated"
  ON public.dashboard_metric_snapshots
  FOR SELECT TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.get_dashboard_secondary_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pending_messages integer := 0;
  v_pending_adhesions integer := 0;
  v_dons_intentions integer := 0;
  v_newsletter integer := null;
  v_documents integer := null;
  v_rapports integer := null;
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$
        SELECT count(*)::integer FROM public.messages m
        WHERE coalesce(lower(m.status), 'unread') IN
          ('unread','pending','nouveau','new','non_lu')
      $q$ INTO v_pending_messages;
    EXCEPTION WHEN OTHERS THEN
      v_pending_messages := 0;
    END;
  END IF;

  IF to_regclass('public.membres') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$
        SELECT count(*)::integer FROM public.membres mb
        WHERE coalesce(lower(mb.status), 'pending') IN
          ('pending','en_attente','nouveau')
      $q$ INTO v_pending_adhesions;
    EXCEPTION WHEN OTHERS THEN
      v_pending_adhesions := 0;
    END;
  END IF;

  IF to_regclass('public.dons') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$
        SELECT count(*)::integer FROM public.dons d
        WHERE coalesce(lower(d.status), 'pending') IN
          ('pending','intent','intention')
      $q$ INTO v_dons_intentions;
    EXCEPTION WHEN OTHERS THEN
      v_dons_intentions := 0;
    END;
  END IF;

  IF to_regclass('public.abonnes_newsletter') IS NOT NULL THEN
    BEGIN
      EXECUTE $q$
        SELECT count(*)::integer FROM public.abonnes_newsletter
        WHERE coalesce(lower(statut), 'actif') IN ('actif','active','subscribed')
      $q$ INTO v_newsletter;
    EXCEPTION WHEN OTHERS THEN
      v_newsletter := null;
    END;
  END IF;

  SELECT metric_value INTO v_documents
  FROM public.dashboard_metric_snapshots
  WHERE metric_key = 'documents_telecharges'
  ORDER BY is_demo DESC
  LIMIT 1;

  SELECT metric_value INTO v_rapports
  FROM public.dashboard_metric_snapshots
  WHERE metric_key = 'rapports_generes'
  ORDER BY is_demo DESC
  LIMIT 1;

  RETURN jsonb_build_array(
    jsonb_build_object(
      'id', 'messages',
      'label', 'Messages non traités',
      'value', v_pending_messages,
      'formatted', to_char(v_pending_messages, 'FM999G999G999G999'),
      'href', '/admin/messages',
      'available', true
    ),
    jsonb_build_object(
      'id', 'adhesions',
      'label', 'Adhésions en attente',
      'value', v_pending_adhesions,
      'formatted', to_char(v_pending_adhesions, 'FM999G999G999G999'),
      'href', '/admin/adhesions',
      'available', true
    ),
    jsonb_build_object(
      'id', 'dons',
      'label', 'Intentions de dons',
      'value', v_dons_intentions,
      'formatted', to_char(v_dons_intentions, 'FM999G999G999G999'),
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
    ),
    jsonb_build_object(
      'id', 'documents',
      'label', 'Documents téléchargés',
      'value', v_documents,
      'formatted', CASE WHEN v_documents IS NULL THEN '—' ELSE to_char(v_documents, 'FM999G999G999G999') END,
      'href', '/admin/mediatheque',
      'available', v_documents IS NOT NULL
    ),
    jsonb_build_object(
      'id', 'rapports',
      'label', 'Rapports générés',
      'value', v_rapports,
      'formatted', CASE WHEN v_rapports IS NULL THEN '—' ELSE to_char(v_rapports, 'FM999G999G999G999') END,
      'href', '/admin/rapports',
      'available', v_rapports IS NOT NULL
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_secondary_metrics() TO authenticated;
