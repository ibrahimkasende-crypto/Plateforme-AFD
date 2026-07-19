"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";
import {
  canTransitionDepense,
  type DepenseStatut,
} from "@/features/finances/lib/finance-rules";

const budgetSchema = z.object({
  label: z.string().min(2),
  amount_planned: z.coerce.number().min(0),
  currency: z.string().min(3).max(3).optional(),
  period_start: z.string().optional(),
  period_end: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
  notes: z.string().optional(),
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
  justification: z.string().optional(),
  fournisseur: z.string().optional(),
});

function revalidateFinances() {
  revalidatePath("/admin/finances");
  revalidatePath("/admin/finances/budgets");
  revalidatePath("/admin/finances/depenses");
  revalidatePath("/admin/finances/transactions");
}

export async function saveBudget(formData: FormData) {
  await requirePermission("finances:write");
  const parsed = budgetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("finances_budgets" as never)
    .insert({
      label: parsed.data.label,
      amount_planned: parsed.data.amount_planned,
      currency: parsed.data.currency || "USD",
      period_start: parsed.data.period_start || null,
      period_end: parsed.data.period_end || null,
      programme_id: parsed.data.programme_id || null,
      projet_id: parsed.data.projet_id || null,
      notes: parsed.data.notes || null,
      statut: "brouillon",
      version_num: 1,
      is_demo: false,
      demo_batch_id: null,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  await appendAuditLog(supabase, {
    action: "finances.budget.create",
    module: "finances",
    entityType: "finances_budgets",
    entityId: String((data as { id: string }).id),
  });
  revalidateFinances();
  redirect("/admin/finances/budgets");
}

export async function amendBudgetAction(formData: FormData) {
  await requirePermission("finances:write");
  const parsed = z
    .object({
      parent_id: z.string().uuid(),
      amount_planned: z.coerce.number().min(0),
      notes: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data: parent } = await supabase
    .from("finances_budgets" as never)
    .select("*")
    .eq("id", parsed.data.parent_id)
    .maybeSingle();
  if (!parent) return;
  const p = parent as {
    label: string;
    currency: string;
    period_start: string | null;
    period_end: string | null;
    programme_id: string | null;
    projet_id: string | null;
    version_num: number;
  };

  await supabase.from("finances_budgets" as never).insert({
    label: `${p.label} (v${(p.version_num ?? 1) + 1})`,
    amount_planned: parsed.data.amount_planned,
    currency: p.currency,
    period_start: p.period_start,
    period_end: p.period_end,
    programme_id: p.programme_id,
    projet_id: p.projet_id,
    parent_budget_id: parsed.data.parent_id,
    version_num: (p.version_num ?? 1) + 1,
    statut: "amende",
    notes: parsed.data.notes || null,
    is_demo: false,
  } as never);

  await supabase
    .from("finances_budgets" as never)
    .update({ statut: "amende", updated_at: new Date().toISOString() } as never)
    .eq("id", parsed.data.parent_id);

  revalidateFinances();
}

export async function saveDepense(formData: FormData) {
  await requirePermission("finances:write");
  const parsed = depenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("finances_depenses" as never)
    .insert({
      label: parsed.data.label,
      amount: parsed.data.amount,
      currency: parsed.data.currency || "USD",
      spent_at: parsed.data.spent_at || null,
      status: parsed.data.status || "soumise",
      budget_id: parsed.data.budget_id || null,
      programme_id: parsed.data.programme_id || null,
      projet_id: parsed.data.projet_id || null,
      justification: parsed.data.justification || null,
      fournisseur: parsed.data.fournisseur || null,
      is_demo: false,
      demo_batch_id: null,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  await appendAuditLog(supabase, {
    action: "finances.depense.create",
    module: "finances",
    entityType: "finances_depenses",
    entityId: String((data as { id: string }).id),
  });
  revalidateFinances();
  redirect("/admin/finances/depenses");
}

export async function transitionDepenseAction(formData: FormData) {
  const session = await requirePermission("finances:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      status: z.enum([
        "brouillon",
        "soumise",
        "approuvee",
        "rejetee",
        "payee",
        "annulee",
        "enregistree",
      ]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data: current } = await supabase
    .from("finances_depenses" as never)
    .select("id, status")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (!current) return;
  const from = (current as { status: DepenseStatut }).status;
  const to = parsed.data.status as DepenseStatut;
  if (!canTransitionDepense(from, to)) return;

  const patch: Record<string, unknown> = {
    status: to,
    updated_at: new Date().toISOString(),
  };
  if (to === "approuvee") {
    patch.approved_by = session.user.id;
    patch.approved_at = new Date().toISOString();
  }

  await supabase
    .from("finances_depenses" as never)
    .update(patch as never)
    .eq("id", parsed.data.id);

  await appendAuditLog(supabase, {
    action: "finances.depense.statut",
    module: "finances",
    entityType: "finances_depenses",
    entityId: parsed.data.id,
    oldValues: { status: from },
    newValues: { status: to },
  });
  revalidateFinances();
}

export async function createTransactionAction(formData: FormData) {
  const session = await requirePermission("finances:write");
  const parsed = z
    .object({
      libelle: z.string().min(2),
      montant: z.coerce.number().positive(),
      type: z.enum(["debit", "credit"]),
      canal: z.enum(["caisse", "banque", "mobile_money", "autre"]).optional(),
      devise: z.string().optional(),
      depense_id: z.string().uuid().optional().or(z.literal("")),
      reference_externe: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const reference = `TX-${Date.now().toString().slice(-10)}`;
  const { data, error } = await supabase
    .from("finances_transactions" as never)
    .insert({
      reference,
      libelle: parsed.data.libelle,
      montant: parsed.data.montant,
      type: parsed.data.type,
      canal: parsed.data.canal || "banque",
      devise: parsed.data.devise || "USD",
      depense_id: parsed.data.depense_id || null,
      reference_externe: parsed.data.reference_externe || null,
      statut: "enregistree",
      created_by: session.user.id,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  await appendAuditLog(supabase, {
    action: "finances.transaction.create",
    module: "finances",
    entityType: "finances_transactions",
    entityId: String((data as { id: string }).id),
  });
  revalidateFinances();
}

export async function reconcileTransactionAction(formData: FormData) {
  await requirePermission("finances:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("finances_transactions" as never)
    .update({ statut: "rapprochee" } as never)
    .eq("id", id)
    .eq("statut", "enregistree");
  revalidateFinances();
}
