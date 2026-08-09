import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { processContactMessage } from "@/lib/contact/process-contact-message";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  organisation: z.string().trim().max(200).optional().nullable(),
  requestType: z.string().trim().max(80).optional().nullable(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
  province: z.string().trim().max(120).optional().nullable(),
  consent: z.literal(true),
  website: z.string().max(0).optional().nullable(),
});

const recentSubmissions = new Map<string, number>();

/**
 * POST /api/contact
 * Enregistre le message, notifie en interne, tente l’envoi SMTP AFD.
 * Succès = enregistrement OK (même si SMTP échoue).
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Requête invalide." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Veuillez vérifier les informations du formulaire." },
      { status: 400 },
    );
  }

  // Honeypot anti-spam
  if (parsed.data.website) {
    return NextResponse.json({
      ok: true,
      message: "Votre message a bien été enregistré. Merci.",
      emailNotificationSent: true,
    });
  }

  const key = parsed.data.email.toLowerCase();
  const now = Date.now();
  const last = recentSubmissions.get(key) ?? 0;
  if (now - last < 15_000) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Veuillez patienter quelques secondes avant une nouvelle tentative.",
      },
      { status: 429 },
    );
  }
  recentSubmissions.set(key, now);

  try {
    const result = await processContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      organisation: parsed.data.organisation,
      requestType: parsed.data.requestType,
      subject: parsed.data.subject,
      message: parsed.data.message,
      province: parsed.data.province,
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          message:
            result.reason === "unavailable"
              ? "Le service de contact n’est pas disponible pour le moment. Réessayez plus tard."
              : "Votre message n’a pas pu être enregistré. Réessayez plus tard.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Votre message a bien été enregistré. Merci de contacter l’AFD.",
      messageId: result.messageId,
      emailNotificationSent: result.emailNotificationSent,
      emailNotificationError: result.emailNotificationError ?? null,
      autoReplySent: result.autoReplySent,
    });
  } catch (err) {
    console.error("[api/contact]", {
      request_id: requestId,
      step: "process",
      at: new Date().toISOString(),
      type: err instanceof Error ? err.name : "unknown",
    });
    return NextResponse.json(
      {
        ok: false,
        message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      },
      { status: 500 },
    );
  }
}
