"use client";

import Link from "next/link";
import { Suspense } from "react";
import {
  ChartNoAxesCombined,
  DollarSign,
  FileChartColumn,
  Folder,
  Goal,
  HandHeart,
  Handshake,
  HeartHandshake,
  Mail,
  MailCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { AdminFilters } from "@/components/admin/admin-filters";
import { AdminProvincePanel } from "@/components/admin/admin-province-panel";
import { DashboardAlerts } from "@/components/admin/dashboard-alerts";
import { DashboardKpiCard } from "@/components/admin/dashboard-kpi-card";
import { DashboardQuickActions } from "@/components/admin/dashboard-quick-actions";
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
import {
  ADMIN_DEMO_BADGE,
  ADMIN_DEMO_NOTICE,
} from "@/config/demo-data/admin-dashboard";
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
  documents: { icon: Folder, bg: "bg-[var(--admin-purple)]" },
  rapports: { icon: FileChartColumn, bg: "bg-[var(--admin-gold)]" },
};

function SecondaryStatCard({ stat }: { stat: SecondaryStat }) {
  const meta = SECONDARY_ICONS[stat.id] ?? {
    icon: Mail,
    bg: "bg-[var(--admin-blue)]",
  };
  const Icon = meta.icon;

  return (
    <Link
      href={stat.href}
      className="admin-panel flex h-full flex-row items-center gap-3 !p-3 transition hover:border-[var(--admin-primary)]/40"
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white",
          meta.bg,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-medium text-[var(--admin-muted)]">
          {stat.label}
        </span>
        <span className="font-display text-[22px] font-extrabold leading-none text-[var(--admin-text)]">
          {stat.formatted}
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
  const isDemo = bundle.demoMode;

  const kpiEntries = [
    {
      key: "personnesTouchees" as const,
      icon: UsersRound,
      iconBg: "bg-[var(--admin-blue)]",
      href: "/admin/beneficiaires",
    },
    {
      key: "femmesTouchees" as const,
      icon: HeartHandshake,
      iconBg: "bg-[var(--admin-green)]",
      href: "/admin/beneficiaires?genre=femmes",
    },
    {
      key: "projetsActifs" as const,
      icon: Goal,
      iconBg: "bg-[var(--admin-orange)]",
      href: "/admin/projets?statut=actif",
    },
    {
      key: "activitesRealisees" as const,
      icon: ChartNoAxesCombined,
      iconBg: "bg-[var(--admin-purple)]",
      href: "/admin/activites",
    },
    {
      key: "partenairesActifs" as const,
      icon: Handshake,
      iconBg: "bg-[var(--admin-teal)]",
      href: "/admin/partenaires",
    },
    {
      key: "budgetDepense" as const,
      icon: DollarSign,
      iconBg: "bg-[var(--admin-gold)]",
      href: "/admin/finances",
    },
  ];

  return (
    <div
      data-dashboard-overview
      className="admin-dashboard-overview relative max-lg:grid-cols-1 max-lg:auto-rows-auto max-lg:overflow-y-auto max-lg:[grid-template-rows:none]"
    >
      <p className="sr-only">{bundle.accessibleSummary}</p>

      <div className="relative col-span-full">
        {isDemo ? (
          <div className="absolute -top-0.5 right-2 z-10 hidden items-center gap-1.5 text-[10px] text-amber-800 xl:flex">
            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900">
              Mode démonstration
            </span>
            <span className="sr-only">
              {ADMIN_DEMO_BADGE}. {ADMIN_DEMO_NOTICE}
            </span>
          </div>
        ) : null}
        <AdminFilters
          filterOptions={bundle.filterOptions}
          summary={summary}
          compact
          className="h-full"
        />
      </div>

      {kpiEntries.map(({ key, icon, iconBg, href }) => (
        <div key={key} className="col-span-2 max-lg:col-span-1 max-sm:col-span-full">
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
        {bundle.beneficiaryEvolution.length === 0 && !isDemo ? (
          <EmptyState title="Aucune série disponible" />
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
        {bundle.projectsByStatus.length === 0 && !isDemo ? (
          <EmptyState title="Aucune donnée de statut" />
        ) : (
          <ProjectStatusChart data={bundle.projectsByStatus} />
        )}
      </ChartCard>

      <ChartCard
        title="Projets par secteur"
        className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.projectsBySector.length === 0 && !isDemo ? (
          <EmptyState title="Aucune donnée sectorielle" />
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
        title="Bénéficiaires par province"
        className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.beneficiariesByProvince.length === 0 && !isDemo ? (
          <EmptyState title="Aucune donnée provinciale" />
        ) : (
          <AdminProvincePanel data={bundle.beneficiariesByProvince} />
        )}
      </ChartCard>

      <ChartCard
        title="Activités réalisées par mois"
        className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
      >
        {bundle.monthlyActivities.length === 0 && !isDemo ? (
          <EmptyState title="Aucune activité enregistrée" />
        ) : (
          <MonthlyActivitiesChart data={bundle.monthlyActivities} />
        )}
      </ChartCard>

      {viewer.canReadFinances ? (
        <ChartCard
          title="Budget prévu vs dépensé"
          className="col-span-3 max-xl:col-span-6 max-lg:col-span-full"
        >
          {bundle.budgetComparison.length === 0 && !isDemo ? (
            <EmptyState title="Aucune donnée budgétaire" />
          ) : (
            <BudgetComparisonChart data={bundle.budgetComparison} />
          )}
        </ChartCard>
      ) : (
        <div className="admin-panel col-span-3 flex items-center justify-center max-xl:col-span-6 max-lg:col-span-full">
          <p className="text-center text-xs text-[var(--admin-muted)]">
            Données financières réservées aux rôles autorisés.
          </p>
        </div>
      )}

      <div className="col-span-3 flex min-h-0 flex-col gap-[var(--admin-content-gap)] max-xl:col-span-6 max-lg:col-span-full">
        <div className="admin-panel min-h-0 flex-[0.48]">
          <h3 className="admin-panel__title">Alertes</h3>
          <div className="admin-panel__body overflow-y-auto">
            <DashboardAlerts alerts={bundle.alerts} compact />
          </div>
        </div>
        <div className="admin-panel min-h-0 flex-[0.52]">
          <h3 className="admin-panel__title">Accès rapides</h3>
          <div className="admin-panel__body overflow-y-auto">
            <DashboardQuickActions compact />
          </div>
        </div>
      </div>

      {bundle.secondaryStats.map((stat) => (
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
      <div className="col-span-10 animate-pulse rounded-[var(--admin-card-radius)] bg-white" />
      <div className="col-span-2 animate-pulse rounded-[var(--admin-card-radius)] bg-white" />
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
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`r2-${index}`}
          className="col-span-3 animate-pulse rounded-[var(--admin-card-radius)] bg-white"
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
