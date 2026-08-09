import "server-only";

import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  ACTIVITY_CATEGORIES,
  toMonthStart,
  type ActivityMonthRow,
  type BeneficiaryMonthRow,
  type BudgetMonthRow,
} from "@/features/dashboard/types/monthly-data";

export type {
  ActivityCategory,
  ActivityMonthRow,
  BeneficiaryMonthRow,
  BudgetMonthRow,
} from "@/features/dashboard/types/monthly-data";
export {
  ACTIVITY_CATEGORIES,
  RDC_PROVINCES,
  currentYearMonth,
  toMonthStart,
} from "@/features/dashboard/types/monthly-data";

async function getReadClient() {
  return (await createClientSafe()) || createAdminServiceClient();
}

export async function listAvailableMonths(): Promise<string[]> {
  const supabase = await getReadClient();
  if (!supabase) return [];

  const months = new Set<string>();
  const tables = [
    "dashboard_stats_mensuelles",
    "dashboard_activites_mensuelles",
    "dashboard_budget_mensuel",
  ] as const;

  for (const table of tables) {
    const { data } = await supabase
      .from(table as never)
      .select("mois" as never)
      .order("mois" as never, { ascending: false })
      .limit(240);
    for (const row of (data || []) as Array<{ mois?: string }>) {
      if (row.mois) months.add(String(row.mois).slice(0, 7));
    }
  }

  return [...months].sort().reverse();
}

export async function loadBeneficiaryRows(
  yearMonth: string,
): Promise<BeneficiaryMonthRow[]> {
  const supabase = await getReadClient();
  if (!supabase) return [];
  const mois = toMonthStart(yearMonth);

  const { data, error } = await supabase
    .from("dashboard_stats_mensuelles" as never)
    .select(
      "id, mois, province, femmes, hommes, enfants, jeunes, total, is_demo" as never,
    )
    .eq("mois" as never, mois)
    .order("province" as never, { ascending: true });

  if (error) throw new Error(error.message);

  return ((data || []) as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    mois: String(row.mois).slice(0, 10),
    province: String(row.province || ""),
    femmes: Number(row.femmes) || 0,
    hommes: Number(row.hommes) || 0,
    enfants: Number(row.enfants) || 0,
    jeunes: Number(row.jeunes) || 0,
    total: Number(row.total) || 0,
    is_demo: Boolean(row.is_demo),
  }));
}

export async function loadActivityRows(
  yearMonth: string,
): Promise<ActivityMonthRow[]> {
  const supabase = await getReadClient();
  if (!supabase) {
    return ACTIVITY_CATEGORIES.map((category) => ({
      id: null,
      mois: toMonthStart(yearMonth),
      category,
      value: 0,
      is_demo: false,
    }));
  }
  const mois = toMonthStart(yearMonth);

  const { data, error } = await supabase
    .from("dashboard_activites_mensuelles" as never)
    .select("id, mois, category, value, is_demo" as never)
    .eq("mois" as never, mois);

  if (error) throw new Error(error.message);

  const byCat = new Map(
    ((data || []) as Array<Record<string, unknown>>).map((row) => [
      String(row.category),
      row,
    ]),
  );

  return ACTIVITY_CATEGORIES.map((category) => {
    const row = byCat.get(category);
    return {
      id: row ? String(row.id) : null,
      mois,
      category,
      value: row ? Number(row.value) || 0 : 0,
      is_demo: row ? Boolean(row.is_demo) : false,
    };
  });
}

export async function loadBudgetRow(
  yearMonth: string,
): Promise<BudgetMonthRow> {
  const mois = toMonthStart(yearMonth);
  const empty: BudgetMonthRow = {
    id: null,
    mois,
    prevu: 0,
    depense: 0,
    currency: "USD",
    is_demo: false,
  };

  const supabase = await getReadClient();
  if (!supabase) return empty;

  const { data, error } = await supabase
    .from("dashboard_budget_mensuel" as never)
    .select("id, mois, prevu, depense, currency, is_demo" as never)
    .eq("mois" as never, mois)
    .order("created_at" as never, { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  const row = ((data || []) as Array<Record<string, unknown>>)[0];
  if (!row) return empty;

  return {
    id: String(row.id),
    mois,
    prevu: Number(row.prevu) || 0,
    depense: Number(row.depense) || 0,
    currency: String(row.currency || "USD"),
    is_demo: Boolean(row.is_demo),
  };
}
