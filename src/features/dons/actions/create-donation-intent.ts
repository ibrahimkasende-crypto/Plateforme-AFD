"use server";

import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getSerdiPayConfig } from "@/features/paiements/providers/serdipay";
import { createDonationIntent } from "@/lib/mutations/public/dons";

const donationSchema = z.object({
  donor_name: z.string().trim().min(2).max(120),
  donor_email: z.string().trim().email().max(200),
  donor_phone: z.string().trim().max(40).optional(),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  currency: z.enum(siteConfig.currencies),
  message: z.string().trim().max(1000).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

export type DonationIntentActionResult = {
  ok: boolean;
  message: string;
  paymentAvailable: boolean;
  donationId?: string;
};

const recentSubmissions = new Map<string, number>();

export async function createDonationIntentAction(
  input: unknown,
): Promise<DonationIntentActionResult> {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez vérifier les informations du formulaire.",
      paymentAvailable: false,
    };
  }

  if (parsed.data.website) {
    return {
      ok: true,
      message: "Votre intention de don a bien été enregistrée. Merci.",
      paymentAvailable: false,
    };
  }

  const key = parsed.data.donor_email.toLowerCase();
  const now = Date.now();
  const last = recentSubmissions.get(key) ?? 0;
  if (now - last < 15_000) {
    return {
      ok: false,
      message: "Veuillez patienter quelques secondes avant une nouvelle tentative.",
      paymentAvailable: false,
    };
  }
  recentSubmissions.set(key, now);

  const serdiPay = getSerdiPayConfig();
  const paymentAvailable = serdiPay.configured;

  try {
    const result = await createDonationIntent({
      donor_name: parsed.data.donor_name,
      donor_email: parsed.data.donor_email,
      donor_phone: parsed.data.donor_phone,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      payment_method: "serdipay",
      status: paymentAvailable ? "pending" : "intent",
    });

    if (!result.ok) {
      return {
        ok: false,
        message:
          result.reason === "unavailable"
            ? "Le service de don n’est pas disponible pour le moment. Réessayez plus tard."
            : "Votre intention de don n’a pas pu être enregistrée. Réessayez plus tard.",
        paymentAvailable: false,
      };
    }

    if (!paymentAvailable) {
      return {
        ok: true,
        message:
          "Votre intention de don a été enregistrée. Le paiement en ligne via SerdiPay n’est pas encore activé — l’équipe AFD vous contactera pour finaliser votre soutien.",
        paymentAvailable: false,
        donationId: result.donationId,
      };
    }

    return {
      ok: true,
      message:
        "Votre intention de don a été enregistrée. La redirection vers SerdiPay sera disponible dès l’activation complète du module de paiement.",
      paymentAvailable: true,
      donationId: result.donationId,
    };
  } catch {
    return {
      ok: false,
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      paymentAvailable: false,
    };
  }
}
