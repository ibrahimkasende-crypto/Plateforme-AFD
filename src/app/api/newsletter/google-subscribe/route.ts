import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAdminProfile } from "@/lib/auth/get-user-role";
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter.service";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  consent: z.literal(true),
});

/**
 * Finalise l’inscription newsletter après OAuth Google.
 * L’e-mail vient exclusivement de la session authentifiée (getUser).
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Requête invalide." },
        { status: 400 },
      );
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Le consentement est obligatoire pour finaliser l’inscription.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("[newsletter/google-subscribe]", {
        request_id: requestId,
        step: "getUser",
        at: new Date().toISOString(),
        type: "session_missing",
      });
      return NextResponse.json(
        {
          ok: false,
          message:
            "Session Google expirée. Relancez « Continuer avec Google ».",
        },
        { status: 401 },
      );
    }

    const email =
      user.email?.trim() ||
      (typeof user.user_metadata?.email === "string"
        ? user.user_metadata.email.trim()
        : "");

    if (!email) {
      console.error("[newsletter/google-subscribe]", {
        request_id: requestId,
        step: "email",
        at: new Date().toISOString(),
        type: "email_missing",
      });
      return NextResponse.json(
        {
          ok: false,
          message:
            "Google n’a pas fourni d’adresse e-mail. Utilisez l’inscription manuelle.",
        },
        { status: 400 },
      );
    }

    const meta = user.user_metadata ?? {};
    const firstName =
      typeof meta.given_name === "string"
        ? meta.given_name
        : typeof meta.full_name === "string"
          ? meta.full_name.split(" ")[0]
          : typeof meta.name === "string"
            ? meta.name.split(" ")[0]
            : undefined;

    const result = await subscribeToNewsletter({
      email,
      firstName,
      preferences: [],
      consent: true,
      source: "public_newsletter_modal",
      userId: user.id,
      provider: "google",
    });

    const adminProfile = await getAdminProfile(user.id);
    const isInternalAdmin =
      Boolean(adminProfile) &&
      (adminProfile?.actif !== false) &&
      (adminProfile?.statut_compte == null ||
        adminProfile.statut_compte === "actif");

    // Session créée seulement pour la newsletter : on la ferme sauf admin déjà connu.
    if (!isInternalAdmin) {
      await supabase.auth.signOut();
    }

    return NextResponse.json({
      ok: true,
      status: result.status,
      message: result.message,
      email: result.email,
    });
  } catch (err) {
    console.error("[newsletter/google-subscribe]", {
      request_id: requestId,
      step: "subscribe",
      at: new Date().toISOString(),
      type: err instanceof Error ? err.name : "unknown",
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "L’inscription newsletter n’a pas pu être finalisée. Réessayez plus tard.",
      },
      { status: 500 },
    );
  }
}
