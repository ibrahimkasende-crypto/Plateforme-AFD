"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const statusSchema = z.enum(["unread", "read", "pending", "nouveau"]);

export async function updateMessageStatus(id: string, status: string) {
  await requirePermission("messages:write");
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success || !z.string().uuid().safeParse(id).success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("messages").update({ status: parsed.data }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}

export async function markMessageRead(id: string) {
  return updateMessageStatus(id, "read");
}

export async function markMessagePending(id: string) {
  return updateMessageStatus(id, "pending");
}
