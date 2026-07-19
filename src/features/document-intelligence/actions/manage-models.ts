"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const schema = z.object({
  code: z.string().min(2).max(80),
  nom: z.string().min(2).max(160),
  module_cible: z.string().min(2).max(40),
  definition: z.string().min(2),
  description: z.string().optional(),
});

export async function upsertOcrModelAction(formData: FormData) {
  await requirePermission("ocr.manage_models");
  const supabase = await createClientSafe();
  if (!supabase) return { ok: false as const, message: "Supabase indisponible" };

  const parsed = schema.safeParse({
    code: formData.get("code"),
    nom: formData.get("nom"),
    module_cible: formData.get("module_cible"),
    definition: formData.get("definition"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { ok: false as const, message: "Données invalides" };

  let definitionJson: unknown;
  try {
    definitionJson = JSON.parse(parsed.data.definition);
  } catch {
    return { ok: false as const, message: "JSON définition invalide" };
  }

  const { error } = await supabase.from("ocr_modeles_extraction" as never).upsert(
    {
      code: parsed.data.code,
      nom: parsed.data.nom,
      module_cible: parsed.data.module_cible,
      definition: definitionJson,
      description: parsed.data.description ?? null,
      actif: true,
    } as never,
    { onConflict: "code" } as never,
  );

  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/admin/import-intelligent/modeles");
  return { ok: true as const };
}
