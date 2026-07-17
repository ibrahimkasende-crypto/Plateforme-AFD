import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * URL de retour navigateur après paiement.
 * Ne jamais traiter cette redirection comme une confirmation de succès.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");

  return NextResponse.json({
    ok: true,
    reference,
    confirmed: false,
    notice:
      "Retour navigateur reçu. Le statut définitif dépend uniquement de la vérification serveur / webhook.",
  });
}
