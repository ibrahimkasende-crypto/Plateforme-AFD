"use client";

import Link from "next/link";
import { Suspense } from "react";
import {
  ChartNoAxesCombined,
  DollarSign,
  Goal,
  HandHeart,
  Handshake,
  HeartHandshake,
  ListChecks,
  Mail,
  MailCheck,
  Plus,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { AdminFilters } from "@/components/admin/admin-filters";
import { AdminProvincePanel } from "@/components/admin/admin-province-panel";
import { DashboardKpiCard } from "@/components/admin/dashboard-kpi-card";
import { DashboardTopProjects } from "@/components/admin/dashboard-top-projects";
import { ChartCard } from "@/components/charts/ChartCard";
import {
  BeneficiaryEvolutionChart,
  BudgetComparisonChart,
  MonthlyActivitiesChart,
  ProjectSectorChart,
  ProjectStatusChart,
} from "@/components/charts";
import { EmptyState } from "@/components/shared/EmptyState";
import { buildAnalyticsHref } from "@/features/admin-analytics/utils/analytics-search-params";
import { useDashboardBundle } from "@/features/statistiques/hooks/use-dashboard-bundle";
import { useDashboardFilters } from "@/features/statistiques/hooks/use-dashboard-filters";
import type {
  DashboardBundle,
  SecondaryStat,
} from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminDashboardViewProps = {
  initialData: DashboardBundle;
};

const SECONDARY_ICONS: Record<
  string,
  { icon: typeof Mail; bg: string }
> = {
  messages: { icon: Mail, bg: "bg-[var(--admin-blue)]" },
  adhesions: { icon: UserRoundPlus, bg: "bg-[var(--admin-green)]" },
  dons: { icon: HandHeart, bg: "bg-[var(--admin-orange)]" },
  newsletter: { icon: MailCheck, bg: "bg-[var(--admin-teal)]" },
  add_project: { icon: Plus, bg: "bg-[var(--admin-primary)]" },
  add_activity: { icon: ListChecks, bg: "bg-[var(--admin-purple)]" },
};

function SecondaryStatCard({ stat }: { stat: SecondaryStat }) {
  const meta = SECONDARY_ICONS[stat.id] ?? {
    icon: Mail,
    bg: "bg-[var(--admin-blue)]",
  };
  const Icon = meta.icon;
  const isAction = stat.id.startsWith("add_");
  const valueLabel = isAction
    ? "Ouvrir"
    : stat.formatted === "" || stat.formatted == null
      ? "0"
      : String(stat.formatted);

  return (
    <Link
      href={stat.href}
      className={cn(
        "admin-panel flex h-full min-h-[4.5rem] flex-row items-center gap-3 !p-3 transition hover:border-[var(--admin-primary)]/40",
        isAction && "border-[var(--admin-primary)]/30 bg-[var(--admin-primary)]/5",
      )}
    >
      <span
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white",
          meta.bg,
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium leading-snug text-[var(--admin-muted)]">
          {stat.label}
        </span>
        <span
          className={cn(
            "mt-1 block font-display font-extrabold leading-none tabular-nums tracking-tight text-[var(--admin-navy,#0d254e)]",
            isAction
              ? "text-[12px] font-semibold text-[var(--admin-primary)]"
              : "text-[22px] md:text-[26px]",
          )}
        >
          {valueLabel}
        </span>
      </span>
    </Link>
  );
}

function DashboardContent({ initialData }: AdminDashboardViewProps) {
  const { filters } = useDashboardFilters();
  const { data, isError, refetch, isFetching } = useDashboardBundle(
    initialData,
    filters,
  );
  const bundle = data ?? initialData;
  const { summary, viewer } = bundle;

  const provinceProjects = bundle.projectsByProvince;

  const filterContext = {
    period: filters.period,
    programmeId: filters.programmeId,
    provinceId: filters.province,
    projetId: filters.projectId,
    dateStart: filters.from ?? null,
    dateEnd: filters.to ?? null,
  };

  const kpiEntries = [
    {
      key: "personnesTouchees" as const,
      icon: UsersRound,
      iconBg: "bg-[var(--admin-blue)]",
      href: buildAnalyticsHref("/admin/analyse/beneficiaires", {
        ...filterContext,
        segment: "total",
        sourceWidget: "kpi-personnes",
      }),
    },
    {
      key: "femmesTouchees" as const,
      icon: HeartHandshake,
      iconBg: "bg-[var(--admin-green)]",
      href: buildAnalyticsHref("/admin/analyse/beneficiaires", {
        ...filterContext,
        segment: "femmes",
        sourceWidget: "kpi-femmes",
      }),
    },
    {
      key: "projetsActifs" as const,
      icon: Goal,
      iconBg: "bg-[var(--admin-orange)]",
      href: buildAnalyticsHref("/admin/analyse/projets", {
        ...filterContext,
        statut: "actif",
        sourceWidget: "kpi-projets",
      }),
    },
    {
      key: "activitesRealisees" as const,
      icon: ChartNoAxesCombined,
      iconBg: "bg-[var(--admin-purple)]",
      href: buildAnalyticsHref("/admin/analyse/activites", {
        ...filterContext,
        sourceWidget: "kpi-activites",
      }),
    },
    {
      key: "partenairesActifs" as const,
      icon: Handshake,
      iconBg: "bg-[var(--admin-teal)]",
      href: buildAnalyticsHref("/admin/analyse/partenaires", {
        ...filterContext,
        statut: "actif",
        sourceWidget: "kpi-partenaires",
      }),
    },
    {
      key: "budgetDepense" as const,
      icon: DollarSign,
      iconBg: "bg-[var(--admin-gold)]",
      href: viewer.canReadFinances
        ? buildAnalyticsHref("/admin/analyse/finances", {
            ...filterContext,
            vue: "depenses",
            sourceWidget: "kpi-budget",
          })
        : "/acces-refuse",
    },
  ];

  const bottomRow: SecondaryStat[] = [
    {
      id: "add_project",
      label: "Ajouter un projet",
      value: null,
      formatted: "",
      href: "/admin/projets/nouveau",
      available: true,
    },
    {
      id: "add_activity",
      label: "Ajouter une activité",
      value: null,
      formatted: "",
      href: "/admin/activites/nouvelle",
      available: true,
    },
    ...bundle.secondaryStats
      .filter((s) =>
        ["messages", "adhesions", "dons", "newsletter"].includes(s.id),
      )
      .map((stat) => {
        if (stat.id === "messages") {
          return { ...stat, href: "/admin/messages?status=nouveau" };
        }
        if (stat.id === "adhesions") {
          return { ...stat, href: "/admin/adhesions?statut=en_attente" };
        }
        if (stat.id === "dons") {
          return { ...stat, href: "/admin/dons?statut=intention" };
        }
        return stat;
      })
      .slice(0, 4),
  ];

  return (
    <div
      data-dashboard-overview
      className="admin-dashboard-overview relative max-lg:grid-cols-1 max-lg:auto-rows-auto max-lg:overflow-y-auto max-lg:[grid-template-rows:none]"
    >
      <p className="sr-only">{bundle.accessibleSummary}</p>

      <div
        data-dashboard-filters
        className="relative z-20 col-span-full overflow-visible"
      >
        <AdminFilters
          filterOptions={bundle.filterOptions}
          bundle={bundle}
          compact
          className="h-full"
        />
      </div>

      {kpiEntries.map(({ key, icon, iconBg, href }) => (
        <div
          key={key}
          className="col-span-2 min-h-0 overflow-visible max-lg:col-span-1 max-sm:col-span-full"
        >
          <DashboardKpiCard
            kpi={summary.kpis[key]}
            icon={icon}
            iconBgClassName={iconBg}
            href={href}
          />
        </div>
      ))}

      <ChartCard
        title="Évolution des bénéficiaires"
        className="col-span-4 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.beneficiaryEvolution.length === 0 ? (
          <EmptyState
            title="Aucune série disponible"
            description="Ajoutez des statistiques bénéficiaires via le module Bénéficiaires."
            action={
              <Link href="/admin/beneficiaires/nouveau" className="text-[var(--admin-primary)] underline">
                Saisir des agrégats
              </Link>
            }
          />
        ) : (
          <BeneficiaryEvolutionChart
            data={bundle.beneficiaryEvolution}
            accessibleSummary={bundle.accessibleSummary}
          />
        )}
      </ChartCard>

      <ChartCard
        title="Projets par statut"
        className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.projectsByStatus.length === 0 ? (
          <EmptyState
            title="Aucun projet"
            description="Créez des projets pour alimenter ce graphique."
            action={
              <Link href="/admin/projets/nouveau" className="text-[var(--admin-primary)] underline">
                Ajouter un projet
              </Link>
            }
          />
        ) : (
          <ProjectStatusChart data={bundle.projectsByStatus} />
        )}
      </ChartCard>

      <ChartCard
        title="Projets par secteur"
        className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.projectsBySector.length === 0 ? (
          <EmptyState
            title="Aucun secteur"
            description="Renseignez le secteur sur les programmes ou projets."
            action={
              <Link href="/admin/programmes" className="text-[var(--admin-primary)] underline">
                Gérer les programmes
              </Link>
            }
          />
        ) : (
          <ProjectSectorChart data={bundle.projectsBySector} />
        )}
      </ChartCard>

      <div className="admin-panel col-span-2 max-xl:col-span-6 max-lg:col-span-full">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="admin-panel__title">Top 5 projets</h3>
          <Link
            href="/admin/projets"
            className="text-[11px] font-semibold text-[var(--admin-primary)] hover:underline"
          >
            Voir tous
          </Link>
        </div>
        <div className="admin-panel__body overflow-y-auto">
          <DashboardTopProjects projects={bundle.topProjects} compact />
        </div>
      </div>

      <ChartCard
        title="Projets par province"
        className="col-span-4 max-xl:col-span-6 max-lg:col-span-full"
      >
        {provinceProjects.length === 0 ? (
          <EmptyState
            title="Aucune province"
            description="Indiquez la province (location) sur chaque projet."
            action={
              <Link href="/admin/projets" className="text-[var(--admin-primary)] underline">
                Voir les projets
              </Link>
            }
          />
        ) : (
          <AdminProvincePanel data={provinceProjects} />
        )}
      </ChartCard>

      <ChartCard
        title="Activités réalisées par mois"
        className="col-span-4 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.monthlyActivities.length === 0 ? (
          <EmptyState
            title="Aucune activité"
            description="Ajoutez des activités via le module Activités."
            action={
              <Link href="/admin/activites/nouvelle" className="text-[var(--admin-primary)] underline">
                Ajouter une activité
              </Link>
            }
          />
        ) : (
          <MonthlyActivitiesChart data={bundle.monthlyActivities} />
        )}
      </ChartCard>

      {viewer.canReadFinances ? (
        <ChartCard
          title="Budget prévu vs dépensé"
          className="col-span-4 max-xl:col-span-6 max-lg:col-span-full"
        >
          {bundle.budgetComparison.length === 0 ? (
            <EmptyState
              title="Aucune donnée budgétaire"
              description="Saisissez budgets et dépenses dans Finances."
              action={
                <Link href="/admin/finances/budgets" className="text-[var(--admin-primary)] underline">
                  Ouvrir Finances
                </Link>
              }
            />
          ) : (
            <BudgetComparisonChart data={bundle.budgetComparison} />
          )}
        </ChartCard>
      ) : (
        <div className="admin-panel col-span-4 flex items-center justify-center max-xl:col-span-6 max-lg:col-span-full">
          <p className="text-center text-xs text-[var(--admin-muted)]">
            Données financières réservées aux rôles autorisés.
          </p>
        </div>
      )}

      {bottomRow.map((stat) => (
        <div
          key={stat.id}
          className="col-span-2 max-lg:col-span-1 max-sm:col-span-full"
        >
          <SecondaryStatCard stat={stat} />
        </div>
      ))}

      {isError ? (
        <div className="col-span-full flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          <span>Impossible de actualiser le tableau de bord.</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="font-semibold underline"
            disabled={isFetching}
          >
            Réessayer
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div
      data-dashboard-overview
      className="admin-dashboard-overview"
      aria-busy="true"
      aria-label="Chargement du tableau de bord"
    >
      <div className="col-span-full animate-pulse rounded-[var(--admin-card-radius)] bg-white" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`kpi-${index}`}
          className="col-span-2 animate-pulse rounded-[var(--admin-card-radius)] bg-white"
        />
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`r1-${index}`}
          className="col-span-3 animate-pulse rounded-[var(--admin-card-radius)] bg-white first:col-span-4 last:col-span-2"
        />
      ))}
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`r2-${index}`}
          className="col-span-4 animate-pulse rounded-[var(--admin-card-radius)] bg-white"
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`sec-${index}`}
          className="col-span-2 animate-pulse rounded-[var(--admin-card-radius)] bg-white"
        />
      ))}
    </div>
  );
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent initialData={initialData} />
    </Suspense>
  );
}
