import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health dépendances — optionnel / limité.
 * N'expose jamais de secrets. Indique seulement si les variables
 * publiques/serveur requises sont présentes (booléens).
 *
 * Protégé par un header optionnel HEALTH_DEPENDENCIES_TOKEN si défini.
 */
export async function GET(request: Request) {
  const token = process.env.HEALTH_DEPENDENCIES_TOKEN?.trim();
  if (token) {
    const provided = request.headers.get("x-health-token")?.trim();
    if (!provided || provided !== token) {
      return NextResponse.json({ status: "forbidden" }, { status: 403 });
    }
  }

  const hasPublicSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const hasPublicSupabaseKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const hasSmtpPassword = Boolean(process.env.MAIL_SMTP_PASSWORD?.trim());

  const ok = hasPublicSupabaseUrl && hasPublicSupabaseKey && hasServiceRole;

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      service: "plateforme-afd-dependencies",
      timestamp: new Date().toISOString(),
      checks: {
        supabase_url: hasPublicSupabaseUrl,
        supabase_public_key: hasPublicSupabaseKey,
        supabase_service_role: hasServiceRole,
        smtp_password_configured: hasSmtpPassword,
      },
    },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
