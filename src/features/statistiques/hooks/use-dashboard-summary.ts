"use client";

import { useDashboardBundle } from "@/features/statistiques/hooks/use-dashboard-bundle";
import type {
  DashboardBundle,
  DashboardFilters,
  DashboardSummary,
} from "@/features/statistiques/types/dashboard";

export function useDashboardSummary(
  initialData: DashboardBundle,
  filters: DashboardFilters,
): DashboardSummary {
  const { data } = useDashboardBundle(initialData, filters);
  return data?.summary ?? initialData.summary;
}
