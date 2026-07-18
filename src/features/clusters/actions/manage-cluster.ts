"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const clusterSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  active: z.string().optional(),
});

export async function saveCluster(formData: FormData) {
  await requirePermission("clusters:write");
  const parsed = clusterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;
  const id = String(formData.get("id") || "");

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    type: parsed.data.type || null,
    icon: parsed.data.icon || null,
    order: parsed.data.order ?? 0,
    active: parsed.data.active === "on",
    is_demo: false,
    demo_batch_id: null,
  };

  if (id && z.string().uuid().safeParse(id).success) {
    await supabase.from("clusters" as never).update(payload as never).eq("id", id);
  } else {
    await supabase.from("clusters" as never).insert(payload as never);
  }

  revalidatePath("/admin/clusters");
  redirect("/admin/clusters");
}

export async function toggleClusterActive(id: string, active: boolean) {
  await requirePermission("clusters:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("clusters" as never).update({ active } as never).eq("id", id);
  revalidatePath("/admin/clusters");
}
