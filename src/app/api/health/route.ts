import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
  process.env.npm_package_version?.trim() ||
  "0.1.0";

/**
 * Health check public — aucune donnée sensible.
 * Utilisé par PM2 / scripts de déploiement / GitHub Actions.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "plateforme-afd",
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
