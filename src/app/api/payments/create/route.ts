import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createDonationIntentSchema } from "@/features/dons/schemas/donation-intent";
import { createDonationIntent } from "@/services/donations.service";
import { initiatePaymentForIntent } from "@/services/payments.service";
import { SerdiPayNotConfiguredError } from "@/features/paiements/providers/serdipay";

export const runtime = "nodejs";

/**
 * Flux prévu :
 * 1. validation Zod
 * 2. création intention
 * 3. référence interne
 * 4. appel SerdiPay si configuré
 * 5. statut pending — jamais confirmed ici
 */
export async function POST(request: Request) {
  try {
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

    if (error instanceof SerdiPayNotConfiguredError) {
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
