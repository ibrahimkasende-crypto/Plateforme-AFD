"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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
