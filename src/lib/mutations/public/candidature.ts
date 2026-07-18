import type { ApplicationInput } from "@/features/opportunites/types";
import { createClientSafe } from "@/lib/supabase/safe";

export type ApplicationMutationResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

export async function createApplication(
  input: ApplicationInput,
): Promise<ApplicationMutationResult> {
  try {
    const supabase = await createClientSafe();
    if (!supabase) return { ok: false, message: "Le service de candidature est indisponible." };
    const { data, error } = await supabase
      .from("candidatures")
      .insert({
        opportunite_id: input.opportuniteId ?? null,
        est_spontanee: input.estSpontanee,
        prenom: input.prenom,
        nom: input.nom,
        email: input.email,
        telephone: input.telephone || null,
        localisation: input.localisation || null,
        lettre_motivation: input.lettreMotivation,
        consentement: input.consentement,
      })
      .select("id")
      .single();
    return error || !data
      ? { ok: false, message: "Votre candidature n’a pas pu être enregistrée." }
      : { ok: true, id: data.id };
  } catch {
    return { ok: false, message: "Votre candidature n’a pas pu être enregistrée." };
  }
}

/** Prévu pour l’upload ultérieur: les fichiers doivent rester dans candidatures-privees. */
export async function uploadPrivateApplicationFile(): Promise<{
  ok: false;
  message: string;
}> {
  return { ok: false, message: "Le dépôt de fichier n’est pas encore configuré." };
}
