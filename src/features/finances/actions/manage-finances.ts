"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const budgetSchema = z.object({
  label: z.string().min(2),
  amount_planned: z.coerce.number().min(0),
  currency: z.string().min(3).max(3).optional(),
  period_start: z.string().optional(),
  period_end: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
});

const depenseSchema = z.object({
  label: z.string().min(2),
  amount: z.coerce.number().min(0),
  currency: z.string().min(3).max(3).optional(),
  spent_at: z.string().optional(),
  status: z.string().optional(),
  budget_id: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
});

export async function saveBudget(formData: FormData) {
  await requirePermission("finances:write");
  const parsed = budgetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("finances_budgets" as never).insert({
    label: parsed.data.label,
    amount_planned: parsed.data.amount_planned,
    currency: parsed.data.currency || "USD",
    period_start: parsed.data.period_start || null,
    period_end: parsed.data.period_end || null,
    programme_id: parsed.data.programme_id || null,
    projet_id: parsed.data.projet_id || null,
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/finances");
  revalidatePath("/admin/finances/budgets");
  redirect("/admin/finances/budgets");
}

export async function saveDepense(formData: FormData) {
  await requirePermission("finances:write");
  const parsed = depenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("finances_depenses" as never).insert({
    label: parsed.data.label,
    amount: parsed.data.amount,
    currency: parsed.data.currency || "USD",
    spent_at: parsed.data.spent_at || null,
    status: parsed.data.status || "enregistree",
    budget_id: parsed.data.budget_id || null,
    programme_id: parsed.data.programme_id || null,
    projet_id: parsed.data.projet_id || null,
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/finances");
  revalidatePath("/admin/finances/depenses");
  redirect("/admin/finances/depenses");
}
