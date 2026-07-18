"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  description: z.string().min(10),
  gender: z.enum(["homme", "femme"]),
  photo_url: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  active: z.string().optional(),
});

export async function saveMembreEquipe(formData: FormData) {
  await requirePermission("equipe:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const payload = {
    name: parsed.data.name,
    role: parsed.data.role,
    description: parsed.data.description,
    gender: parsed.data.gender,
    photo_url: parsed.data.photo_url || null,
    order: parsed.data.order ?? 0,
    active: parsed.data.active === "on",
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from("membres_equipe").update(payload).eq("id", id);
  } else {
    await supabase.from("membres_equipe").insert(payload);
  }

  revalidatePath("/admin/equipe");
  redirect("/admin/equipe");
}

export async function archiveMembreEquipe(id: string) {
  await requirePermission("equipe:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("membres_equipe")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/equipe");
}

export async function restoreMembreEquipe(id: string) {
  await requirePermission("equipe:write");
  const supabase = await createClientSafe();
  if (!supabase || !z.string().uuid().safeParse(id).success) return;
  await supabase
    .from("membres_equipe")
    .update({ active: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/equipe");
}
