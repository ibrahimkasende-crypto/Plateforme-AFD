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
        pays: input.pays || null,
        ville: input.ville || null,
        niveau_etudes: input.niveau_etudes || null,
        experience: input.experience || null,
        domaine_souhaite: input.domaine_souhaite || null,
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

export async function uploadPrivateApplicationFile(
  candidatureId: string,
  file: File,
  kind: "cv" | "lettre" | "autre",
): Promise<ApplicationMutationResult> {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const extension = file.name.toLowerCase().split(".").pop();
  if (!file.size || file.size > 5 * 1024 * 1024 || !allowedTypes.includes(file.type) || !["pdf", "docx"].includes(extension ?? "")) {
    return { ok: false, message: "Le fichier doit être un PDF ou DOCX de 5 Mo maximum." };
  }
  const safeName = file.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "document";
  try {
    const supabase = await createClientSafe();
    if (!supabase) return { ok: false, message: "Le service de candidature est indisponible." };
    const path = `candidatures/${candidatureId}/${kind}-${safeName}`;
    const { error } = await supabase.storage.from("candidatures-privees").upload(path, file, { contentType: file.type, upsert: false });
    if (error) return { ok: false, message: "Le fichier n’a pas pu être envoyé." };
    const { error: documentError } = await supabase.from("documents_candidature").insert({
      candidature_id: candidatureId, nom_fichier: safeName, chemin_storage: path, type_mime: file.type, taille_octets: file.size,
    });
    if (documentError) return { ok: false, message: "Le fichier a été envoyé mais son enregistrement a échoué." };
    if (kind === "cv" || kind === "lettre") {
      await supabase.from("candidatures").update(kind === "cv" ? { cv_storage_path: path } : { lettre_storage_path: path }).eq("id", candidatureId);
    }
    return { ok: true, id: candidatureId };
  } catch {
    return { ok: false, message: "Le fichier n’a pas pu être envoyé." };
  }
}
