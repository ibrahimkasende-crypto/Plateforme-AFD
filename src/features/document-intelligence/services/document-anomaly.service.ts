import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { runConsistencyEngine } from "@/features/document-intelligence/rules/engine";
import type { ExtractedField } from "@/features/document-intelligence/types";

function mapSeverity(
  level: string,
): "info" | "warning" | "error" | "critical" {
  if (level === "high") return "error";
  if (level === "critical") return "critical";
  if (level === "info") return "info";
  return "warning";
}

export async function detectAndStoreAnomalies(
  supabase: SupabaseClient,
  input: {
    documentId: string;
    moduleCible: string | null;
    fields: ExtractedField[];
    tableLineAmounts?: number[];
    hasProjet?: boolean;
    periodDuplicate?: boolean;
  },
) {
  const findings = runConsistencyEngine({
    moduleCible: input.moduleCible,
    fields: input.fields,
    tableLineAmounts: input.tableLineAmounts,
    hasProjet: input.hasProjet,
    periodDuplicate: input.periodDuplicate,
  });

  if (!findings.length) {
    return { count: 0, hasCritical: false };
  }

  const rows = findings.map((f) => ({
    document_id: input.documentId,
    anomaly_type: "validation",
    message: f.message,
    severity: mapSeverity(f.level),
    status: "open",
    details: {
      code: f.code,
      category: f.category,
      fieldNames: f.fieldNames,
      level: f.level,
    },
  }));

  await supabase.from("ocr_anomalies" as never).insert(rows as never);

  const hasCritical = findings.some(
    (f) => f.level === "critical" || f.level === "high",
  );

  return { count: findings.length, hasCritical };
}

export async function listDocumentAnomalies(
  supabase: SupabaseClient,
  documentId: string,
) {
  const { data } = await supabase
    .from("ocr_anomalies" as never)
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
