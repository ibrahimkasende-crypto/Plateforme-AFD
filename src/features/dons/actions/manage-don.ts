"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export async function updateDonStatus(id: string, status: string) {
  await requirePermission("dons:write");
  if (!z.string().uuid().safeParse(id).success || !status.trim()) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("dons").update({ status: status.trim() }).eq("id", id);
  revalidatePath("/admin/dons");
  revalidatePath("/admin/dons/intentions");
  revalidatePath("/admin/dons/transactions");
  revalidatePath("/admin/dons/remboursements");
  revalidatePath("/admin/finances/transactions");
}

export async function confirmDon(id: string) {
  return updateDonStatus(id, "confirmed");
}

export async function refundDon(id: string) {
  await requirePermission("payments:manage");
  return updateDonStatus(id, "refunded");
}
