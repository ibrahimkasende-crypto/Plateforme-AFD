import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createDonationIntentSchema } from "@/features/dons/schemas/donation-intent";
import { createDonationIntent } from "@/services/donations.service";
import { initiatePaymentForIntent } from "@/services/payments.service";
import {
  CardPaymentNotConfiguredError,
  getCardPaymentConfig,
} from "@/lib/payments/providers/card";

export const runtime = "nodejs";

/**
 * Flux carte prévu (inactif tant que CARD_PAYMENT_ENABLED=false) :
 * 1. validation Zod
 * 2. création intention
 * 3. référence interne
 * 4. appel prestataire carte AFD si configuré
 * 5. statut pending — jamais confirmed ici
 */
export async function POST(request: Request) {
  try {
    const config = getCardPaymentConfig();
    if (!config.configured) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Le paiement par carte n’est pas encore activé pour l’AFD. Utilisez le virement bancaire.",
        },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const parsed = createDonationIntentSchema.parse(body);
    const intent = await createDonationIntent(parsed);
    const { transaction, error } = await initiatePaymentForIntent(intent);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error,
          intent: {
            id: intent.id,
            status: intent.status,
          },
          transaction: {
            id: transaction.id,
            internal_reference: transaction.internal_reference,
            status: transaction.status,
          },
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        intent: {
          id: intent.id,
          status: "payment_pending",
        },
        transaction: {
          id: transaction.id,
          internal_reference: transaction.internal_reference,
          status: transaction.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "Données invalides", details: error.flatten() },
        { status: 400 },
      );
    }

    if (error instanceof CardPaymentNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Erreur serveur lors de la création du paiement" },
      { status: 500 },
    );
  }
}
