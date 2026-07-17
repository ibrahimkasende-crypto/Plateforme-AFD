"use server";

import { getDashboardBundle } from "@/services/dashboard.service";
import type { DashboardFilters } from "@/features/statistiques/types/dashboard";

export async function getDashboardBundleAction(filters: DashboardFilters) {
  return getDashboardBundle(filters);
}
