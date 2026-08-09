"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import {
  ACTIVITY_CATEGORIES,
  toMonthStart,
  type ActivityCategory,
} from "@/features/dashboard/types/monthly-data";

export type MonthlyDataActionResult = {
  ok: boolean;
  message: string;
};

function canEditMonthlyData(roles: string[], role: string): boolean {
  const allowed = new Set([
    "super_admin",
    "platform_owner",
    "tenant_super_admin",
    "admin_principal_direction",
    "admin_principal_it",
  ]);
  if (allowed.has(role)) return true;
  return roles.some((r) => allowed.has(r));
}

async function requireEditor() {
  const session = await requireAdmin("/admin/dashboard/donnees-mensuelles");
  if (!canEditMonthlyData(session.roles, session.role)) {
    return {
      ok: false as const,
      message: "Droits insuffisants pour modifier les données mensuelles.",
      session: null,
    };
  }
  const service = createAdminServiceClient();
  if (!service) {
    return {
      ok: false as const,
      message: "Clé service Supabase absente — impossible d’enregistrer.",
      session: null,
    };
  }
  return { ok: true as const, session, service };
}

const beneficiaryRowSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  province: z.string().trim().min(2).max(120),
  femmes: z.coerce.number().int().min(0).max(10_000_000),
  hommes: z.coerce.number().int().min(0).max(10_000_000),
  enfants: z.coerce.number().int().min(0).max(10_000_000),
  jeunes: z.coerce.number().int().min(0).max(10_000_000),
  delete: z.boolean().optional(),
});

const saveBeneficiariesSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
  rows: z.array(beneficiaryRowSchema).max(80),
});

export async function saveMonthlyBeneficiaries(
  input: unknown,
): Promise<MonthlyDataActionResult> {
  const gate = await requireEditor();
  if (!gate.ok || !gate.service) {
    return { ok: false, message: gate.message };
  }

  const parsed = saveBeneficiariesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données bénéficiaires invalides." };
  }

  const mois = toMonthStart(parsed.data.yearMonth);
  const toDelete = parsed.data.rows.filter((r) => r.delete && r.id);
  const toUpsert = parsed.data.rows.filter((r) => !r.delete);

  for (const row of toDelete) {
    const { error } = await gate.service
      .from("dashboard_stats_mensuelles" as never)
      .delete()
      .eq("id" as never, row.id as string);
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  for (const row of toUpsert) {
    const total = row.femmes + row.hommes + row.enfants + row.jeunes;
    if (row.id) {
      const { error } = await gate.service
        .from("dashboard_stats_mensuelles" as never)
        .update({
          province: row.province,
          femmes: row.femmes,
          hommes: row.hommes,
          enfants: row.enfants,
          jeunes: row.jeunes,
          total,
          is_demo: false,
          demo_batch_id: null,
        } as never)
        .eq("id" as never, row.id);
      if (error) return { ok: false, message: error.message };
    } else {
      const { error } = await gate.service
        .from("dashboard_stats_mensuelles" as never)
        .insert({
          mois,
          province: row.province,
          femmes: row.femmes,
          hommes: row.hommes,
          enfants: row.enfants,
          jeunes: row.jeunes,
          total,
          is_demo: false,
          demo_batch_id: null,
        } as never);
      if (error) return { ok: false, message: error.message };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard/donnees-mensuelles");
  return { ok: true, message: "Bénéficiaires enregistrés." };
}

const saveActivitiesSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
  rows: z
    .array(
      z.object({
        id: z.string().uuid().optional().nullable(),
        category: z.enum(ACTIVITY_CATEGORIES),
        value: z.coerce.number().int().min(0).max(1_000_000),
      }),
    )
    .length(ACTIVITY_CATEGORIES.length),
});

export async function saveMonthlyActivities(
  input: unknown,
): Promise<MonthlyDataActionResult> {
  const gate = await requireEditor();
  if (!gate.ok || !gate.service) {
    return { ok: false, message: gate.message };
  }

  const parsed = saveActivitiesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données activités invalides." };
  }

  const mois = toMonthStart(parsed.data.yearMonth);

  for (const row of parsed.data.rows) {
    if (row.id) {
      const { error } = await gate.service
        .from("dashboard_activites_mensuelles" as never)
        .update({
          value: row.value,
          is_demo: false,
          demo_batch_id: null,
        } as never)
        .eq("id" as never, row.id);
      if (error) return { ok: false, message: error.message };
    } else {
      const { error } = await gate.service
        .from("dashboard_activites_mensuelles" as never)
        .insert({
          mois,
          category: row.category as ActivityCategory,
          value: row.value,
          is_demo: false,
          demo_batch_id: null,
        } as never);
      if (error) return { ok: false, message: error.message };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard/donnees-mensuelles");
  return { ok: true, message: "Activités enregistrées." };
}

const saveBudgetSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
  id: z.string().uuid().optional().nullable(),
  prevu: z.coerce.number().min(0).max(1_000_000_000),
  depense: z.coerce.number().min(0).max(1_000_000_000),
  currency: z.enum(["USD", "EUR", "CDF"]),
});

export async function saveMonthlyBudget(
  input: unknown,
): Promise<MonthlyDataActionResult> {
  const gate = await requireEditor();
  if (!gate.ok || !gate.service) {
    return { ok: false, message: gate.message };
  }

  const parsed = saveBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données budget invalides." };
  }

  const mois = toMonthStart(parsed.data.yearMonth);

  if (parsed.data.id) {
    const { error } = await gate.service
      .from("dashboard_budget_mensuel" as never)
      .update({
        prevu: parsed.data.prevu,
        depense: parsed.data.depense,
        currency: parsed.data.currency,
        is_demo: false,
        demo_batch_id: null,
      } as never)
      .eq("id" as never, parsed.data.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await gate.service
      .from("dashboard_budget_mensuel" as never)
      .insert({
        mois,
        prevu: parsed.data.prevu,
        depense: parsed.data.depense,
        currency: parsed.data.currency,
        is_demo: false,
        demo_batch_id: null,
      } as never);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/dashboard/donnees-mensuelles");
  return { ok: true, message: "Budget enregistré." };
}
