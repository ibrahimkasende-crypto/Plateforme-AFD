"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Opportunity } from "@/features/opportunites/types";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({ titre: z.string().min(3), slug: z.string().min(3).regex(/^[a-z0-9-]+$/), type: z.string().min(2), description: z.string().min(20), statut: z.enum(["brouillon", "ouverte", "bientot_cloturee", "cloturee", "suspendue", "pourvue"]), publie: z.string().optional(), localisation: z.string().optional() });

export async function saveOpportunity(formData: FormData) {
  await requirePermission("opportunites:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = { ...parsed.data, publie: parsed.data.publie === "on", localisation: parsed.data.localisation || null };
  if (id) await supabase.from("opportunites").update(payload).eq("id", id);
  else await supabase.from("opportunites").insert(payload);
  revalidatePath("/admin/opportunites");
  redirect("/admin/opportunites");
}

async function setOpportunityState(id: string, values: Partial<Opportunity>) {
  await requirePermission("opportunites:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase.from("opportunites").update(values).eq("id", id);
  revalidatePath("/admin/opportunites");
  revalidatePath("/ressources/opportunites");
}

export async function publishOpportunity(id: string) { await setOpportunityState(id, { publie: true, statut: "ouverte", date_publication: new Date().toISOString() }); }
export async function unpublishOpportunity(id: string) { await setOpportunityState(id, { publie: false }); }
export async function suspendOpportunity(id: string) { await setOpportunityState(id, { statut: "suspendue" }); }
export async function closeOpportunity(id: string) { await setOpportunityState(id, { statut: "cloturee" }); }
export async function softDeleteOpportunity(id: string) { await setOpportunityState(id, { deleted_at: new Date().toISOString() }); }
export async function restoreOpportunity(id: string) { await setOpportunityState(id, { deleted_at: null }); }

export async function duplicateOpportunity(id: string) {
  await requirePermission("opportunites:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  const { data } = await supabase.from("opportunites").select("*").eq("id", id).maybeSingle();
  if (!data) return;
  await supabase.from("opportunites").insert({ ...data, id: undefined, titre: `${data.titre} (copie)`, slug: `${data.slug}-copie-${Date.now()}`, statut: "brouillon", publie: false, deleted_at: null, created_at: undefined, updated_at: undefined });
  revalidatePath("/admin/opportunites");
}

export async function exportCsv() {
  await requirePermission("opportunites:read");
  const supabase = await createClientSafe();
  if (!supabase) return "";
  const { data } = await supabase.from("opportunites").select("titre,slug,type,statut,localisation,date_publication,date_limite").is("deleted_at", null).order("updated_at", { ascending: false });
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
  return ["titre,slug,type,statut,localisation,date_publication,date_limite", ...(data ?? []).map((row) => Object.values(row).map(escape).join(","))].join("\n");
}
