"use client";

import { useDashboardBundle } from "./use-dashboard-bundle";
import { useDashboardFilters } from "./use-dashboard-filters";
import type { DashboardBundle } from "@/features/statistiques/types/dashboard";

export function useProjectStatuses(initialData: DashboardBundle) {
  const { filters } = useDashboardFilters();
  const query = useDashboardBundle(initialData, filters);
  return {
    ...query,
    data: query.data?.projectsByStatus ?? initialData.projectsByStatus,
  };
}
