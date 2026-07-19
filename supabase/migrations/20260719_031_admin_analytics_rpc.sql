-- RPC analytiques admin (agrégations, search_path fixé).
-- Les pages utilisent aussi le service TS côté serveur avec requirePermission.

CREATE OR REPLACE FUNCTION public.get_project_analytics(
  p_programme_id uuid DEFAULT NULL,
  p_province text DEFAULT NULL,
  p_secteur text DEFAULT NULL,
  p_statut text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Non authentifié';
  END IF;

  SELECT jsonb_build_object(
    'total', count(*),
    'by_status', coalesce((
      SELECT jsonb_agg(jsonb_build_object('name', s.status_label, 'value', s.cnt))
      FROM (
        SELECT
          CASE
            WHEN coalesce(lower(status), '') ~ '(en.?cours|actif)' THEN 'En cours'
            WHEN coalesce(lower(status), '') ~ '(planif|futur)' THEN 'Planifiés'
            WHEN coalesce(lower(status), '') ~ 'termin' THEN 'Terminés'
            ELSE coalesce(status, 'Autres')
          END AS status_label,
          count(*) AS cnt
        FROM public.projets
        WHERE coalesce(active, true)
          AND (p_programme_id IS NULL OR program_id = p_programme_id)
          AND (p_province IS NULL OR location ILIKE '%' || p_province || '%')
          AND (p_secteur IS NULL OR coalesce(secteur, '') ILIKE '%' || p_secteur || '%')
        GROUP BY 1
      ) s
    ), '[]'::jsonb)
  )
  INTO v_result
  FROM public.projets
  WHERE coalesce(active, true)
    AND (p_programme_id IS NULL OR program_id = p_programme_id)
    AND (p_province IS NULL OR location ILIKE '%' || p_province || '%')
    AND (p_secteur IS NULL OR coalesce(secteur, '') ILIKE '%' || p_secteur || '%');

  RETURN coalesce(v_result, '{}'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.get_project_analytics(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_project_analytics(uuid, text, text, text) TO authenticated;
