import type { Role } from "@/config/roles";

export type DashboardPeriod =
  | "7d"
  | "30d"
  | "quarter"
  | "year"
  | "custom";

export type DashboardFilters = {
  period: DashboardPeriod;
  programmeId: string | null;
  province: string | null;
  projectId: string | null;
  from?: string | null;
  to?: string | null;
};

export type KpiValue = {
  label: string;
  value: number | null;
  formatted: string;
  variationPct: number | null;
  available: boolean;
  tooltip?: string;
};

export type DashboardSummary = {
  demoMode: boolean;
  kpis: {
    personnesTouchees: KpiValue;
    femmesTouchees: KpiValue;
    projetsActifs: KpiValue;
    activitesRealisees: KpiValue;
    partenairesActifs: KpiValue;
    budgetDepense: KpiValue;
  };
};

export type BeneficiaryEvolutionPoint = {
  label: string;
  femmes: number;
  hommes: number;
  enfants: number;
  jeunes: number;
};

export type NamedCount = {
  name: string;
  value: number;
  percent?: number;
  color?: string;
};

export type TopProject = {
  id: string;
  title: string;
  location: string | null;
  beneficiaries: number | null;
  imageUrl: string | null;
};

export type ProvinceBeneficiaries = {
  name: string;
  value: number;
};

export type ProvinceProjectsDatum = {
  name: string;
  value: number;
  percent?: number;
  activities?: number;
  beneficiaries?: number;
  slug?: string;
};

export type MonthlyActivityPoint = {
  label: string;
  formations: number;
  sensibilisations: number;
  distributions: number;
  reunions: number;
  missions: number;
  autres: number;
};

export type BudgetComparisonPoint = {
  label: string;
  planned: number;
  actual: number;
  currency: string;
};

export type DashboardAlertLevel = "info" | "warning" | "critical";

export type DashboardAlert = {
  id: string;
  message: string;
  level: DashboardAlertLevel;
  href: string;
  dateLabel: string;
};

export type SecondaryStat = {
  id: string;
  label: string;
  value: number | null;
  formatted: string;
  href: string;
  variationPct?: number | null;
  available: boolean;
};

export type SidebarBadges = {
  newsletter: number | null;
  messages: number | null;
  adhesions: number | null;
  notifications: number | null;
};

export type AdminViewer = {
  displayName: string;
  roleLabel: string;
  role: Role;
  initials: string;
  canReadFinances: boolean;
};

export type DashboardBundle = {
  demoMode: boolean;
  summary: DashboardSummary;
  beneficiaryEvolution: BeneficiaryEvolutionPoint[];
  projectsByStatus: NamedCount[];
  projectsBySector: NamedCount[];
  projectsByProvince: ProvinceProjectsDatum[];
  topProjects: TopProject[];
  beneficiariesByProvince: ProvinceBeneficiaries[];
  presentationMode?: boolean;
  monthlyActivities: MonthlyActivityPoint[];
  budgetComparison: BudgetComparisonPoint[];
  alerts: DashboardAlert[];
  secondaryStats: SecondaryStat[];
  filterOptions: {
    programmes: { id: string; title: string }[];
    provinces: string[];
    projects: { id: string; title: string }[];
  };
  badges: SidebarBadges;
  viewer: AdminViewer;
  accessibleSummary: string;
};
