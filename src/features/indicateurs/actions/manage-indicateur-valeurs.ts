"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { appendAuditLog } from "@/features/identity/services/audit.service";

export async function saveIndicateurValeurAction(formData: FormData) {
  const session = await requirePermission("indicateurs:write");
  const parsed = z
    .object({
      chiffre_impact_id: z.string().uuid().optional().or(z.literal("")),
      projet_id: z.string().uuid().optional().or(z.literal("")),
      periode: z.string().min(4),
      valeur: z.coerce.number(),
      baseline: z.coerce.number().optional(),
      cible: z.coerce.number().optional(),
      source: z.string().optional(),
      methode: z.string().optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("indicateur_valeurs" as never)
    .insert({
      chiffre_impact_id: parsed.data.chiffre_impact_id || null,
      projet_id: parsed.data.projet_id || null,
      periode: parsed.data.periode,
      valeur: parsed.data.valeur,
      baseline: parsed.data.baseline ?? null,
      cible: parsed.data.cible ?? null,
      source: parsed.data.source || null,
      methode: parsed.data.methode || null,
      statut: "soumis",
      created_by: session.user.id,
    } as never)
    .select("id")
    .single();
  if (error || !data) return;
  await appendAuditLog(supabase, {
    action: "indicateurs.valeur.create",
    module: "indicateurs",
    entityType: "indicateur_valeurs",
    entityId: String((data as { id: string }).id),
  });
  revalidatePath("/admin/indicateurs");
}

export async function validateIndicateurValeurAction(formData: FormData) {
  await requirePermission("indicateurs:write");
  const parsed = z
    .object({
      id: z.string().uuid(),
      statut: z.enum(["valide", "rejete"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await supabase
    .from("indicateur_valeurs" as never)
    .update({ statut: parsed.data.statut } as never)
    .eq("id", parsed.data.id);
  revalidatePath("/admin/indicateurs");
}
