import {
  Activity,
  FileText,
  FolderKanban,
  HeartHandshake,
  Mail,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import { ChartCard } from "@/components/charts/ChartCard";
import {
  BeneficiaryEvolutionChart,
  BudgetComparisonChart,
  DonationsEvolutionChart,
  IndicatorProgressChart,
  MonthlyActivitiesChart,
  NewsletterGrowthChart,
  ProjectSectorChart,
  ProjectStatusChart,
  BeneficiariesByProvinceChart,
} from "@/components/charts";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatCard } from "@/components/shared/StatCard";
import { DEMO_DATA_NOTICE } from "@/config/demo-data";

const emptySeries: { label: string; value: number }[] = [];
const emptyNamed: { name: string; value: number }[] = [];
const emptyComparison: { label: string; planned: number; actual: number }[] = [];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        title="Tableau de bord"
        description="Architecture préparée pour les KPI et graphiques. Aucune donnée fictive n’est affichée comme réelle."
      />

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {DEMO_DATA_NOTICE} Les cartes ci-dessous affichent volontairement « — »
        jusqu’à connexion des sources Supabase.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Personnes touchées" value="—" icon={Users} />
        <StatCard label="Femmes touchées" value="—" icon={UsersRound} />
        <StatCard label="Projets actifs" value="—" icon={FolderKanban} />
        <StatCard label="Activités réalisées" value="—" icon={Activity} />
        <StatCard label="Partenaires actifs" value="—" icon={HeartHandshake} />
        <StatCard label="Budget dépensé" value="—" icon={Wallet} />
        <StatCard label="Abonnés newsletter" value="—" icon={Mail} />
        <StatCard label="Rapports générés" value="—" icon={FileText} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Évolution des bénéficiaires"
          description="En attente de données réelles."
        >
          {emptySeries.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <BeneficiaryEvolutionChart data={emptySeries} />
          )}
        </ChartCard>
        <ChartCard title="Projets par statut">
          {emptyNamed.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <ProjectStatusChart data={emptyNamed} />
          )}
        </ChartCard>
        <ChartCard title="Projets par secteur">
          {emptyNamed.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <ProjectSectorChart data={emptyNamed} />
          )}
        </ChartCard>
        <ChartCard title="Bénéficiaires par province">
          {emptyNamed.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <BeneficiariesByProvinceChart data={emptyNamed} />
          )}
        </ChartCard>
        <ChartCard title="Activités réalisées par mois">
          {emptySeries.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <MonthlyActivitiesChart data={emptySeries} />
          )}
        </ChartCard>
        <ChartCard title="Budget prévu contre budget dépensé">
          {emptyComparison.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <BudgetComparisonChart data={emptyComparison} />
          )}
        </ChartCard>
        <ChartCard title="Croissance de la newsletter">
          {emptySeries.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <NewsletterGrowthChart data={emptySeries} />
          )}
        </ChartCard>
        <ChartCard title="Dons par période">
          {emptySeries.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <DonationsEvolutionChart data={emptySeries} />
          )}
        </ChartCard>
        <ChartCard title="Indicateurs prévus contre réalisés">
          {emptyComparison.length === 0 ? (
            <EmptyState title="Aucune série disponible" />
          ) : (
            <IndicatorProgressChart data={emptyComparison} />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
