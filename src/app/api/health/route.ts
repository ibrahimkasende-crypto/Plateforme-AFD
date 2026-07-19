import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_VERSION = "0.1.0";

/**
 * Health check public — aucun secret, aucun détail sensible.
 */
export async function GET() {
  const started = Date.now();
  const pub = getSupabasePublicEnv();
  let supabase: "ok" | "degraded" | "unavailable" = "unavailable";

  if (pub) {
    try {
      const client = createClient(pub.url, pub.key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await client.from("programmes").select("id").limit(1);
      supabase = error ? "degraded" : "ok";
    } catch {
      supabase = "unavailable";
    }
  }

  const status =
    supabase === "ok" ? "ok" : supabase === "degraded" ? "degraded" : "error";

  return NextResponse.json(
    {
      status,
      application: "plateforme-afd",
      version: APP_VERSION,
      environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
      timestamp: new Date().toISOString(),
      checks: {
        supabase,
      },
      latencyMs: Date.now() - started,
    },
    {
      status: status === "error" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
