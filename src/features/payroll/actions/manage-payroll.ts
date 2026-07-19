"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  advancePayrollStatus,
  calculatePeriodRun,
  createPayrollPeriod,
} from "@/features/payroll/services/payroll-run.service";

export async function createPayrollPeriodAction(
  formData: FormData,
): Promise<void> {
  const session = await requirePermission("payroll.calculate");
  const schema = z.object({
    label: z.string().min(2),
    date_debut: z.string(),
    date_fin: z.string(),
    currency: z.string().optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = await createPayrollPeriod(supabase, {
    label: parsed.data.label,
    dateDebut: parsed.data.date_debut,
    dateFin: parsed.data.date_fin,
    currency: parsed.data.currency,
    userId: session.user.id,
  });

  revalidatePath("/admin/rh/paie");
  redirect(`/admin/rh/paie/periodes/${id}`);
}

export async function calculatePayrollAction(formData: FormData): Promise<void> {
  await requirePermission("payroll.calculate");
  const periodId = String(formData.get("periodId") || "");
  if (!z.string().uuid().safeParse(periodId).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await calculatePeriodRun(supabase, periodId, { allowUnverifiedRules: true });
  revalidatePath(`/admin/rh/paie/periodes/${periodId}`);
  revalidatePath("/admin/rh/paie/bulletins");
}

export async function approvePayrollAction(formData: FormData): Promise<void> {
  const session = await requirePermission("payroll.approve");
  const periodId = String(formData.get("periodId") || "");
  if (!z.string().uuid().safeParse(periodId).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await advancePayrollStatus(supabase, periodId, "approved", session.user.id);
  revalidatePath(`/admin/rh/paie/periodes/${periodId}`);
}

export async function closePayrollAction(formData: FormData): Promise<void> {
  const session = await requirePermission("payroll.close");
  const periodId = String(formData.get("periodId") || "");
  if (!z.string().uuid().safeParse(periodId).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await advancePayrollStatus(supabase, periodId, "closed", session.user.id);
  revalidatePath(`/admin/rh/paie/periodes/${periodId}`);
}
