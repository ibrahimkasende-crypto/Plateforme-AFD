"use client";

import { useQuery } from "@tanstack/react-query";
import type { AnalyticsContext, AnalyticsPageData } from "@/features/admin-analytics/types/admin-analytics";

async function fetchAnalyticsJson(
  path: string,
  context: AnalyticsContext,
): Promise<AnalyticsPageData> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(context)) {
    if (value) params.set(key, String(value));
  }
  const res = await fetch(`${path}?${params.toString()}`, {
    credentials: "same-origin",
  });
  if (!res.ok) {
    throw new Error("Impossible de charger l’analyse");
  }
  return (await res.json()) as AnalyticsPageData;
}

export function useAdminAnalytics(
  endpoint: string,
  context: AnalyticsContext,
  initialData?: AnalyticsPageData,
) {
  return useQuery({
    queryKey: ["admin-analytics", endpoint, context],
    queryFn: () => fetchAnalyticsJson(endpoint, context),
    initialData,
    staleTime: 30_000,
  });
}
