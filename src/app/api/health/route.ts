import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "plateforme-afd",
      timestamp: new Date().toISOString(),
      version:
        process.env.GIT_SHA ??
        process.env.NEXT_PUBLIC_APP_VERSION ??
        "unknown",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
