"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  full_name: z.string().min(2),
  matricule: z.string().optional(),
  fonction: z.string().optional(),
  telephone: z.string().optional(),
  province: z.string().optional(),
  territoire: z.string().optional(),
  disponibilite: z.string().optional(),
  date_affectation: z.string().optional(),
  actif: z.string().optional(),
});

export async function saveAgent(formData: FormData) {
  await requirePermission("agents:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const payload = {
    full_name: parsed.data.full_name,
    matricule: parsed.data.matricule || null,
    fonction: parsed.data.fonction || null,
    telephone: parsed.data.telephone || null,
    province: parsed.data.province || null,
    territoire: parsed.data.territoire || null,
    disponibilite: parsed.data.disponibilite || null,
    date_affectation: parsed.data.date_affectation || null,
    actif: parsed.data.actif === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) await supabase.from("agents_terrain").update(payload).eq("id", id);
  else await supabase.from("agents_terrain").insert(payload);

  revalidatePath("/admin/agents");
  redirect("/admin/agents");
}

export async function softDeleteAgent(formData: FormData) {
  await requirePermission("agents:write");
  const id = String(formData.get("id") || "");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("agents_terrain")
    .update({
      deleted_at: new Date().toISOString(),
      actif: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/agents");
}
