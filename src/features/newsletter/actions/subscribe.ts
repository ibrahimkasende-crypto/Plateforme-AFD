"use server";

import { z } from "zod";
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter.service";

const actionSchema = z.object({
  email: z.string().email().max(200),
  firstName: z.string().trim().max(100).optional(),
  preferences: z.array(z.string().max(50)).max(10).default([]),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export type NewsletterActionResult = {
  ok: boolean;
  message: string;
};

const recentSubmissions = new Map<string, number>();

export async function subscribeNewsletterAction(
  input: unknown,
): Promise<NewsletterActionResult> {
  const parsed = actionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier les informations du formulaire.",
    };
  }

  if (parsed.data.website) {
    return { ok: true, message: "Inscription enregistrée. Merci." };
  }

  const key = parsed.data.email.toLowerCase();
  const now = Date.now();
  const last = recentSubmissions.get(key) ?? 0;
  if (now - last < 15_000) {
    return {
      ok: false,
      message: "Veuillez patienter quelques secondes avant une nouvelle tentative.",
    };
  }
  recentSubmissions.set(key, now);

  try {
    await subscribeToNewsletter({
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      preferences: parsed.data.preferences,
      consent: true,
    });

    return {
      ok: true,
      message:
        "Votre demande d’inscription a été enregistrée. Merci de votre intérêt pour l’AFD.",
    };
  } catch {
    return {
      ok: false,
      message:
        "L’inscription newsletter n’est pas encore complètement configurée. Réessayez plus tard.",
    };
  }
}
