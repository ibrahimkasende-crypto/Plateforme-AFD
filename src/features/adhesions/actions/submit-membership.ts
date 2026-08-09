"use server";

import { z } from "zod";
import { submitMembershipRequest } from "@/lib/mutations/public/adhesion";

const membershipSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  address: z.string().trim().min(5).max(300),
  gender: z.enum(["femme", "homme", "autre", "non_precise"]),
  motivation: z.string().trim().min(20).max(3000),
  member_type: z.enum(["actif", "sympathisant", "jeune", "institutionnel"]),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export type MembershipActionResult = {
  ok: boolean;
  message: string;
};

const recentSubmissions = new Map<string, number>();

export async function submitMembershipAction(
  input: unknown,
): Promise<MembershipActionResult> {
  const parsed = membershipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier les informations du formulaire.",
    };
  }

  if (parsed.data.website) {
    return {
      ok: true,
      message: "Votre demande d’adhésion a bien été enregistrée. Merci.",
    };
  }

  const key = parsed.data.email.toLowerCase();
  const now = Date.now();
  const last = recentSubmissions.get(key) ?? 0;
  if (now - last < 8_000) {
    return {
      ok: false,
      message: "Veuillez patienter quelques secondes avant une nouvelle tentative.",
    };
  }

  try {
    const result = await submitMembershipRequest({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      gender: parsed.data.gender,
      motivation: parsed.data.motivation,
      member_type: parsed.data.member_type,
    });

    if (!result.ok) {
      // Ne pas bloquer les retries si l’enregistrement a échoué.
      recentSubmissions.delete(key);
      return {
        ok: false,
        message:
          result.reason === "unavailable"
            ? "Le service d’adhésion n’est pas disponible pour le moment. Réessayez plus tard."
            : "Votre demande d’adhésion n’a pas pu être enregistrée. Réessayez plus tard.",
      };
    }

    recentSubmissions.set(key, now);

    return {
      ok: true,
      message:
        "Votre demande d’adhésion a bien été transmise. L’équipe AFD l’examinera et vous contactera.",
    };
  } catch {
    recentSubmissions.delete(key);
    return {
      ok: false,
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
