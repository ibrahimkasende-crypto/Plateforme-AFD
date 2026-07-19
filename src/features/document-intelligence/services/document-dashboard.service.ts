import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function getOcrDashboardStats(supabase: SupabaseClient) {
  const { data: docs } = await supabase
    .from("documents_importes" as never)
    .select("id, status, type_document, module_cible, created_at, ocr_provider, processing_progress")
    .order("created_at", { ascending: false })
    .limit(500);

  const list = (docs ?? []) as Array<{
    id: string;
    status: string;
    type_document: string;
    module_cible: string | null;
    created_at: string;
    ocr_provider: string | null;
  }>;

  const count = (status: string) => list.filter((d) => d.status === status).length;

  const { data: anomalies } = await supabase
    .from("ocr_anomalies" as never)
    .select("id, severity, status, document_id, message, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(50);

  const openAnomalies = (anomalies ?? []) as Array<{
    id: string;
    severity: string;
    message: string;
    document_id: string;
  }>;

  const { data: jobs } = await supabase
    .from("ocr_jobs" as never)
    .select("id, status, created_at, finished_at, started_at, result_meta")
    .order("created_at", { ascending: false })
    .limit(100);

  const jobList = (jobs ?? []) as Array<{
    status: string;
    started_at: string | null;
    finished_at: string | null;
    result_meta: { confidenceAvg?: number } | null;
  }>;

  const completed = jobList.filter((j) => j.status === "completed" && j.started_at && j.finished_at);
  const avgMs =
    completed.length === 0
      ? 0
      : completed.reduce((acc, j) => {
          return (
            acc +
            (new Date(j.finished_at!).getTime() - new Date(j.started_at!).getTime())
          );
        }, 0) / completed.length;

  const confidences = completed
    .map((j) => j.result_meta?.confidenceAvg)
    .filter((v): v is number => typeof v === "number");
  const avgConfidence =
    confidences.length === 0
      ? 0
      : confidences.reduce((a, b) => a + b, 0) / confidences.length;

  const byMonth: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const byModule: Record<string, number> = {};
  for (const d of list) {
    const month = d.created_at.slice(0, 7);
    byMonth[month] = (byMonth[month] ?? 0) + 1;
    byType[d.type_document] = (byType[d.type_document] ?? 0) + 1;
    const mod = d.module_cible || "autre";
    byModule[mod] = (byModule[mod] ?? 0) + 1;
  }

  return {
    kpis: {
      imported: list.length,
      processing: count("processing") + count("queued"),
      toReview: count("needs_review") + count("inconsistent"),
      approved: count("approved"),
      rejected: count("rejected"),
      applied: count("applied"),
      openAnomalies: openAnomalies.length,
      avgProcessingSeconds: Math.round(avgMs / 1000),
      avgConfidence: Math.round(avgConfidence * 100) / 100,
    },
    charts: { byMonth, byType, byModule },
    recent: list.slice(0, 12),
    criticalAnomalies: openAnomalies.filter(
      (a) => a.severity === "critical" || a.severity === "error",
    ),
    jobs: jobList.slice(0, 12),
  };
}
