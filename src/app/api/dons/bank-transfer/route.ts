import { NextResponse } from "next/server";
import { createBankDonationIntentAction } from "@/features/dons/actions/bank-donation";

export const runtime = "nodejs";

/**
 * Création d’intention de don par virement.
 * Route HTTP classique (plus fiable que Server Actions derrière CyberPanel/OLS).
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = await createBankDonationIntentAction(body);
    return NextResponse.json(result, { status: result.ok ? 201 : 400 });
  } catch (error) {
    console.error("[api/dons/bank-transfer]", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Erreur serveur lors de la création du don. Réessayez.",
      },
      { status: 500 },
    );
  }
}
