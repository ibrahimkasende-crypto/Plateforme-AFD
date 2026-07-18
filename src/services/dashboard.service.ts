import { adminDashboardDemoBundle } from "@/config/demo-data/admin-dashboard";
import { adminDashboardRpcSchema } from "@/features/dashboard/schemas/admin-dashboard-rpc";
import { resolveDashboardDateRange } from "@/features/dashboard/utils/dashboard-period";
import { mapRpcPayloadToBundle } from "@/features/dashboard/utils/map-rpc-payload";
import { getAdminViewer } from "@/lib/auth/admin-session";
import { createClientSafe } from "@/lib/supabase/safe";
import type {
  DashboardAlert,
  DashboardBundle,
  DashboardFilters,
  DashboardSummary,
  KpiValue,
  NamedCount,
  SecondaryStat,
  TopProject,
} from "@/features/statistiques/types/dashboard";

function formatNumber(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function unavailableKpi(label: string, tooltip?: string): KpiValue {
  return {
    label,
    value: null,
    formatted: "—",
    variationPct: null,
    available: false,
    tooltip: tooltip ?? "Donnée non disponible",
  };
}

function availableKpi(
  label: string,
  value: number,
  variationPct: number | null = null,
): KpiValue {
  return {
    label,
    value,
    formatted: formatNumber(value),
    variationPct,
    available: true,
  };
}

function normalizeStatus(raw: string | null): string {
  const value = (raw ?? "").toLowerCase().trim();
  if (!value) return "Autres";
  if (/(en.?cours|active|actif|ongoing)/.test(value)) return "En cours";
  if (/(planif|planned|à.?venir|a.?venir)/.test(value)) return "Planifiés";
  if (/(termin|complet|done|finished)/.test(value)) return "Terminés";
  if (/(suspend|pause)/.test(value)) return "Suspendus";
  if (/(archiv)/.test(value)) return "Archivés";
  return raw?.trim() || "Autres";
}

function shouldUseDemo(hasMeaningfulData: boolean): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA === "false") return false;
  if (process.env.NEXT_PUBLIC_AFD_ADMIN_DEMO === "false") return false;
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN_DEMO_DATA === "true") return true;
  if (process.env.NEXT_PUBLIC_AFD_ADMIN_DEMO === "true") return true;
  if (process.env.NODE_ENV === "production") return false;
  return !hasMeaningfulData;
}

async function tryGetDashboardFromRpc(
  filters: DashboardFilters,
  viewer: DashboardBundle["viewer"],
): Promise<DashboardBundle | null> {
  const supabase = await createClientSafe();
  if (!supabase) return null;

  const { dateStart, dateEnd } = resolveDashboardDateRange(filters);

  const { data, error } = await supabase.rpc("get_admin_dashboard" as never, {
    p_date_start: dateStart,
    p_date_end: dateEnd,
    p_programme_id: filters.programmeId,
    p_province: filters.province,
    p_projet_id: filters.projectId,
  } as never);

  if (error || data == null) {
    return null;
  }

  const parsed = adminDashboardRpcSchema.safeParse(data);
  if (!parsed.success) {
    return null;
  }

  return mapRpcPayloadToBundle(parsed.data, viewer);
}

const DEFAULT_FILTERS: DashboardFilters = {
  period: "year",
  programmeId: null,
  province: null,
  projectId: null,
};

export async function getDashboardSummary(
  filters: DashboardFilters = DEFAULT_FILTERS,
): Promise<DashboardSummary> {
  const bundle = await getDashboardBundle(filters);
  return bundle.summary;
}

export async function getBeneficiaryEvolution(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).beneficiaryEvolution;
}

export async function getProjectsByStatus(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).projectsByStatus;
}

export async function getProjectsBySector(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).projectsBySector;
}

export async function getTopProjects(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).topProjects;
}

export async function getBeneficiariesByProvince(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).beneficiariesByProvince;
}

export async function getMonthlyActivities(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).monthlyActivities;
}

export async function getBudgetComparison(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).budgetComparison;
}

export async function getDashboardAlerts(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).alerts;
}

export async function getDashboardSecondaryStats(
  filters: DashboardFilters = DEFAULT_FILTERS,
) {
  return (await getDashboardBundle(filters)).secondaryStats;
}

export async function getDashboardBundle(
  filters: DashboardFilters = DEFAULT_FILTERS,
): Promise<DashboardBundle> {
  const viewer = await getAdminViewer();
  if (!viewer) {
    throw new Error("Admin session required");
  }

  const fromRpc = await tryGetDashboardFromRpc(filters, viewer);
  if (fromRpc) {
    const hasCharts =
      fromRpc.beneficiaryEvolution.length > 0 ||
      fromRpc.projectsByStatus.length > 0 ||
      fromRpc.beneficiariesByProvince.length > 0;
    if (hasCharts || fromRpc.demoMode || !shouldUseDemo(false)) {
      return fromRpc;
    }
  }

  const supabase = await createClientSafe();

  if (!supabase) {
    if (shouldUseDemo(false)) {
      return {
        ...adminDashboardDemoBundle,
        viewer,
        accessibleSummary: adminDashboardDemoBundle.accessibleSummary,
      };
    }
    return emptyBundle(viewer, true);
  }

  const [
    projetsRes,
    programmesRes,
    partenairesRes,
    messagesRes,
    membresRes,
    donsRes,
  ] = await Promise.all([
    supabase
      .from("projets")
      .select(
        "id, title, slug, status, beneficiaries, budget, location, active, program_id, image_url, created_at",
      ),
    supabase.from("programmes").select("id, title, active").eq("active", true),
    supabase.from("partenaires").select("id, active").eq("active", true),
    supabase.from("messages").select("id, status, created_at"),
    supabase.from("membres").select("id, status, created_at"),
    supabase.from("dons").select("id, amount, currency, status, created_at"),
  ]);

  let newsletterCount: number | null = null;
  try {
    const { count } = await supabase
      .from("abonnes_newsletter" as never)
      .select("id" as never, { count: "exact", head: true })
      .eq("statut" as never, "actif");
    newsletterCount = count ?? null;
  } catch {
    newsletterCount = null;
  }

  const projets = (projetsRes.data ?? []).filter((p) => p.active !== false);
  const programmes = programmesRes.data ?? [];
  const partenaires = partenairesRes.data ?? [];
  const messages = messagesRes.data ?? [];
  const membres = membresRes.data ?? [];
  const dons = donsRes.data ?? [];

  const filteredProjects = projets.filter((project) => {
    if (filters.programmeId && project.program_id !== filters.programmeId) {
      return false;
    }
    if (
      filters.province &&
      !(project.location ?? "")
        .toLowerCase()
        .includes(filters.province.toLowerCase())
    ) {
      return false;
    }
    if (filters.projectId && project.id !== filters.projectId) {
      return false;
    }
    return true;
  });

  const personnes = filteredProjects.reduce(
    (sum, p) => sum + (p.beneficiaries ?? 0),
    0,
  );
  const activeProjects = filteredProjects.filter((p) => {
    const status = normalizeStatus(p.status);
    return status === "En cours" || status === "Planifiés";
  }).length;

  const statusMap = new Map<string, number>();
  for (const project of filteredProjects) {
    const key = normalizeStatus(project.status);
    statusMap.set(key, (statusMap.get(key) ?? 0) + 1);
  }
  const totalForPercent = filteredProjects.length || 1;
  const projectsByStatus: NamedCount[] = [...statusMap.entries()].map(
    ([name, value]) => ({
      name,
      value,
      percent: Math.round((value / totalForPercent) * 100),
    }),
  );

  const provinceMap = new Map<string, number>();
  for (const project of filteredProjects) {
    const province = project.location?.trim() || "Non précisée";
    provinceMap.set(
      province,
      (provinceMap.get(province) ?? 0) + (project.beneficiaries ?? 0),
    );
  }
  const beneficiariesByProvince = [...provinceMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const topProjects: TopProject[] = [...filteredProjects]
    .sort((a, b) => (b.beneficiaries ?? 0) - (a.beneficiaries ?? 0))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      beneficiaries: p.beneficiaries,
      imageUrl: p.image_url,
    }));

  const pendingMessages = messages.filter(
    (m) => !m.status || m.status === "pending" || m.status === "nouveau",
  ).length;
  const pendingMemberships = membres.filter(
    (m) => !m.status || m.status === "pending" || m.status === "en_attente",
  ).length;
  const donationIntents = dons.filter((d) =>
    ["intent", "pending", "intention"].includes((d.status ?? "").toLowerCase()),
  ).length;

  const budgetSum = viewer.canReadFinances
    ? filteredProjects.reduce((sum, p) => sum + (p.budget ?? 0), 0)
    : null;

  const hasMeaningfulData =
    filteredProjects.length > 0 ||
    partenaires.length > 0 ||
    messages.length > 0;

  if (shouldUseDemo(hasMeaningfulData)) {
    return {
      ...adminDashboardDemoBundle,
      viewer,
      badges: {
        newsletter: newsletterCount ?? adminDashboardDemoBundle.badges.newsletter,
        messages: pendingMessages || adminDashboardDemoBundle.badges.messages,
        adhesions: pendingMemberships || adminDashboardDemoBundle.badges.adhesions,
        notifications: adminDashboardDemoBundle.badges.notifications,
      },
    };
  }

  const secondaryStats: SecondaryStat[] = [
    {
      id: "messages",
      label: "Messages non traités",
      value: pendingMessages,
      formatted: formatNumber(pendingMessages),
      href: "/admin/messages",
      available: true,
    },
    {
      id: "adhesions",
      label: "Adhésions en attente",
      value: pendingMemberships,
      formatted: formatNumber(pendingMemberships),
      href: "/admin/adhesions",
      available: true,
    },
    {
      id: "dons",
      label: "Intentions de dons",
      value: donationIntents,
      formatted: formatNumber(donationIntents),
      href: "/admin/dons/intentions",
      available: true,
    },
    {
      id: "newsletter",
      label: "Abonnés newsletter",
      value: newsletterCount,
      formatted: formatNumber(newsletterCount),
      href: "/admin/newsletter/abonnes",
      available: newsletterCount !== null,
    },
    {
      id: "documents",
      label: "Documents téléchargés",
      value: null,
      formatted: "—",
      href: "/admin/mediatheque",
      available: false,
    },
    {
      id: "rapports",
      label: "Rapports générés",
      value: null,
      formatted: "—",
      href: "/admin/rapports",
      available: false,
    },
  ];

  const alerts: DashboardAlert[] = [];
  if (pendingMessages > 0) {
    alerts.push({
      id: "msg-pending",
      message: `${pendingMessages} message(s) de contact non traité(s)`,
      level: pendingMessages > 10 ? "warning" : "info",
      href: "/admin/messages",
      dateLabel: "Temps réel",
    });
  }
  if (pendingMemberships > 0) {
    alerts.push({
      id: "adh-pending",
      message: `${pendingMemberships} demande(s) d’adhésion en attente`,
      level: "info",
      href: "/admin/adhesions",
      dateLabel: "Temps réel",
    });
  }

  const enCours = projectsByStatus.find((s) => s.name === "En cours")?.value ?? 0;
  const planifies =
    projectsByStatus.find((s) => s.name === "Planifiés")?.value ?? 0;
  const termines =
    projectsByStatus.find((s) => s.name === "Terminés")?.value ?? 0;

  return {
    demoMode: false,
    summary: {
      demoMode: false,
      kpis: {
        personnesTouchees:
          personnes > 0
            ? availableKpi("Personnes touchées", personnes)
            : unavailableKpi(
                "Personnes touchées",
                "Aucun total de bénéficiaires agrégé disponible",
              ),
        femmesTouchees: unavailableKpi(
          "Femmes touchées",
          "Ventilation genre non disponible dans Supabase",
        ),
        projetsActifs: availableKpi("Projets actifs", activeProjects),
        activitesRealisees: unavailableKpi(
          "Activités réalisées",
          "Table des activités non disponible",
        ),
        partenairesActifs: availableKpi(
          "Partenaires actifs",
          partenaires.length,
        ),
        budgetDepense: viewer.canReadFinances
          ? budgetSum && budgetSum > 0
            ? {
                ...availableKpi("Budget dépensé", budgetSum),
                formatted: `${formatNumber(budgetSum)} (budgets projets)`,
                tooltip:
                  "Somme des budgets projets — ne constitue pas une dépense confirmée",
              }
            : unavailableKpi(
                "Budget dépensé",
                "Aucun budget projet public agrégé",
              )
          : unavailableKpi(
              "Budget dépensé",
              "Accès réservé aux rôles finance / direction",
            ),
      },
    },
    beneficiaryEvolution: [],
    projectsByStatus,
    projectsBySector: [],
    topProjects,
    beneficiariesByProvince,
    monthlyActivities: [],
    budgetComparison: viewer.canReadFinances ? [] : [],
    alerts,
    secondaryStats,
    filterOptions: {
      programmes: programmes.map((p) => ({ id: p.id, title: p.title })),
      provinces: [
        ...new Set(
          projets
            .map((p) => p.location?.trim())
            .filter((v): v is string => Boolean(v)),
        ),
      ].sort((a, b) => a.localeCompare(b, "fr")),
      projects: filteredProjects.map((p) => ({ id: p.id, title: p.title })),
    },
    badges: {
      newsletter: newsletterCount,
      messages: pendingMessages,
      adhesions: pendingMemberships,
      notifications: pendingMessages + pendingMemberships > 0
        ? pendingMessages + pendingMemberships
        : null,
    },
    viewer,
    accessibleSummary: `${filteredProjects.length} projet(s) au total, dont ${enCours} en cours, ${planifies} planifié(s) et ${termines} terminé(s). ${personnes > 0 ? `${formatNumber(personnes)} personnes touchées (agrégat projets).` : "Total de bénéficiaires non disponible."}`,
  };
}

function emptyBundle(viewer: DashboardBundle["viewer"], demoAllowed: boolean): DashboardBundle {
  if (demoAllowed && shouldUseDemo(false)) {
    return {
      ...adminDashboardDemoBundle,
      viewer,
    };
  }

  const emptyKpi = (label: string) => unavailableKpi(label);

  return {
    demoMode: false,
    summary: {
      demoMode: false,
      kpis: {
        personnesTouchees: emptyKpi("Personnes touchées"),
        femmesTouchees: emptyKpi("Femmes touchées"),
        projetsActifs: emptyKpi("Projets actifs"),
        activitesRealisees: emptyKpi("Activités réalisées"),
        partenairesActifs: emptyKpi("Partenaires actifs"),
        budgetDepense: emptyKpi("Budget dépensé"),
      },
    },
    beneficiaryEvolution: [],
    projectsByStatus: [],
    projectsBySector: [],
    topProjects: [],
    beneficiariesByProvince: [],
    monthlyActivities: [],
    budgetComparison: [],
    alerts: [],
    secondaryStats: [],
    filterOptions: { programmes: [], provinces: [], projects: [] },
    badges: {
      newsletter: null,
      messages: null,
      adhesions: null,
      notifications: null,
    },
    viewer,
    accessibleSummary: "Aucune statistique disponible pour le moment.",
  };
}
