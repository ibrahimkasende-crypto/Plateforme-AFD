import { NextResponse } from "next/server";
import { getOcrConfig } from "@/features/document-intelligence/config";
import {
  claimAndProcessNextJob,
  processOcrJobById,
} from "@/features/document-intelligence/services/document-processing.service";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClientSafe } from "@/lib/supabase/safe";
import { hasPermission } from "@/lib/auth/has-permission";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Traitement asynchrone d’un job OCR.
 * Auth : en-tête x-ocr-worker-secret OU utilisateur avec ocr.process.
 */
export async function POST(request: Request) {
  const cfg = getOcrConfig();
  const secret = request.headers.get("x-ocr-worker-secret");
  const body = (await request.json().catch(() => ({}))) as { jobId?: string };

  let supabase = null as Awaited<ReturnType<typeof createClientSafe>>;

  if (secret && cfg.workerSecret && secret === cfg.workerSecret) {
    supabase = createAdminServiceClient();
  } else {
    supabase = await createClientSafe();
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const allowed = await hasPermission(user.id, "ocr.process");
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (!supabase) {
    return NextResponse.json(
      { error: "Client Supabase indisponible (service_role manquant ?)" },
      { status: 503 },
    );
  }

  try {
    if (body.jobId) {
      const result = await processOcrJobById(supabase, body.jobId);
      return NextResponse.json({ ok: true, result });
    }
    const result = await claimAndProcessNextJob(supabase);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Erreur traitement",
      },
      { status: 500 },
    );
  }
}
