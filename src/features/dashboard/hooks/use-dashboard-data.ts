"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardBundleAction } from "@/features/statistiques/actions/get-dashboard-bundle";
import type {
  DashboardBundle,
  DashboardFilters,
} from "@/features/statistiques/types/dashboard";

export function adminDashboardQueryKey(filters: DashboardFilters) {
  const { dateStart, dateEnd } = {
    dateStart: filters.from ?? filters.period,
    dateEnd: filters.to ?? filters.period,
  };

  return [
    "admin-dashboard",
    dateStart,
    dateEnd,
    filters.programmeId,
    filters.province,
    filters.projectId,
    filters.period,
  ] as const;
}

export function useDashboardData(
  initialData: DashboardBundle,
  filters: DashboardFilters,
) {
  return useQuery({
    queryKey: adminDashboardQueryKey(filters),
    queryFn: () => getDashboardBundleAction(filters),
    initialData,
    staleTime: 30_000,
    placeholderData: (previous) => previous ?? initialData,
  });
}
