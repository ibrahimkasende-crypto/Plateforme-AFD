"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  periode: z.string().min(4),
  province: z.string().optional(),
  programme_id: z.string().optional(),
  projet_id: z.string().optional(),
  femmes: z.coerce.number().int().min(0).optional(),
  hommes: z.coerce.number().int().min(0).optional(),
  enfants: z.coerce.number().int().min(0).optional(),
  jeunes: z.coerce.number().int().min(0).optional(),
});

export async function saveBeneficiaireAgregat(formData: FormData) {
  await requirePermission("beneficiaires:write");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = await createClientSafe();
  if (!supabase) return;

  const femmes = parsed.data.femmes ?? 0;
  const hommes = parsed.data.hommes ?? 0;
  const enfants = parsed.data.enfants ?? 0;
  const jeunes = parsed.data.jeunes ?? 0;

  await supabase.from("beneficiaires_agregats" as never).insert({
    periode: parsed.data.periode,
    province: parsed.data.province || null,
    programme_id: parsed.data.programme_id || null,
    projet_id: parsed.data.projet_id || null,
    femmes,
    hommes,
    enfants,
    jeunes,
    total: femmes + hommes + enfants + jeunes,
    is_demo: false,
    demo_batch_id: null,
  } as never);

  revalidatePath("/admin/beneficiaires");
  redirect("/admin/beneficiaires");
}
