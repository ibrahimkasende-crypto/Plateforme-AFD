"use server";

import { z } from "zod";
import {
  createApplication,
  uploadPrivateApplicationFile,
} from "@/lib/mutations/public/candidature";
import { isOpportunityOpenForApplications } from "@/features/opportunites/utils/status";
import { createClientSafe } from "@/lib/supabase/safe";

const recentByEmail = new Map<string, number>();

const schema = z.object({
  opportuniteId: z.string().uuid(),
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().min(6).max(50),
  localisation: z.string().trim().max(160).optional(),
  pays: z.string().trim().max(100).optional(),
  ville: z.string().trim().max(160).optional(),
  niveau_etudes: z.string().trim().max(160).optional(),
  experience: z.string().trim().max(500).optional(),
  lettreMotivation: z.string().trim().min(30).max(8000),
  consentement: z.literal("on"),
  website: z.string().max(0).optional(),
});

export type SubmitOpportunityResult = {
  ok: boolean;
  message: string;
  reference?: string;
};

export async function submitOpportunityApplication(
  formData: FormData,
): Promise<SubmitOpportunityResult> {
  const stringEntries = Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === "string"),
  );
  const parsed = schema.safeParse(stringEntries);
  if (!parsed.success) {
    return { ok: false, message: "Veuillez vérifier les champs obligatoires." };
  }

  if (parsed.data.website) {
    return { ok: true, message: "Candidature enregistrée. Merci." };
  }

  const emailKey = parsed.data.email.toLowerCase();
  const now = Date.now();
  const last = recentByEmail.get(emailKey) ?? 0;
  if (now - last < 30_000) {
    return {
      ok: false,
      message: "Veuillez patienter avant une nouvelle soumission.",
    };
  }
  recentByEmail.set(emailKey, now);

  const supabase = await createClientSafe();
  let opportunitySlug: string | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("opportunites")
      .select("id, slug, statut, date_limite, publie, deleted_at")
      .eq("id", parsed.data.opportuniteId)
      .maybeSingle();

    if (data) {
      opportunitySlug = data.slug;
      if (!data.publie || data.deleted_at) {
        return { ok: false, message: "Cette offre n’est plus disponible." };
      }
      const { resolveOpportunityStatus } = await import(
        "@/features/opportunites/utils/status"
      );
      const status = resolveOpportunityStatus(data.date_limite, data.statut);
      if (!isOpportunityOpenForApplications(status)) {
        return {
          ok: false,
          message: "La date limite est dépassée. Les candidatures sont fermées.",
        };
      }
    }
  }

  // Fallback : offre migrée (si seed SQL pas encore appliqué, FK peut échouer)
  if (!opportunitySlug) {
    const { MIGRATED_OPPORTUNITIES } = await import(
      "@/config/migrated-opportunities"
    );
    const migrated = MIGRATED_OPPORTUNITIES.find(
      (item) => item.id === parsed.data.opportuniteId,
    );
    if (!migrated || !isOpportunityOpenForApplications(migrated.statut)) {
      return { ok: false, message: "Cette offre n’accepte plus de candidatures." };
    }
    opportunitySlug = migrated.slug;
  }

  const result = await createApplication({
    opportuniteId: parsed.data.opportuniteId,
    estSpontanee: false,
    prenom: parsed.data.prenom,
    nom: parsed.data.nom,
    email: parsed.data.email,
    telephone: parsed.data.telephone,
    localisation: parsed.data.localisation,
    pays: parsed.data.pays,
    ville: parsed.data.ville,
    niveau_etudes: parsed.data.niveau_etudes,
    experience: parsed.data.experience,
    lettreMotivation: parsed.data.lettreMotivation,
    consentement: true,
  });

  if (!result.ok) {
    return {
      ok: false,
      message:
        result.message +
        " Si le problème persiste, appliquez la migration SQL de l’offre sur Supabase.",
    };
  }

  const cv = formData.get("cv");
  if (!(cv instanceof File) || !cv.size) {
    return { ok: false, message: "Veuillez joindre votre CV." };
  }
  const uploadedCv = await uploadPrivateApplicationFile(result.id, cv, "cv");
  if (!uploadedCv.ok) return { ok: false, message: uploadedCv.message };

  const letter = formData.get("lettre");
  if (letter instanceof File && letter.size) {
    const uploadedLetter = await uploadPrivateApplicationFile(
      result.id,
      letter,
      "lettre",
    );
    if (!uploadedLetter.ok) {
      return { ok: false, message: uploadedLetter.message };
    }
  }

  const reference = `AFD-CAND-${result.id.slice(0, 8).toUpperCase()}`;
  void opportunitySlug;

  return {
    ok: true,
    message: "Votre candidature a bien été enregistrée.",
    reference,
  };
}
