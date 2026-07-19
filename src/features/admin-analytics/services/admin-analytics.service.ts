import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import type {
  AnalyticsContext,
  AnalyticsKpi,
  AnalyticsNamedValue,
  AnalyticsPageData,
  AnalyticsSeriesPoint,
  AnalyticsTableRow,
} from "@/features/admin-analytics/types/admin-analytics";

function formatNumber(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function kpi(label: string, value: number | null): AnalyticsKpi {
  return {
    label,
    value,
    formatted: formatNumber(value),
    variationPct: null,
  };
}

function emptyPage(
  title: string,
  description: string,
  context: AnalyticsContext,
  createHref: string | null,
  exportFilename: string,
): AnalyticsPageData {
  return {
    title,
    description,
    context,
    primaryKpi: kpi("Total", 0),
    series: [],
    byProgramme: [],
    byProvince: [],
    bySector: [],
    byStatus: [],
    table: [],
    createHref,
    exportFilename,
  };
}

function countMap(rows: string[]): AnalyticsNamedValue[] {
  const map = new Map<string, number>();
  for (const key of rows) {
    const name = key.trim() || "Non classé";
    map.set(name, (map.get(name) ?? 0) + 1);
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0) || 1;
  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

function normalizeStatus(raw: string | null): string {
  const value = (raw ?? "").toLowerCase();
  if (/(en.?cours|active|actif)/.test(value)) return "En cours";
  if (/(planif|futur)/.test(value)) return "Planifiés";
  if (/(termin)/.test(value)) return "Terminés";
  if (/(suspend)/.test(value)) return "Suspendus";
  if (/(archiv)/.test(value)) return "Archivés";
  return raw?.trim() || "Autres";
}

function matchesStatusFilter(status: string | null, filter: string | null): boolean {
  if (!filter) return true;
  const f = filter.toLowerCase();
  const n = normalizeStatus(status).toLowerCase();
  if (["actif", "en_cours", "en-cours"].includes(f)) return n.includes("cours");
  if (["planifie", "planifié", "futur"].includes(f)) return n.includes("planif");
  if (["termine", "terminé"].includes(f)) return n.includes("termin");
  if (f.includes("suspend")) return n.includes("suspend");
  if (f.includes("archiv")) return n.includes("archiv");
  return (status ?? "").toLowerCase().includes(f);
}

export async function getProjectAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("projets:read");
  const supabase = await createClientSafe();
  if (!supabase) {
    return emptyPage(
      "Analyse des projets",
      "Données projets indisponibles.",
      context,
      "/admin/projets/nouvelle",
      "analyse-projets.csv",
    );
  }

  const { data } = await supabase
    .from("projets")
    .select(
      "id, title, status, location, beneficiaries, budget, secteur, program_id, active, slug" as never,
    );

  type Row = {
    id: string;
    title: string;
    status: string | null;
    location: string | null;
    beneficiaries: number | null;
    budget: number | null;
    secteur: string | null;
    program_id: string | null;
    active: boolean | null;
  };

  let rows = ((data ?? []) as unknown as Row[]).filter((r) => r.active !== false);

  if (context.programmeId) {
    rows = rows.filter((r) => r.program_id === context.programmeId);
  }
  if (context.projetId) {
    rows = rows.filter((r) => r.id === context.projetId);
  }
  if (context.provinceId) {
    const p = context.provinceId.replace(/-/g, " ").toLowerCase();
    rows = rows.filter((r) => (r.location ?? "").toLowerCase().includes(p));
  }
  if (context.secteurId) {
    const s = context.secteurId.replace(/-/g, " ").toLowerCase();
    rows = rows.filter((r) => (r.secteur ?? "").toLowerCase().includes(s));
  }
  if (context.statut) {
    rows = rows.filter((r) => matchesStatusFilter(r.status, context.statut));
  }

  const byStatus = countMap(rows.map((r) => normalizeStatus(r.status)));
  const byProvince = countMap(rows.map((r) => r.location ?? "Non localisé"));
  const bySector = countMap(rows.map((r) => r.secteur ?? "Non classé"));

  const series: AnalyticsSeriesPoint[] = byStatus.map((item) => ({
    label: item.name,
    value: item.value,
  }));

  const table: AnalyticsTableRow[] = rows.slice(0, 100).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.secteur,
    status: normalizeStatus(r.status),
    location: r.location,
    value: r.beneficiaries,
    href: `/admin/projets/${r.id}/analyse`,
  }));

  return {
    title: "Analyse des projets",
    description:
      "Détail des projets filtrés depuis le tableau de bord, avec répartition et actions.",
    context,
    primaryKpi: kpi("Projets", rows.length),
    series,
    byProgramme: [],
    byProvince,
    bySector,
    byStatus,
    table,
    createHref: "/admin/projets/nouvelle",
    exportFilename: "analyse-projets.csv",
  };
}

export async function getBeneficiaryAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("beneficiaires:read");
  const supabase = await createClientSafe();
  if (!supabase) {
    return emptyPage(
      "Analyse des bénéficiaires",
      "Données bénéficiaires indisponibles.",
      context,
      "/admin/beneficiaires/nouveau",
      "analyse-beneficiaires.csv",
    );
  }

  const { data: stats } = await supabase
    .from("dashboard_stats_mensuelles" as never)
    .select("mois, province, femmes, hommes, enfants, jeunes, total" as never);

  type Stat = {
    mois: string;
    province: string | null;
    femmes: number | null;
    hommes: number | null;
    enfants: number | null;
    jeunes: number | null;
    total: number | null;
  };

  let rows = (stats ?? []) as unknown as Stat[];
  if (context.provinceId) {
    const p = context.provinceId.replace(/-/g, " ").toLowerCase();
    rows = rows.filter((r) => (r.province ?? "").toLowerCase().includes(p));
  }
  if (context.mois) {
    rows = rows.filter((r) => String(r.mois).startsWith(context.mois!));
  }

  const byMonth = new Map<string, number>();
  let total = 0;
  let femmes = 0;
  let hommes = 0;
  let enfants = 0;
  let jeunes = 0;

  for (const row of rows) {
    const key = String(row.mois).slice(0, 7);
    const value =
      context.segment === "femmes"
        ? row.femmes ?? 0
        : context.segment === "hommes"
          ? row.hommes ?? 0
          : context.segment === "enfants"
            ? row.enfants ?? 0
            : context.segment === "jeunes"
              ? row.jeunes ?? 0
              : row.total ?? 0;
    byMonth.set(key, (byMonth.get(key) ?? 0) + value);
    total += row.total ?? 0;
    femmes += row.femmes ?? 0;
    hommes += row.hommes ?? 0;
    enfants += row.enfants ?? 0;
    jeunes += row.jeunes ?? 0;
  }

  const series = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));

  const segmentValue =
    context.segment === "femmes"
      ? femmes
      : context.segment === "hommes"
        ? hommes
        : context.segment === "enfants"
          ? enfants
          : context.segment === "jeunes"
            ? jeunes
            : total;

  return {
    title: "Analyse des bénéficiaires",
    description: "Évolution et répartition des personnes touchées.",
    context,
    primaryKpi: kpi(
      context.segment === "femmes" ? "Femmes touchées" : "Personnes touchées",
      segmentValue,
    ),
    series,
    byProgramme: [],
    byProvince: countMap(rows.map((r) => r.province ?? "Non localisé")),
    bySector: [
      { name: "Femmes", value: femmes },
      { name: "Hommes", value: hommes },
      { name: "Enfants", value: enfants },
      { name: "Jeunes", value: jeunes },
    ],
    byStatus: [],
    table: series.slice(-24).map((point, index) => ({
      id: `mois-${index}`,
      title: point.label,
      value: point.value,
      href: `/admin/analyse/beneficiaires?mois=${encodeURIComponent(point.label)}&segment=${context.segment ?? "total"}`,
    })),
    createHref: "/admin/beneficiaires/nouveau",
    exportFilename: "analyse-beneficiaires.csv",
  };
}

export async function getActivityAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("activites:read");
  const supabase = await createClientSafe();
  if (!supabase) {
    return emptyPage(
      "Analyse des activités",
      "Données activités indisponibles.",
      context,
      "/admin/activites/nouvelle",
      "analyse-activites.csv",
    );
  }

  const { data: monthly } = await supabase
    .from("dashboard_activites_mensuelles" as never)
    .select("mois, category, value" as never);

  type Row = { mois: string; category: string; value: number | null };
  let rows = (monthly ?? []) as unknown as Row[];
  if (context.type) {
    const t = context.type.toLowerCase();
    rows = rows.filter((r) => r.category.toLowerCase().includes(t));
  }
  if (context.mois) {
    rows = rows.filter((r) => String(r.mois).startsWith(context.mois!));
  }

  const byMonth = new Map<string, number>();
  for (const row of rows) {
    const key = String(row.mois).slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + (row.value ?? 0));
  }
  const series = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));

  const total = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);

  return {
    title: "Analyse des activités",
    description: "Répartition mensuelle et par type d’activités réalisées.",
    context,
    primaryKpi: kpi("Activités", total),
    series,
    byProgramme: [],
    byProvince: [],
    bySector: (() => {
      const map = new Map<string, number>();
      for (const row of rows) {
        map.set(row.category, (map.get(row.category) ?? 0) + (row.value ?? 0));
      }
      return [...map.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 12);
    })(),
    byStatus: [],
    table: (() => {
      const map = new Map<string, number>();
      for (const row of rows) {
        map.set(row.category, (map.get(row.category) ?? 0) + (row.value ?? 0));
      }
      return [...map.entries()].map(([name, value], index) => ({
        id: `cat-${index}`,
        title: name,
        value,
        href: `/admin/analyse/activites?type=${encodeURIComponent(name.toLowerCase())}`,
      }));
    })(),
    createHref: "/admin/activites/nouvelle",
    exportFilename: "analyse-activites.csv",
  };
}

export async function getFinanceAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("finances:read");
  const supabase = await createClientSafe();
  if (!supabase) {
    return emptyPage(
      "Analyse financière",
      "Données financières indisponibles.",
      context,
      "/admin/finances/depenses",
      "analyse-finances.csv",
    );
  }

  const { data } = await supabase
    .from("dashboard_budget_mensuel" as never)
    .select("mois, prevu, depense, currency" as never);

  type Row = {
    mois: string;
    prevu: number | null;
    depense: number | null;
    currency: string | null;
  };
  let rows = (data ?? []) as unknown as Row[];
  if (context.mois) {
    rows = rows.filter((r) => String(r.mois).startsWith(context.mois!));
  }

  const series = rows
    .map((r) => ({
      label: String(r.mois).slice(0, 7),
      value: Number(r.depense ?? 0),
      secondary: Number(r.prevu ?? 0),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const depense = series.reduce((s, r) => s + r.value, 0);
  const prevu = series.reduce((s, r) => s + (r.secondary ?? 0), 0);

  return {
    title: "Analyse financière",
    description: "Budget prévu, dépensé et taux d’exécution.",
    context,
    primaryKpi: {
      label: "Budget dépensé",
      value: depense,
      formatted: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(depense),
      variationPct:
        prevu > 0 ? Math.round((depense / prevu) * 1000) / 10 : null,
    },
    series,
    byProgramme: [],
    byProvince: [],
    bySector: [
      { name: "Prévu", value: prevu },
      { name: "Dépensé", value: depense },
      { name: "Solde", value: Math.max(0, prevu - depense) },
    ],
    byStatus: [],
    table: series.map((point, index) => ({
      id: `budget-${index}`,
      title: point.label,
      value: point.value,
      subtitle: `Prévu ${formatNumber(point.secondary ?? 0)}`,
      href: `/admin/analyse/finances?mois=${encodeURIComponent(point.label)}`,
    })),
    createHref: "/admin/finances/depenses",
    exportFilename: "analyse-finances.csv",
  };
}

export async function getProvinceAnalytics(
  context: AnalyticsContext,
  slug: string,
): Promise<AnalyticsPageData> {
  const provinceContext: AnalyticsContext = {
    ...context,
    provinceId: slug,
    sourceWidget: context.sourceWidget ?? "carte-rdc",
  };
  const projects = await getProjectAnalytics(provinceContext);
  const beneficiaries = await getBeneficiaryAnalytics(provinceContext).catch(
    () => null,
  );

  return {
    ...projects,
    title: `Province — ${slug.replace(/-/g, " ")}`,
    description:
      "Vue provinciale : projets, bénéficiaires et actions terrain.",
    primaryKpi: projects.primaryKpi,
    series: beneficiaries?.series ?? projects.series,
    bySector: projects.bySector,
    byStatus: projects.byStatus,
    createHref: `/admin/projets/nouvelle?province=${encodeURIComponent(slug)}`,
    exportFilename: `analyse-province-${slug}.csv`,
  };
}

export async function getPartnerAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("partenaires:read");
  const supabase = await createClientSafe();
  if (!supabase) {
    return emptyPage(
      "Analyse des partenaires",
      "Données partenaires indisponibles.",
      context,
      "/admin/partenaires/nouveau",
      "analyse-partenaires.csv",
    );
  }

  const { data } = await supabase
    .from("partenaires")
    .select("id, name, title, active, created_at" as never);

  type Row = {
    id: string;
    name?: string | null;
    title?: string | null;
    active: boolean | null;
  };
  let rows = ((data ?? []) as unknown as Row[]).filter((r) => r.active !== false);
  if (context.statut === "actif") {
    rows = rows.filter((r) => r.active !== false);
  }

  return {
    title: "Analyse des partenaires",
    description: "Partenaires actifs et répartition.",
    context,
    primaryKpi: kpi("Partenaires actifs", rows.length),
    series: [{ label: "Actifs", value: rows.length }],
    byProgramme: [],
    byProvince: [],
    bySector: [],
    byStatus: [{ name: "Actifs", value: rows.length, percent: 100 }],
    table: rows.slice(0, 100).map((r) => ({
      id: r.id,
      title: r.name ?? r.title ?? "Partenaire",
      status: "Actif",
      href: `/admin/partenaires/${r.id}/modifier`,
    })),
    createHref: "/admin/partenaires/nouveau",
    exportFilename: "analyse-partenaires.csv",
  };
}

export async function getSectorAnalytics(
  context: AnalyticsContext,
  slug?: string,
): Promise<AnalyticsPageData> {
  const next: AnalyticsContext = {
    ...context,
    secteurId: slug ?? context.secteurId,
    sourceWidget: context.sourceWidget ?? "projets-secteur",
  };
  const data = await getProjectAnalytics(next);
  return {
    ...data,
    title: slug
      ? `Secteur — ${slug.replace(/-/g, " ")}`
      : "Analyse par secteur",
    description: "Projets et impact par secteur d’intervention.",
  };
}

export async function getEngagementAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("messages:read");
  const supabase = await createClientSafe();
  const empty = emptyPage(
    "Analyse de l’engagement",
    "Messages, adhésions et intentions de dons.",
    context,
    "/admin/messages",
    "analyse-engagement.csv",
  );
  if (!supabase) return empty;

  const [messages, membres, dons] = await Promise.all([
    supabase.from("messages").select("id, status, created_at"),
    supabase.from("membres").select("id, status, created_at"),
    supabase.from("dons").select("id, status, created_at"),
  ]);

  const pendingMessages = (messages.data ?? []).filter((m) =>
    ["pending", "nouveau", "unread", "new", "non_lu", ""].includes(
      (m.status ?? "").toLowerCase(),
    ),
  ).length;
  const pendingMembers = (membres.data ?? []).filter((m) =>
    ["pending", "en_attente", "nouveau", ""].includes(
      (m.status ?? "").toLowerCase(),
    ),
  ).length;
  const intents = (dons.data ?? []).filter((d) =>
    ["intent", "pending", "intention"].includes((d.status ?? "").toLowerCase()),
  ).length;

  return {
    ...empty,
    primaryKpi: kpi("Messages non traités", pendingMessages),
    byStatus: [
      { name: "Messages", value: pendingMessages },
      { name: "Adhésions", value: pendingMembers },
      { name: "Intentions de dons", value: intents },
    ],
    series: [
      { label: "Messages", value: pendingMessages },
      { label: "Adhésions", value: pendingMembers },
      { label: "Dons", value: intents },
    ],
    table: [
      {
        id: "messages",
        title: "Messages non traités",
        value: pendingMessages,
        href: "/admin/messages?statut=nouveau",
      },
      {
        id: "adhesions",
        title: "Adhésions en attente",
        value: pendingMembers,
        href: "/admin/adhesions?statut=en_attente",
      },
      {
        id: "dons",
        title: "Intentions de dons",
        value: intents,
        href: "/admin/dons?statut=intention",
      },
    ],
  };
}

export async function getDocumentsAnalytics(
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  await requirePermission("documents:read");
  return {
    ...emptyPage(
      "Analyse des documents",
      "Téléchargements et médiathèque.",
      context,
      "/admin/mediatheque",
      "analyse-documents.csv",
    ),
    createHref: "/admin/mediatheque",
    table: [
      {
        id: "mediatheque",
        title: "Ouvrir la médiathèque",
        href: "/admin/mediatheque",
      },
    ],
  };
}
