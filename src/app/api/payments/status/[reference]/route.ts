import { NextResponse } from "next/server";
import {
  CardPaymentNotConfiguredError,
  cardPaymentProvider,
  getCardPaymentConfig,
} from "@/lib/payments/providers/card";
import { getPaymentStatusByReference } from "@/services/payments.service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ reference: string }> },
) {
  const { reference } = await context.params;
  const config = getCardPaymentConfig();

  if (!config.configured) {
    return NextResponse.json(
      { ok: false, error: "Paiement carte AFD non configuré" },
      { status: 503 },
    );
  }

  try {
    const local = await getPaymentStatusByReference(reference);
    if (local) {
      return NextResponse.json({ ok: true, transaction: local });
    }

    const remote = await cardPaymentProvider.getPaymentStatus(reference);
    return NextResponse.json({ ok: true, provider: remote });
  } catch (error) {
    if (error instanceof CardPaymentNotConfiguredError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "Statut indisponible" }, { status: 500 });
  }
}
