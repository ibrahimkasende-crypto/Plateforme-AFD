"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardBundleAction } from "@/features/statistiques/actions/get-dashboard-bundle";
import type {
  DashboardBundle,
  DashboardFilters,
} from "@/features/statistiques/types/dashboard";

export function dashboardBundleQueryKey(filters: DashboardFilters) {
  return [
    "dashboard",
    "bundle",
    filters.period,
    filters.programmeId,
    filters.province,
    filters.projectId,
    filters.from,
    filters.to,
  ] as const;
}

export function useDashboardBundle(
  initialData: DashboardBundle,
  filters: DashboardFilters,
) {
  return useQuery({
    queryKey: dashboardBundleQueryKey(filters),
    queryFn: () => getDashboardBundleAction(filters),
    initialData,
    placeholderData: (previous) => previous ?? initialData,
  });
}
