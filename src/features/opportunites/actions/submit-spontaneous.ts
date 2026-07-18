"use server";

import { z } from "zod";
import { siteConfig } from "@/config/site";
import { createApplication, uploadPrivateApplicationFile } from "@/lib/mutations/public/candidature";
import type { ApplicationActionState } from "./submit-application";

const spontaneousSchema = z.object({
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().max(50).optional(),
  localisation: z.string().trim().max(160).optional(),
  pays: z.string().trim().max(100).optional(),
  ville: z.string().trim().max(160).optional(),
  niveau_etudes: z.string().trim().max(160).optional(),
  experience: z.string().trim().max(500).optional(),
  domaine_souhaite: z.string().trim().max(500).optional(),
  lettreMotivation: z.string().trim().min(30).max(6000),
  consentement: z.literal("on"),
});

export async function submitSpontaneousApplication(
  _: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  if (!siteConfig.features.spontaneousApplications) {
    return { ok: false, message: "Les candidatures spontanées ne sont pas ouvertes." };
  }
  const parsed = spontaneousSchema.safeParse(Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string")));
  if (!parsed.success) return { ok: false, message: "Veuillez vérifier les champs obligatoires." };
  const result = await createApplication({
    ...parsed.data,
    estSpontanee: true,
    consentement: true,
  });
  if (!result.ok) return { ok: false, message: result.message };
  const cv = formData.get("cv");
  if (cv instanceof File && cv.size) {
    const uploadedCv = await uploadPrivateApplicationFile(result.id, cv, "cv");
    if (!uploadedCv.ok) return { ok: false, message: uploadedCv.message };
  }
  const letter = formData.get("lettre");
  if (letter instanceof File && letter.size) {
    const uploadedLetter = await uploadPrivateApplicationFile(result.id, letter, "lettre");
    if (!uploadedLetter.ok) return { ok: false, message: uploadedLetter.message };
  }
  return { ok: true, message: "Votre candidature spontanée a été enregistrée." };
}
