import { NextResponse } from "next/server";
import { serdiPayProvider } from "@/features/paiements/providers/serdipay";

export const runtime = "nodejs";

/**
 * Webhook SerdiPay — serveur uniquement.
 * Ne confirme jamais une transaction sans signature + contrôles métier.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const verification = await serdiPayProvider.verifyWebhook({
    headers: request.headers,
    rawBody,
  });

  if (!verification.valid) {
    return NextResponse.json(
      {
        ok: false,
        error:
          verification.raw.error ??
          "Webhook SerdiPay rejeté — configuration ou signature manquante",
      },
      { status: 503 },
    );
  }

  // TODO SerdiPay: idempotence, comparaison montant/devise/référence, journalisation.
  return NextResponse.json({
    ok: true,
    received: true,
    confirmed: false,
    notice: "Événement accepté pour traitement — confirmation non automatique.",
  });
}
