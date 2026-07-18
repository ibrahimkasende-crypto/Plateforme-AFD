import { createClientSafe } from "@/lib/supabase/safe";

export type FinanceBudget = {
  id: string;
  label: string;
  programme_id: string | null;
  projet_id: string | null;
  period_start: string | null;
  period_end: string | null;
  amount_planned: number;
  currency: string;
  created_at: string;
};

export type FinanceDepense = {
  id: string;
  label: string;
  budget_id: string | null;
  programme_id: string | null;
  projet_id: string | null;
  amount: number;
  spent_at: string | null;
  status: string;
  currency: string;
  created_at: string;
};

export async function getAdminBudgets(): Promise<FinanceBudget[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("finances_budgets" as never)
      .select("*")
      .order("period_start", { ascending: false });
    return error || !data ? [] : (data as FinanceBudget[]);
  } catch {
    return [];
  }
}

export async function getAdminDepenses(): Promise<FinanceDepense[]> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("finances_depenses" as never)
      .select("*")
      .order("spent_at", { ascending: false });
    return error || !data ? [] : (data as FinanceDepense[]);
  } catch {
    return [];
  }
}

export async function getFinancesSummary(): Promise<{
  totalBudget: number;
  totalDepenses: number;
  budgetCount: number;
  depenseCount: number;
}> {
  const [budgets, depenses] = await Promise.all([getAdminBudgets(), getAdminDepenses()]);
  return {
    totalBudget: budgets.reduce((s, b) => s + Number(b.amount_planned), 0),
    totalDepenses: depenses.reduce((s, d) => s + Number(d.amount), 0),
    budgetCount: budgets.length,
    depenseCount: depenses.length,
  };
}
