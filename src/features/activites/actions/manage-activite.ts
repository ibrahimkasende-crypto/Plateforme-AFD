"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  title: z.string().min(3),
  type: z.string().min(2),
  description: z.string().optional(),
  activity_date: z.string().optional(),
  province: z.string().optional(),
  location: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
  femmes: z.coerce.number().int().min(0).optional(),
  hommes: z.coerce.number().int().min(0).optional(),
  enfants: z.coerce.number().int().min(0).optional(),
  jeunes: z.coerce.number().int().min(0).optional(),
  status: z.string().optional(),
});

export async function saveActivite(formData: FormData) {
  await requirePermission("activites:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const femmes = parsed.data.femmes ?? 0;
  const hommes = parsed.data.hommes ?? 0;
  const enfants = parsed.data.enfants ?? 0;
  const jeunes = parsed.data.jeunes ?? 0;
  const total = femmes + hommes + enfants + jeunes;

  const payload = {
    title: parsed.data.title,
    type: parsed.data.type,
    description: parsed.data.description || null,
    activity_date: parsed.data.activity_date || null,
    province: parsed.data.province || null,
    location: parsed.data.location || null,
    programme_id: parsed.data.programme_id || null,
    projet_id: parsed.data.projet_id || null,
    femmes,
    hommes,
    enfants,
    jeunes,
    total,
    status: parsed.data.status || "planifiee",
    active: true,
    updated_at: new Date().toISOString(),
    is_demo: false,
    demo_batch_id: null,
  };

  await supabase.from("activites" as never).insert(payload as never);
  revalidatePath("/admin/activites");
  redirect("/admin/activites");
}

export async function updateActiviteStatus(id: string, status: string) {
  await requirePermission("activites:write");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("activites" as never)
    .update({ status, updated_at: new Date().toISOString() } as never)
    .eq("id", id);
  revalidatePath("/admin/activites");
}
