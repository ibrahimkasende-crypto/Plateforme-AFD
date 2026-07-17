"use server";

import { z } from "zod";
import { submitPartnershipRequest } from "@/lib/mutations/public/partnership";

const partnershipSchema = z.object({
  org_name: z.string().trim().min(2).max(200),
  contact_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  partnership_type: z.enum([
    "institutionnel",
    "entreprise",
    "ong",
    "technique",
    "financier",
  ]),
  org_description: z.string().trim().min(20).max(3000),
  proposal: z.string().trim().min(20).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

const PARTNERSHIP_TYPE_LABELS: Record<
  z.infer<typeof partnershipSchema>["partnership_type"],
  string
> = {
  institutionnel: "Partenariat institutionnel",
  entreprise: "Entreprise",
  ong: "ONG / association",
  technique: "Partenaire technique",
  financier: "Partenaire financier",
};

export type PartnershipActionResult = {
  ok: boolean;
  message: string;
};

const recentSubmissions = new Map<string, number>();

export async function submitPartnershipAction(
  input: unknown,
): Promise<PartnershipActionResult> {
  const parsed = partnershipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier les informations du formulaire.",
    };
  }

  if (parsed.data.website) {
    return {
      ok: true,
      message: "Votre proposition de partenariat a bien été enregistrée. Merci.",
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

  const typeLabel = PARTNERSHIP_TYPE_LABELS[parsed.data.partnership_type];
  const subject = `[Partenariat] ${typeLabel}`;
  const message = [
    `Organisation : ${parsed.data.org_name}`,
    `Contact : ${parsed.data.contact_name}`,
    parsed.data.phone ? `Téléphone : ${parsed.data.phone}` : null,
    "",
    "Présentation de l’organisation :",
    parsed.data.org_description,
    "",
    "Proposition de collaboration :",
    parsed.data.proposal,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const result = await submitPartnershipRequest({
      organization: parsed.data.org_name,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject,
      message,
    });

    if (!result.ok) {
      return {
        ok: false,
        message:
          result.reason === "unavailable"
            ? "Le service de partenariat n’est pas disponible pour le moment. Réessayez plus tard."
            : "Votre proposition n’a pas pu être enregistrée. Réessayez plus tard.",
      };
    }

    return {
      ok: true,
      message:
        "Votre proposition de partenariat a bien été transmise. L’équipe AFD l’examinera et vous recontactera.",
    };
  } catch {
    return {
      ok: false,
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
