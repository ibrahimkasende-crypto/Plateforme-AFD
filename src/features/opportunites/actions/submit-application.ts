"use server";

import { z } from "zod";
import { createApplication, uploadPrivateApplicationFile } from "@/lib/mutations/public/candidature";

const applicationSchema = z.object({
  opportuniteId: z.string().uuid(),
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().max(50).optional(),
  localisation: z.string().trim().max(160).optional(),
  pays: z.string().trim().max(100).optional(),
  ville: z.string().trim().max(160).optional(),
  niveau_etudes: z.string().trim().max(160).optional(),
  experience: z.string().trim().max(500).optional(),
  lettreMotivation: z.string().trim().min(30).max(6000),
  consentement: z.literal("on"),
});

export type ApplicationActionState = { ok: boolean; message: string };

export async function submitApplication(
  _: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string")));
  if (!parsed.success) return { ok: false, message: "Veuillez vérifier les champs obligatoires." };
  const result = await createApplication({
    ...parsed.data,
    estSpontanee: false,
    consentement: true,
  });
  if (!result.ok) return { ok: false, message: result.message };
  const cv = formData.get("cv");
  if (!(cv instanceof File) || !cv.size) return { ok: false, message: "Veuillez joindre votre CV." };
  const uploadedCv = await uploadPrivateApplicationFile(result.id, cv, "cv");
  if (!uploadedCv.ok) return { ok: false, message: uploadedCv.message };
  const letter = formData.get("lettre");
  if (letter instanceof File && letter.size) {
    const uploadedLetter = await uploadPrivateApplicationFile(result.id, letter, "lettre");
    if (!uploadedLetter.ok) return { ok: false, message: uploadedLetter.message };
  }
  return { ok: true, message: "Votre candidature a été enregistrée." };
}
