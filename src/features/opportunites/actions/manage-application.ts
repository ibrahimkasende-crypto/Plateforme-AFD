"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const updateSchema = z.object({
  id: z.string().uuid(),
  statut: z.string().trim().min(1).max(80),
  note_interne: z.string().trim().max(6000).optional(),
});

export async function updateApplicationStatus(formData: FormData) {
  await requirePermission("candidatures:write");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  const { error } = await supabase.from("candidatures").update({
    statut: parsed.data.statut,
    note_interne: parsed.data.note_interne || null,
  }).eq("id", parsed.data.id);
  if (!error) revalidatePath("/admin/candidatures");
}

export async function getSignedApplicationFileUrl(path: string) {
  await requirePermission("candidatures:read");
  const supabase = await createClientSafe();
  if (!supabase || !path.startsWith("candidatures/")) return null;
  const { data, error } = await supabase.storage.from("candidatures-privees").createSignedUrl(path, 60);
  return error ? null : data.signedUrl;
}
