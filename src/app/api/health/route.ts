import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_VERSION = "0.1.0";

/**
 * Health check public — aucun secret, aucun détail sensible.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      application: "plateforme-afd",
      environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
