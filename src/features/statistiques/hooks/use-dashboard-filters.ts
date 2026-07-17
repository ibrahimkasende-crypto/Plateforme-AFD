"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  DashboardFilters,
  DashboardPeriod,
} from "@/features/statistiques/types/dashboard";

const VALID_PERIODS: DashboardPeriod[] = [
  "7d",
  "30d",
  "quarter",
  "year",
  "custom",
];

function parsePeriod(value: string | null): DashboardPeriod {
  if (value && VALID_PERIODS.includes(value as DashboardPeriod)) {
    return value as DashboardPeriod;
  }
  return "year";
}

export function useDashboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DashboardFilters>(
    () => ({
      period: parsePeriod(searchParams.get("period")),
      programmeId: searchParams.get("programme"),
      province: searchParams.get("province"),
      projectId: searchParams.get("project"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    }),
    [searchParams],
  );

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setPeriod = useCallback(
    (period: DashboardPeriod) => updateParams({ period }),
    [updateParams],
  );

  const setProgramme = useCallback(
    (programmeId: string | null) => updateParams({ programme: programmeId }),
    [updateParams],
  );

  const setProvince = useCallback(
    (province: string | null) => updateParams({ province }),
    [updateParams],
  );

  const setProject = useCallback(
    (projectId: string | null) => updateParams({ project: projectId }),
    [updateParams],
  );

  return {
    filters,
    setPeriod,
    setProgramme,
    setProvince,
    setProject,
    updateParams,
  };
}
