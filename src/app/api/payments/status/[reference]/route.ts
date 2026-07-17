import { NextResponse } from "next/server";
import { getPaymentStatusByReference } from "@/services/payments.service";
import {
  SerdiPayNotConfiguredError,
  getSerdiPayConfig,
} from "@/features/paiements/providers/serdipay";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ reference: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { reference } = await context.params;

  if (!reference) {
    return NextResponse.json(
      { ok: false, error: "Référence manquante" },
      { status: 400 },
    );
  }

  const config = getSerdiPayConfig();
  if (!config.configured) {
    return NextResponse.json(
      {
        ok: false,
        error: "SerdiPay n’est pas encore configuré",
        reference,
      },
      { status: 503 },
    );
  }

  try {
    const transaction = await getPaymentStatusByReference(reference);
    if (!transaction) {
      return NextResponse.json(
        { ok: false, error: "Transaction introuvable", reference },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      reference,
      status: transaction.status,
      webhook_verified: transaction.webhook_verified,
    });
  } catch (error) {
    if (error instanceof SerdiPayNotConfiguredError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Impossible de vérifier le statut" },
      { status: 500 },
    );
  }
}
