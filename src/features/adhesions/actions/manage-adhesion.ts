"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const statusSchema = z.enum(["pending", "approved", "rejected"]);

export async function updateAdhesionStatus(id: string, status: string) {
  await requirePermission("adhesions:write");
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success || !z.string().uuid().safeParse(id).success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("membres").update({ status: parsed.data }).eq("id", id);
  revalidatePath("/admin/adhesions");
}

export async function approveAdhesion(id: string) {
  return updateAdhesionStatus(id, "approved");
}

export async function rejectAdhesion(id: string) {
  return updateAdhesionStatus(id, "rejected");
}
