"use server";

import { z } from "zod";
import { submitContactMessage } from "@/lib/mutations/public/contact";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(3, "Le sujet est requis").max(200),
  message: z.string().trim().min(10, "Le message est requis").max(5000),
  consent: z.literal(true, {
    error: "Le consentement est obligatoire",
  }),
  website: z.string().max(0).optional(),
});

export type ContactActionResult = {
  ok: boolean;
  message: string;
};

const recentSubmissions = new Map<string, number>();

export async function submitContactAction(
  input: unknown,
): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier les informations du formulaire.",
    };
  }

  if (parsed.data.website) {
    return {
      ok: true,
      message: "Votre message a bien été enregistré. Merci.",
    };
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
    const result = await submitContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    if (!result.ok) {
      return {
        ok: false,
        message:
          result.reason === "unavailable"
            ? "Le service de contact n’est pas disponible pour le moment. Réessayez plus tard."
            : "Votre message n’a pas pu être enregistré. Réessayez plus tard ou contactez-nous par un autre canal.",
      };
    }

    return {
      ok: true,
      message: "Votre message a bien été enregistré. Merci de contacter l’AFD.",
    };
  } catch {
    return {
      ok: false,
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
