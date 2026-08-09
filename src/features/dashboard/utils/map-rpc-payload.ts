import type { AdminDashboardRpcPayload } from "@/features/dashboard/schemas/admin-dashboard-rpc";
import type {
  AdminViewer,
  BeneficiaryEvolutionPoint,
  BudgetComparisonPoint,
  DashboardAlert,
  DashboardAlertLevel,
  DashboardBundle,
  KpiValue,
  MonthlyActivityPoint,
  NamedCount,
  ProvinceBeneficiaries,
  ProvinceProjectsDatum,
  SecondaryStat,
  TopProject,
} from "@/features/statistiques/types/dashboard";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function mapKpi(
  raw: Record<string, unknown> | undefined,
  fallbackLabel: string,
): KpiValue {
  if (!raw) {
    return {
      label: fallbackLabel,
      value: null,
      formatted: "—",
      variationPct: null,
      available: false,
    };
  }

  const hasValue = raw.value !== null && raw.value !== undefined && raw.value !== "";
  const available = raw.available !== false && hasValue;
  const value = available ? asNumber(raw.value) : null;
  const variation =
    typeof raw.variation_pct === "number"
      ? raw.variation_pct
      : typeof raw.variationPct === "number"
        ? raw.variationPct
        : null;

  return {
    label: asString(raw.label, fallbackLabel),
    value,
    formatted:
      typeof raw.formatted === "string" ? raw.formatted : formatNumber(value),
    variationPct: variation,
    available,
    tooltip:
      typeof raw.tooltip === "string" ? raw.tooltip : undefined,
  };
}

function mapAlerts(rows: Array<Record<string, unknown>> | undefined): DashboardAlert[] {
  if (!rows) return [];
  return rows.map((row, index) => {
    const levelRaw = asString(row.level, "info");
    const level: DashboardAlertLevel =
      levelRaw === "warning" || levelRaw === "critical" ? levelRaw : "info";
    return {
      id: asString(row.id, `alert-${index}`),
      message:
        asString(row.message) ||
        asString(row.summary) ||
        asString(row.title, "Alerte"),
      level,
      href: asString(row.href, "/admin"),
      dateLabel: asString(row.date_label ?? row.dateLabel, "—"),
    };
  });
}

export function mapRpcPayloadToBundle(
  payload: AdminDashboardRpcPayload,
  viewer: AdminViewer,
): DashboardBundle {
  const kpisRaw = (payload.summary?.kpis ?? {}) as Record<
    string,
    Record<string, unknown>
  >;

  const beneficiaryEvolution: BeneficiaryEvolutionPoint[] = (
    payload.beneficiary_evolution ?? []
  ).map((row) => ({
    label: asString(row.label, asString(row.mois, "")),
    femmes: asNumber(row.femmes),
    hommes: asNumber(row.hommes),
    enfants: asNumber(row.enfants),
    jeunes: asNumber(row.jeunes),
  }));

  const projectsByStatus: NamedCount[] = (payload.projects_by_status ?? []).map(
    (row) => ({
      name: asString(row.name),
      value: asNumber(row.value),
      percent:
        typeof row.percent === "number" ? row.percent : undefined,
    }),
  );

  const projectsBySector: NamedCount[] = (payload.projects_by_sector ?? []).map(
    (row) => ({
      name: asString(row.name),
      value: asNumber(row.value),
      percent:
        typeof row.percent === "number" ? row.percent : undefined,
    }),
  );

  const projectsByProvince: ProvinceProjectsDatum[] = (
    payload.projects_by_province ?? []
  ).map((row) => ({
    name: asString(row.name),
    value: asNumber(row.value),
    percent: typeof row.percent === "number" ? row.percent : undefined,
    activities: asNumber(row.activities),
    beneficiaries: asNumber(row.beneficiaries),
    slug: asString(row.slug, asString(row.name).toLowerCase().replace(/\s+/g, "-")),
  }));

  const topProjects: TopProject[] = (payload.top_projects ?? []).map((row) => ({
    id: asString(row.id),
    title: asString(row.title),
    location:
      typeof row.location === "string" || row.location === null
        ? (row.location as string | null)
        : null,
    beneficiaries:
      row.beneficiaries === null || row.beneficiaries === undefined
        ? null
        : asNumber(row.beneficiaries),
    imageUrl:
      typeof row.image_url === "string"
        ? row.image_url
        : typeof row.imageUrl === "string"
          ? row.imageUrl
          : null,
  }));

  const beneficiariesByProvince: ProvinceBeneficiaries[] = (
    payload.beneficiaries_by_province ?? []
  ).map((row) => ({
    name: asString(row.name),
    value: asNumber(row.value),
  }));

  const monthlyActivities: MonthlyActivityPoint[] = (
    payload.monthly_activities ?? []
  ).map((row) => ({
    label: asString(row.label, asString(row.mois, "")),
    formations: asNumber(row.formations),
    sensibilisations: asNumber(row.sensibilisations),
    distributions: asNumber(row.distributions),
    reunions: asNumber(row.reunions),
    missions: asNumber(row.missions),
    autres: asNumber(row.autres),
  }));

  const budgetComparison: BudgetComparisonPoint[] = (
    payload.budget_comparison ?? []
  ).map((row) => ({
    label: asString(row.label, asString(row.mois, "")),
    planned: asNumber(row.planned ?? row.prevu),
    actual: asNumber(row.actual ?? row.depense),
    currency: asString(row.currency, "USD"),
  }));

  const secondaryStats: SecondaryStat[] = (payload.secondary_stats ?? []).map(
    (row, index) => ({
      id: asString(row.id, `stat-${index}`),
      label: asString(row.label),
      value:
        row.value === null || row.value === undefined
          ? null
          : asNumber(row.value),
      formatted:
        typeof row.formatted === "string"
          ? row.formatted
          : formatNumber(
              row.value === null || row.value === undefined
                ? null
                : asNumber(row.value),
            ),
      href: asString(row.href, "/admin"),
      variationPct:
        typeof row.variation_pct === "number"
          ? row.variation_pct
          : typeof row.variationPct === "number"
            ? row.variationPct
            : null,
      available: row.available !== false,
    }),
  );

  const demoMode = Boolean(
    payload.presentation_mode ||
      payload.is_demo ||
      payload.summary?.demo_mode,
  );

  const personnes = mapKpi(
    kpisRaw.personnes_touchees ?? kpisRaw.personnesTouchees,
    "Personnes touchées",
  );
  const femmes = mapKpi(
    kpisRaw.femmes_touchees ?? kpisRaw.femmesTouchees,
    "Femmes touchées",
  );
  const projets = mapKpi(
    kpisRaw.projets_actifs ?? kpisRaw.projetsActifs,
    "Projets actifs",
  );
  const activites = mapKpi(
    kpisRaw.activites_realisees ?? kpisRaw.activitesRealisees,
    "Activités réalisées",
  );
  const partenaires = mapKpi(
    kpisRaw.partenaires_actifs ?? kpisRaw.partenairesActifs,
    "Partenaires actifs",
  );
  const budget = mapKpi(
    kpisRaw.budget_depense ?? kpisRaw.budgetDepense,
    "Budget dépensé",
  );

  const pendingMessages =
    secondaryStats.find((s) => s.id === "messages")?.value ?? null;

  return {
    demoMode,
    presentationMode: demoMode,
    summary: {
      demoMode,
      kpis: {
        personnesTouchees: personnes,
        femmesTouchees: femmes,
        projetsActifs: projets,
        activitesRealisees: activites,
        partenairesActifs: partenaires,
        budgetDepense: viewer.canReadFinances
          ? budget
          : {
              ...budget,
              available: false,
              value: null,
              formatted: "—",
              tooltip: "Accès réservé aux rôles finance / direction",
            },
      },
    },
    beneficiaryEvolution,
    projectsByStatus,
    projectsBySector,
    projectsByProvince,
    topProjects,
    beneficiariesByProvince,
    monthlyActivities,
    budgetComparison: viewer.canReadFinances ? budgetComparison : [],
    alerts: mapAlerts(payload.alerts as Array<Record<string, unknown>> | undefined),
    secondaryStats,
    filterOptions: {
      programmes: payload.filter_options?.programmes ?? [],
      provinces: payload.filter_options?.provinces ?? [],
      projects: payload.filter_options?.projects ?? [],
    },
    badges: {
      newsletter:
        secondaryStats.find((s) => s.id === "newsletter")?.value ?? null,
      messages: pendingMessages,
      adhesions:
        secondaryStats.find((s) => s.id === "adhesions")?.value ?? null,
      notifications:
        (pendingMessages ?? 0) > 0 ? pendingMessages : null,
      messagerie: null,
    },
    viewer,
    accessibleSummary: `Tableau de bord généré le ${
      payload.generated_at ?? "—"
    }. ${personnes.formatted} personnes touchées, ${projets.formatted} projets actifs.`,
  };
}
