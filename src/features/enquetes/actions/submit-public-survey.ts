"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClientSafe } from "@/lib/supabase/safe";

const baseSchema = z.object({
  enquete_id: z.string().uuid(),
  slug: z.string().min(2),
  consentement: z.string().optional(),
  website: z.string().optional(), // honeypot
});

export type SurveySubmitState = {
  ok: boolean;
  message: string;
};

export async function submitPublicSurvey(
  _prev: SurveySubmitState,
  formData: FormData,
): Promise<SurveySubmitState> {
  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Formulaire invalide." };
  }

  if (parsed.data.website?.trim()) {
    return { ok: true, message: "Merci, votre réponse a été enregistrée." };
  }

  const supabase = await createClientSafe();
  if (!supabase) {
    return {
      ok: false,
      message: "Service temporairement indisponible. Réessayez plus tard.",
    };
  }

  const { data: enquete } = await supabase
    .from("enquetes")
    .select("id, consentement_requis, statut, visibilite, slug")
    .eq("id", parsed.data.enquete_id)
    .eq("slug", parsed.data.slug)
    .eq("statut", "publiee")
    .eq("visibilite", "publique")
    .is("deleted_at", null)
    .maybeSingle();

  if (!enquete) {
    return { ok: false, message: "Cette enquête n’est plus disponible." };
  }

  const consentement = parsed.data.consentement === "on";
  if (enquete.consentement_requis && !consentement) {
    return {
      ok: false,
      message: "Le consentement est requis pour soumettre cette enquête.",
    };
  }

  const { data: questions } = await supabase
    .from("questions_enquete")
    .select("id, type_question, obligatoire")
    .eq("enquete_id", enquete.id);

  for (const question of questions ?? []) {
    if (!question.obligatoire) continue;
    const value = formData.get(`q_${question.id}`);
    if (value === null || String(value).trim() === "") {
      return {
        ok: false,
        message: "Veuillez renseigner tous les champs obligatoires.",
      };
    }
  }

  const { data: reponse, error } = await supabase
    .from("reponses_enquete")
    .insert({
      enquete_id: enquete.id,
      statut: "soumise",
      consentement,
      repondant_anonyme: true,
    })
    .select("id")
    .single();

  if (error || !reponse) {
    return {
      ok: false,
      message: "Impossible d’enregistrer la réponse. Réessayez.",
    };
  }

  const answers = (questions ?? []).map((question) => {
    const raw = formData.get(`q_${question.id}`);
    const text = raw === null ? null : String(raw);
    return {
      reponse_enquete_id: reponse.id,
      question_id: question.id,
      valeur_texte: text,
      valeur_nombre:
        question.type_question === "nombre" && text
          ? Number(text)
          : null,
    };
  });

  if (answers.length > 0) {
    await supabase.from("reponses_questions").insert(answers);
  }

  revalidatePath(`/enquetes/${parsed.data.slug}`);
  return {
    ok: true,
    message: "Merci. Votre réponse a été enregistrée.",
  };
}
