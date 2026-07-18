"use server";

import { z } from "zod";
import { siteConfig } from "@/config/site";
import { createApplication } from "@/lib/mutations/public/candidature";
import type { ApplicationActionState } from "./submit-application";

const spontaneousSchema = z.object({
  prenom: z.string().trim().min(1).max(100),
  nom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  telephone: z.string().trim().max(50).optional(),
  localisation: z.string().trim().max(160).optional(),
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
  const parsed = spontaneousSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Veuillez vérifier les champs obligatoires." };
  const result = await createApplication({
    ...parsed.data,
    estSpontanee: true,
    consentement: true,
  });
  return result.ok
    ? { ok: true, message: "Votre candidature spontanée a été enregistrée." }
    : { ok: false, message: result.message };
}
