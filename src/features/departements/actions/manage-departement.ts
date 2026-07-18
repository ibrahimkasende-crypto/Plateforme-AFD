"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  active: z.string().optional(),
});

export async function saveDepartement(formData: FormData) {
  await requirePermission("equipe:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  await supabase.from("departements" as never).insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    active: parsed.data.active !== "off",
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/departements");
  redirect("/admin/departements");
}

export async function toggleDepartementActive(id: string, active: boolean) {
  await requirePermission("equipe:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase.from("departements" as never).update({ active } as never).eq("id", id);
  revalidatePath("/admin/departements");
}
