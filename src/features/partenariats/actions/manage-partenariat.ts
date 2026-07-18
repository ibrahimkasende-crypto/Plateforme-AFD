"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export async function updatePartenariatStatus(id: string, status: string) {
  await requirePermission("partenaires:write");
  if (!z.string().uuid().safeParse(id).success || !status.trim()) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase
    .from("partenariats_demandes" as never)
    .update({ status: status.trim() } as never)
    .eq("id", id);
  revalidatePath("/admin/partenariats");
}
