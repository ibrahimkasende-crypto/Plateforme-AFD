"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getDashboardBundle } from "@/services/dashboard.service";
import type { DashboardFilters } from "@/features/statistiques/types/dashboard";

export async function getDashboardBundleAction(filters: DashboardFilters) {
  await requireAdmin();
  return getDashboardBundle(filters);
}
