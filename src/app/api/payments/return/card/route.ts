import { NextResponse } from "next/server";
import { getCardPaymentConfig } from "@/lib/payments/providers/card";

export const runtime = "nodejs";

/**
 * Return URL carte AFD — n’affiche jamais un paiement comme confirmé.
 * Redirige vers /soutenir avec un message neutre.
 */
export async function GET() {
  const config = getCardPaymentConfig();
  const target = new URL("/soutenir", process.env.NEXT_PUBLIC_SITE_URL || "https://afd-rdc.org");
  target.searchParams.set(
    "card",
    config.configured ? "retour" : "indisponible",
  );
  return NextResponse.redirect(target);
}
