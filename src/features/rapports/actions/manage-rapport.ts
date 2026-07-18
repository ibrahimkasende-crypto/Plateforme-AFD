"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  title: z.string().min(3),
  type: z.string().min(2),
  period_start: z.string().optional(),
  period_end: z.string().optional(),
  status: z.string().optional(),
});

export async function saveRapport(formData: FormData) {
  await requirePermission("rapports:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("rapports_generes" as never).insert({
    title: parsed.data.title,
    type: parsed.data.type,
    period_start: parsed.data.period_start || null,
    period_end: parsed.data.period_end || null,
    status: parsed.data.status || "brouillon",
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/rapports/historique");
  revalidatePath("/admin/rapports");
  redirect("/admin/rapports/historique");
}

export async function updateRapportStatus(id: string, status: string) {
  await requirePermission("rapports:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("rapports_generes" as never).update({ status } as never).eq("id", id);
  revalidatePath("/admin/rapports/historique");
}
