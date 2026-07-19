import type {
  AnalyticsContext,
  AnalyticsSegment,
} from "@/features/admin-analytics/types/admin-analytics";

const SEGMENTS = new Set<AnalyticsSegment>([
  "total",
  "femmes",
  "hommes",
  "enfants",
  "jeunes",
]);

function asString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

export function parseAnalyticsContext(
  params: Record<string, string | string[] | undefined>,
): AnalyticsContext {
  const segmentRaw = asString(params.segment);
  const segment =
    segmentRaw && SEGMENTS.has(segmentRaw as AnalyticsSegment)
      ? (segmentRaw as AnalyticsSegment)
      : null;

  return {
    dateStart: asString(params.dateStart) ?? asString(params.from),
    dateEnd: asString(params.dateEnd) ?? asString(params.to),
    period: asString(params.period) ?? asString(params.periode),
    programmeId: asString(params.programmeId) ?? asString(params.programme),
    projetId: asString(params.projetId) ?? asString(params.project),
    provinceId: asString(params.provinceId) ?? asString(params.province),
    secteurId: asString(params.secteurId) ?? asString(params.secteur),
    statut: asString(params.statut),
    segment,
    mois: asString(params.mois),
    type: asString(params.type),
    vue: asString(params.vue),
    sourceWidget: asString(params.sourceWidget) ?? asString(params.source),
  };
}

export function analyticsContextToSearchParams(
  context: Partial<AnalyticsContext>,
): URLSearchParams {
  const params = new URLSearchParams();
  const entries: Array<[keyof AnalyticsContext, string | null | undefined]> = [
    ["dateStart", context.dateStart],
    ["dateEnd", context.dateEnd],
    ["period", context.period],
    ["programmeId", context.programmeId],
    ["projetId", context.projetId],
    ["provinceId", context.provinceId],
    ["secteurId", context.secteurId],
    ["statut", context.statut],
    ["segment", context.segment],
    ["mois", context.mois],
    ["type", context.type],
    ["vue", context.vue],
    ["sourceWidget", context.sourceWidget],
  ];
  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }
  return params;
}

export function buildAnalyticsHref(
  path: string,
  context: Partial<AnalyticsContext> = {},
): string {
  const params = analyticsContextToSearchParams(context);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function buildDashboardReturnHref(
  context: Partial<AnalyticsContext>,
): string {
  const params = new URLSearchParams();
  if (context.period) params.set("period", context.period);
  if (context.programmeId) params.set("programme", context.programmeId);
  if (context.provinceId) params.set("province", context.provinceId);
  if (context.projetId) params.set("project", context.projetId);
  if (context.dateStart) params.set("from", context.dateStart);
  if (context.dateEnd) params.set("to", context.dateEnd);
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}
