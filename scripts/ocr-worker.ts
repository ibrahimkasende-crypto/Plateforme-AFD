/**
 * Worker OCR persistant (file PostgreSQL ocr_jobs).
 *
 * Prérequis :
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - Migrations 040/041 appliquées
 *
 * Lancement :
 *   npx tsx scripts/ocr-worker.ts
 *
 * Ne jamais exposer la service_role au navigateur.
 */

import { createClient } from "@supabase/supabase-js";
import { processOcrJobById } from "../src/features/document-intelligence/services/document-processing.service";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const pollMs = Number(process.env.OCR_WORKER_POLL_MS || 4000);

if (!url || !key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL requis");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function claimJobId(): Promise<string | null> {
  const { data, error } = await supabase.rpc("claim_ocr_job", {
    p_worker_id: `node-worker-${process.pid}`,
    p_provider: null,
  });
  if (error) {
    console.error("claim_ocr_job:", error.message);
    return null;
  }
  if (!data) return null;
  if (typeof data === "object" && data !== null && "id" in data) {
    return String((data as { id: string }).id);
  }
  return null;
}

async function loop() {
  console.log(`[ocr-worker] démarré (poll ${pollMs}ms)`);
  for (;;) {
    try {
      const jobId = await claimJobId();
      if (!jobId) {
        await new Promise((r) => setTimeout(r, pollMs));
        continue;
      }
      console.log(`[ocr-worker] job ${jobId}`);
      const result = await processOcrJobById(supabase, jobId);
      console.log(`[ocr-worker] terminé`, result);
    } catch (err) {
      console.error("[ocr-worker] erreur", err);
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }
}

void loop();
