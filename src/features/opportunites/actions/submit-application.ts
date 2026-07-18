"use server";

import { z } from "zod";
import { createApplication } from "@/lib/mutations/public/candidature";

const applicationSchema = z.object({
  opportuniteId: z.string().uuid(),
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().max(50).optional(),
  localisation: z.string().trim().max(160).optional(),
  lettreMotivation: z.string().trim().min(30).max(6000),
  consentement: z.literal("on"),
});

export type ApplicationActionState = { ok: boolean; message: string };

export async function submitApplication(
  _: ApplicationActionState,
  formData: FormData,
): Promise<ApplicationActionState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Veuillez vérifier les champs obligatoires." };
  const result = await createApplication({
    ...parsed.data,
    estSpontanee: false,
    consentement: true,
  });
  return result.ok
    ? { ok: true, message: "Votre candidature a été enregistrée." }
    : { ok: false, message: result.message };
}
