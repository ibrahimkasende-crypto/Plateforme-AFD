export type {
  AdminViewer,
  BeneficiaryEvolutionPoint,
  BudgetComparisonPoint,
  DashboardAlert,
  DashboardAlertLevel,
  DashboardBundle,
  DashboardFilters,
  DashboardPeriod,
  DashboardSummary,
  KpiValue,
  MonthlyActivityPoint,
  NamedCount,
  ProvinceBeneficiaries,
  SecondaryStat,
  SidebarBadges,
  TopProject,
} from "@/features/statistiques/types/dashboard";

/** Alias de types alignés sur la spécification dashboard admin. */
export type DashboardKpi = import("@/features/statistiques/types/dashboard").KpiValue;
export type ProjectStatusDatum =
  import("@/features/statistiques/types/dashboard").NamedCount;
export type ProjectSectorDatum =
  import("@/features/statistiques/types/dashboard").NamedCount;
export type ProvinceDashboardDatum =
  import("@/features/statistiques/types/dashboard").ProvinceBeneficiaries;
export type MonthlyActivityDatum =
  import("@/features/statistiques/types/dashboard").MonthlyActivityPoint;
export type BudgetComparisonDatum =
  import("@/features/statistiques/types/dashboard").BudgetComparisonPoint;
export type DashboardSecondaryStat =
  import("@/features/statistiques/types/dashboard").SecondaryStat;
export type AdminDashboardPayload =
  import("@/features/statistiques/types/dashboard").DashboardBundle;
