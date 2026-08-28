import { NextResponse } from "next/server";
import { cardPaymentProvider, getCardPaymentConfig } from "@/lib/payments/providers/card";

export const runtime = "nodejs";

/**
 * Webhook paiement carte AFD — serveur uniquement.
 * Inactif / rejeté tant que CARD_PAYMENT_ENABLED=false ou documentation manquante.
 */
export async function POST(request: Request) {
  const config = getCardPaymentConfig();
  const rawBody = await request.text();

  const verification = await cardPaymentProvider.verifyWebhook({
    headers: request.headers,
    rawBody,
  });

  if (!config.configured || !verification.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: "Webhook carte rejeté — configuration ou signature manquante",
      },
      { status: 401 },
    );
  }

  // TODO prestataire AFD : idempotence, montant/devise/référence, journalisation.
  return NextResponse.json({ ok: true });
}
