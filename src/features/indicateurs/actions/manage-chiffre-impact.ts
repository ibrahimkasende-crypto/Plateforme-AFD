"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  key: z.string().min(2).regex(/^[a-z0-9_]+$/),
  label: z.string().min(2),
  value: z.coerce.number().optional(),
  unit: z.string().optional(),
  suffix: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  order_index: z.coerce.number().int().min(0).optional(),
  reference_period: z.string().optional(),
  validation_source: z.string().optional(),
  active: z.string().optional(),
  validated: z.string().optional(),
});

export async function saveChiffreImpact(formData: FormData) {
  await requirePermission("indicateurs:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const payload = {
    key: parsed.data.key,
    label: parsed.data.label,
    value: parsed.data.value ?? null,
    unit: parsed.data.unit || null,
    suffix: parsed.data.suffix || null,
    description: parsed.data.description || null,
    icon: parsed.data.icon || null,
    order_index: parsed.data.order_index ?? 0,
    reference_period: parsed.data.reference_period || null,
    validation_source: parsed.data.validation_source || null,
    active: parsed.data.active !== "off",
    validated: parsed.data.validated === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("chiffres_impact" as never).update(payload as never).eq("id", id);
  } else {
    await supabase.from("chiffres_impact" as never).insert(payload as never);
  }

  revalidatePath("/admin/indicateurs");
  revalidatePath("/admin/publications/notre-impact");
  redirect("/admin/indicateurs");
}

export async function deactivateChiffreImpact(id: string) {
  await requirePermission("indicateurs:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("chiffres_impact" as never)
    .update({ active: false, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/indicateurs");
}

export async function activateChiffreImpact(id: string) {
  await requirePermission("indicateurs:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("chiffres_impact" as never)
    .update({ active: true, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/indicateurs");
}
