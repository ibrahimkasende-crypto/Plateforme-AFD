"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export async function saveTemoignageConsentementAction(formData: FormData) {
  await requirePermission("temoignages:write");
  const parsed = z
    .object({
      titre: z.string().min(2),
      province: z.string().optional(),
      consentement_accorde: z.string().optional(),
      anonymise: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("temoignage_consentements" as never).insert({
    titre: parsed.data.titre,
    province: parsed.data.province || null,
    consentement_accorde: parsed.data.consentement_accorde === "on",
    anonymise: parsed.data.anonymise === "on",
  } as never);
  revalidatePath("/admin/temoignages");
}

export async function withdrawTemoignageConsentementAction(formData: FormData) {
  await requirePermission("temoignages:write");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("temoignage_consentements" as never)
    .update({
      consentement_accorde: false,
      retire_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", id);
  revalidatePath("/admin/temoignages");
}
