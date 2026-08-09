import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Health check public — aucune donnée sensible.
 * Utilisé par PM2 / scripts de déploiement / GitHub Actions.
 */
export async function GET() {
  const version =
    process.env.AFD_RELEASE_SHA?.trim() ||
    process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
    process.env.npm_package_version?.trim() ||
    "0.1.0";

  return NextResponse.json(
    {
      status: "ok",
      service: "plateforme-afd",
      timestamp: new Date().toISOString(),
      version,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
