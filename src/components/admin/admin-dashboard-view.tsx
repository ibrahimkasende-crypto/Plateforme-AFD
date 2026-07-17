"use client";

import { Suspense } from "react";
import {
  FolderKanban,
  Handshake,
  ListChecks,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import { AdminFilters } from "@/components/admin/admin-filters";
import { DashboardAlerts } from "@/components/admin/dashboard-alerts";
import { DashboardBottomStats } from "@/components/admin/dashboard-bottom-stats";
import { DashboardKpiCard } from "@/components/admin/dashboard-kpi-card";
import { DashboardQuickActions } from "@/components/admin/dashboard-quick-actions";
import { DashboardSection } from "@/components/admin/dashboard-section";
import { DashboardTopProjects } from "@/components/admin/dashboard-top-projects";
import { ChartCard } from "@/components/charts/ChartCard";
import {
  BeneficiariesByProvinceChart,
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
import type { DashboardBundle } from "@/features/statistiques/types/dashboard";

type AdminDashboardViewProps = {
  initialData: DashboardBundle;
};

function DashboardContent({ initialData }: AdminDashboardViewProps) {
  const { filters } = useDashboardFilters();
  const { data } = useDashboardBundle(initialData, filters);
  const bundle = data ?? initialData;
  const { summary, viewer } = bundle;
  const isDemo = bundle.demoMode;

  const kpiEntries = [
    { key: "personnesTouchees" as const, icon: Users, iconClassName: "bg-[#0877d1]/10 text-[#0877d1]" },
    { key: "femmesTouchees" as const, icon: UsersRound, iconClassName: "bg-[#7c3aed]/10 text-[#7c3aed]" },
    { key: "projetsActifs" as const, icon: FolderKanban, iconClassName: "bg-[#2563eb]/10 text-[#2563eb]" },
    { key: "activitesRealisees" as const, icon: ListChecks, iconClassName: "bg-[#16a34a]/10 text-[#16a34a]" },
    { key: "partenairesActifs" as const, icon: Handshake, iconClassName: "bg-[#f97316]/10 text-[#f97316]" },
    { key: "budgetDepense" as const, icon: Wallet, iconClassName: "bg-[#0d254e]/10 text-[#0d254e]" },
  ];

  return (
    <div className="space-y-6">
      {isDemo ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900">{ADMIN_DEMO_BADGE}</p>
            <p className="text-sm text-amber-800">{ADMIN_DEMO_NOTICE}</p>
          </div>
        </div>
      ) : null}

      <p className="sr-only">{bundle.accessibleSummary}</p>

      <AdminFilters filterOptions={bundle.filterOptions} summary={summary} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpiEntries.map(({ key, icon, iconClassName }) => (
          <DashboardKpiCard
            key={key}
            kpi={summary.kpis[key]}
            icon={icon}
            iconClassName={iconClassName}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Évolution des bénéficiaires"
          description="Ventilation femmes, hommes, enfants et jeunes."
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
        <ChartCard title="Projets par statut">
          {bundle.projectsByStatus.length === 0 && !isDemo ? (
            <EmptyState title="Aucune donnée de statut" />
          ) : (
            <ProjectStatusChart data={bundle.projectsByStatus} />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Projets par secteur">
          {bundle.projectsBySector.length === 0 && !isDemo ? (
            <EmptyState title="Aucune donnée sectorielle" />
          ) : (
            <ProjectSectorChart data={bundle.projectsBySector} />
          )}
        </ChartCard>
        <DashboardSection title="Top 5 projets" description="Classés par nombre de bénéficiaires.">
          <DashboardTopProjects projects={bundle.topProjects} />
        </DashboardSection>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <ChartCard
          title="Bénéficiaires par province"
          description="Carte RDC en cours d’intégration — barres par province en attendant."
          className="2xl:col-span-1"
        >
          {bundle.beneficiariesByProvince.length === 0 && !isDemo ? (
            <EmptyState title="Aucune donnée provinciale" />
          ) : (
            <BeneficiariesByProvinceChart data={bundle.beneficiariesByProvince} />
          )}
        </ChartCard>
        <ChartCard title="Activités réalisées par mois" className="2xl:col-span-1">
          {bundle.monthlyActivities.length === 0 && !isDemo ? (
            <EmptyState title="Aucune activité enregistrée" />
          ) : (
            <MonthlyActivitiesChart data={bundle.monthlyActivities} />
          )}
        </ChartCard>
        {viewer.canReadFinances ? (
          <ChartCard title="Budget prévu vs dépensé" className="2xl:col-span-1">
            {bundle.budgetComparison.length === 0 && !isDemo ? (
              <EmptyState title="Aucune donnée budgétaire" />
            ) : (
              <BudgetComparisonChart data={bundle.budgetComparison} />
            )}
          </ChartCard>
        ) : null}
        <DashboardSection
          title="Alertes"
          description="Points d’attention nécessitant une action."
          className={viewer.canReadFinances ? "2xl:col-span-1" : "2xl:col-span-2"}
        >
          <DashboardAlerts alerts={bundle.alerts} />
        </DashboardSection>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardSection
          title="Statistiques complémentaires"
          className="xl:col-span-2"
        >
          <DashboardBottomStats stats={bundle.secondaryStats} />
        </DashboardSection>
        <DashboardSection title="Actions rapides">
          <DashboardQuickActions />
        </DashboardSection>
      </div>

      <p className="text-xs text-slate-500">{bundle.accessibleSummary}</p>
    </div>
  );
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent initialData={initialData} />
    </Suspense>
  );
}
