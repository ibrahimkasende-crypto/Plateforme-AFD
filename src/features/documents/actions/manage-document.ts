"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({ titre: z.string().min(3), slug: z.string().min(3).regex(/^[a-z0-9-]+$/), type: z.string().min(2), description: z.string().optional(), fichier_storage_path: z.string().min(1), nom_fichier: z.string().optional(), niveau_confidentialite: z.enum(["public", "interne", "restreint"]), publie: z.string().optional() });

export async function saveDocument(formData: FormData) {
  await requirePermission("documents:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = { ...parsed.data, description: parsed.data.description || null, nom_fichier: parsed.data.nom_fichier || null, publie: parsed.data.publie === "on", date_publication: parsed.data.publie === "on" ? new Date().toISOString() : null };
  if (id) await supabase.from("documents").update(payload).eq("id", id);
  else await supabase.from("documents").insert(payload);
  revalidatePath("/admin/documents");
  redirect("/admin/documents");
}
