import type {
  DashboardFilters,
  DashboardPeriod,
} from "@/features/statistiques/types/dashboard";

const VALID_PERIODS: DashboardPeriod[] = [
  "7d",
  "30d",
  "quarter",
  "year",
  "custom",
];

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const raw = params[key];
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export function parseDashboardFilters(
  params: Record<string, string | string[] | undefined>,
): DashboardFilters {
  const periodRaw = readParam(params, "period");
  const period = VALID_PERIODS.includes(periodRaw as DashboardPeriod)
    ? (periodRaw as DashboardPeriod)
    : "year";

  return {
    period,
    programmeId: readParam(params, "programme"),
    province: readParam(params, "province"),
    projectId: readParam(params, "project"),
    from: readParam(params, "from"),
    to: readParam(params, "to"),
  };
}
