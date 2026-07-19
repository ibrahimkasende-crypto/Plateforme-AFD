import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getOcrConfig, OCR_BUCKET } from "@/features/document-intelligence/config";
import {
  getActiveOcrProvider,
  getFallbackProvider,
  getNativeProvider,
} from "@/features/document-intelligence/providers/registry";
import { detectAndStoreAnomalies } from "@/features/document-intelligence/services/document-anomaly.service";
import { notifyOcrUser } from "@/features/document-intelligence/services/document-notification.service";
import type { ExtractedField, ProviderAnalysisResult } from "@/features/document-intelligence/types";
import { isImageMime, isTextBearingMime } from "@/features/document-intelligence/utils/mime";
import {
  normalizeAmount,
  normalizeDate,
} from "@/features/document-intelligence/utils/normalize";

function mapValueType(
  t: ExtractedField["type"],
): "text" | "number" | "date" | "currency" | "boolean" | "json" {
  if (t === "currency") return "currency";
  if (t === "date") return "date";
  if (t === "integer" || t === "decimal" || t === "percentage") return "number";
  if (t === "boolean") return "boolean";
  if (t === "table") return "json";
  return "text";
}

function heuristicFieldsFromText(text: string): ExtractedField[] {
  const fields: ExtractedField[] = [];
  const patterns: Array<[string, RegExp, ExtractedField["type"]]> = [
    ["budget_prevu", /budget\s*(prévu|prevu)?\s*[:\-]?\s*([0-9.,]+\s*(USD|EUR|CDF|FC|\$)?)/i, "currency"],
    ["depenses", /d[ée]penses?\s*[:\-]?\s*([0-9.,]+\s*(USD|EUR|CDF|FC|\$)?)/i, "currency"],
    ["solde", /solde\s*[:\-]?\s*([0-9.,]+\s*(USD|EUR|CDF|FC|\$)?)/i, "currency"],
    ["total", /total\s*[:\-]?\s*([0-9.,]+)/i, "decimal"],
    ["femmes", /femmes?\s*[:\-]?\s*(\d+)/i, "integer"],
    ["hommes", /hommes?\s*[:\-]?\s*(\d+)/i, "integer"],
    ["filles", /filles?\s*[:\-]?\s*(\d+)/i, "integer"],
    ["garcons", /gar[cç]ons?\s*[:\-]?\s*(\d+)/i, "integer"],
  ];

  for (const [name, re, type] of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const raw = (m[2] || m[1] || "").trim();
    if (!raw) continue;
    fields.push({
      name,
      rawValue: raw,
      type,
      confidence: 0.55,
      source: "native",
    });
  }
  return fields;
}

async function persistExtraction(
  supabase: SupabaseClient,
  documentId: string,
  jobId: string,
  result: ProviderAnalysisResult,
) {
  for (const page of result.pages) {
    await supabase.from("ocr_pages" as never).upsert(
      {
        document_id: documentId,
        job_id: jobId,
        page_number: page.pageNumber,
        text_content: page.text,
        confidence: page.confidence,
        status: "extracted",
      } as never,
      { onConflict: "document_id,page_number" } as never,
    );
  }

  const { data: pages } = await supabase
    .from("ocr_pages" as never)
    .select("id, page_number")
    .eq("document_id", documentId);

  const pageIdByNumber = new Map<number, string>();
  for (const p of pages ?? []) {
    const row = p as { id: string; page_number: number };
    pageIdByNumber.set(row.page_number, row.id);
  }

  for (const [idx, table] of result.tables.entries()) {
    await supabase.from("ocr_tables" as never).insert({
      document_id: documentId,
      page_id: pageIdByNumber.get(table.page) ?? null,
      table_index: idx,
      row_count: table.rows.length,
      col_count: table.headers.length,
      headers: table.headers,
      cells: table.rows,
      confidence: table.confidence,
      metadata: { name: table.name },
    } as never);
  }

  const allFields = [
    ...result.fields,
    ...result.keyValuePairs,
    ...heuristicFieldsFromText(result.fullText),
  ];

  // dédoublonnage par nom
  const byName = new Map<string, ExtractedField>();
  for (const f of allFields) {
    const key = f.name.toLowerCase();
    const prev = byName.get(key);
    if (!prev || f.confidence > prev.confidence) byName.set(key, f);
  }

  for (const f of byName.values()) {
    const { data: champ } = await supabase
      .from("ocr_champs_extraits" as never)
      .insert({
        document_id: documentId,
        job_id: jobId,
        field_key: f.name,
        field_label: f.name,
        raw_value: f.rawValue,
        value_type: mapValueType(f.type),
        page_number: f.page ?? null,
        bbox: f.boundingBox ?? {},
        confidence: f.confidence,
        review_status: "pending",
        metadata: { source: f.source },
      } as never)
      .select("id")
      .single();

    const champId =
      champ && typeof champ === "object" && "id" in champ
        ? String((champ as { id: string }).id)
        : null;
    if (!champId) continue;

    let normalizedValue = f.rawValue;
    let normalizedNumber: number | null = null;
    let normalizedDate: string | null = null;
    let currency: string | null = null;
    let validationStatus: "pending" | "valid" | "invalid" = "pending";
    let notes: string | null = null;

    if (f.type === "currency" || f.type === "decimal" || f.type === "integer") {
      const n = normalizeAmount(f.rawValue);
      normalizedNumber = Number.isNaN(n.amount) ? null : n.amount;
      currency = n.currency;
      normalizedValue = normalizedNumber == null ? f.rawValue : String(normalizedNumber);
      if (n.ambiguous) {
        validationStatus = "invalid";
        notes = `Ambigu : ${n.interpretations.join(" | ")}`;
      } else if (normalizedNumber != null) {
        validationStatus = "valid";
      }
    } else if (f.type === "date") {
      const d = normalizeDate(f.rawValue);
      normalizedDate = d.iso;
      normalizedValue = d.iso ?? f.rawValue;
      if (d.ambiguous) {
        validationStatus = "invalid";
        notes = `Date ambiguë : ${d.interpretations.join(" | ")}`;
      } else if (d.iso) {
        validationStatus = "valid";
      }
    }

    await supabase.from("ocr_valeurs_normalisees" as never).insert({
      champ_id: champId,
      document_id: documentId,
      normalized_value: normalizedValue,
      normalized_number: normalizedNumber,
      normalized_date: normalizedDate,
      normalized_type: mapValueType(f.type),
      currency,
      validation_status: validationStatus,
      validation_notes: notes,
    } as never);
  }

  return Array.from(byName.values());
}

export async function processOcrJobById(
  supabase: SupabaseClient,
  jobId: string,
) {
  const cfg = getOcrConfig();

  const { data: job, error: jobError } = await supabase
    .from("ocr_jobs" as never)
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error(jobError?.message || "Job introuvable");
  }

  const jobRow = job as {
    id: string;
    document_id: string;
    status: string;
    attempts: number;
    max_attempts: number;
  };

  const { data: doc } = await supabase
    .from("documents_importes" as never)
    .select("*")
    .eq("id", jobRow.document_id)
    .single();

  if (!doc) throw new Error("Document introuvable");
  const document = doc as {
    id: string;
    storage_path: string;
    mime_type: string | null;
    original_filename: string;
    module_cible: string | null;
    projet_id: string | null;
    uploaded_by: string | null;
    status: string;
  };

  if (document.status === "suspicious") {
    await supabase
      .from("ocr_jobs" as never)
      .update({
        status: "cancelled",
        error_message: "Document suspect (doublon) — traitement annulé",
        finished_at: new Date().toISOString(),
      } as never)
      .eq("id", jobId);
    return { ok: false as const, reason: "suspicious" };
  }

  const alreadyClaimed = jobRow.status === "processing";
  await supabase
    .from("ocr_jobs" as never)
    .update({
      status: "processing",
      started_at: new Date().toISOString(),
      progress: 20,
      attempts: alreadyClaimed ? jobRow.attempts : jobRow.attempts + 1,
    } as never)
    .eq("id", jobId);

  await supabase
    .from("documents_importes" as never)
    .update({ status: "processing", processing_progress: 25 } as never)
    .eq("id", document.id);

  const { data: fileData, error: dlError } = await supabase.storage
    .from(OCR_BUCKET)
    .download(document.storage_path);

  if (dlError || !fileData) {
    await failJob(supabase, jobId, document.id, document.uploaded_by, dlError?.message || "download");
    return { ok: false as const, reason: "download" };
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const mime = document.mime_type || "application/octet-stream";

  let result: ProviderAnalysisResult;
  let providerUsed = "native";

  try {
    if (isTextBearingMime(mime)) {
      result = await getNativeProvider().analyzeDocument({
        buffer,
        mimeType: mime,
        filename: document.original_filename,
        language: cfg.defaultLanguage,
      });
      providerUsed = result.provider;

      const needOcr =
        result.fullText.trim().length < 40 ||
        (result.limits ?? []).some((l) => l.toLowerCase().includes("ocr"));

      if (needOcr && isImageMime(mime)) {
        // continue below
      } else if (needOcr && mime === "application/pdf") {
        try {
          const cloud = getActiveOcrProvider();
          if (cloud.getProviderMetadata().id !== "native") {
            result = await cloud.analyzeDocument({
              buffer,
              mimeType: mime,
              filename: document.original_filename,
            });
            providerUsed = result.provider;
          } else {
            const fb = await getFallbackProvider().analyzeDocument({
              buffer,
              mimeType: mime,
              filename: document.original_filename,
            });
            if (!fb.fullText.trim()) {
              result = {
                ...result,
                limits: [
                  ...(result.limits ?? []),
                  ...(fb.limits ?? []),
                  "OCR fallback sans texte exploitable",
                ],
                requiresReview: true,
              };
              providerUsed = `${providerUsed}+tesseract-failed`;
            } else {
              result = fb;
              providerUsed = fb.provider;
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "ocr_error";
          result = {
            ...result,
            limits: [...(result.limits ?? []), `Fournisseur OCR : ${message}`],
            requiresReview: true,
          };
        }
      }
    } else if (isImageMime(mime)) {
      try {
        const active = getActiveOcrProvider();
        if (active.supportsFileType(mime) && active.getProviderMetadata().id !== "native") {
          result = await active.analyzeDocument({
            buffer,
            mimeType: mime,
            filename: document.original_filename,
          });
        } else {
          result = await getFallbackProvider().analyzeDocument({
            buffer,
            mimeType: mime,
            filename: document.original_filename,
          });
        }
        providerUsed = result.provider;
        if (!result.fullText.trim()) {
          throw new Error("Résultat OCR vide");
        }
      } catch (err) {
        await failJob(
          supabase,
          jobId,
          document.id,
          document.uploaded_by,
          err instanceof Error ? err.message : "ocr_failed",
        );
        return { ok: false as const, reason: "ocr_failed" };
      }
    } else {
      await failJob(supabase, jobId, document.id, document.uploaded_by, "unsupported_type");
      return { ok: false as const, reason: "unsupported" };
    }

    await supabase
      .from("documents_importes" as never)
      .update({ processing_progress: 70, ocr_provider: providerUsed } as never)
      .eq("id", document.id);

    const fields = await persistExtraction(supabase, document.id, jobId, result);

    const lineAmounts = result.tables.flatMap((t) =>
      t.rows.map((r) => {
        const last = r[r.length - 1];
        const n = normalizeAmount(last ?? "").amount;
        return Number.isNaN(n) ? 0 : n;
      }),
    );

    const anomaly = await detectAndStoreAnomalies(supabase, {
      documentId: document.id,
      moduleCible: document.module_cible,
      fields,
      tableLineAmounts: lineAmounts.length ? lineAmounts : undefined,
      hasProjet: Boolean(document.projet_id),
    });

    const nextStatus = anomaly.hasCritical ? "inconsistent" : "needs_review";

    await supabase
      .from("documents_importes" as never)
      .update({
        status: nextStatus,
        processing_progress: 100,
        ocr_provider: providerUsed,
        page_count: result.pages.length || null,
      } as never)
      .eq("id", document.id);

    await supabase
      .from("ocr_jobs" as never)
      .update({
        status: "completed",
        progress: 100,
        finished_at: new Date().toISOString(),
        provider: providerUsed,
        result_meta: {
          limits: result.limits ?? [],
          requiresReview: true,
          confidenceAvg:
            fields.reduce((a, f) => a + f.confidence, 0) / Math.max(fields.length, 1),
        },
      } as never)
      .eq("id", jobId);

    if (document.uploaded_by) {
      await notifyOcrUser(supabase, {
        userId: document.uploaded_by,
        documentId: document.id,
        type: "review_required",
        title: "OCR terminé — révision requise",
        body: anomaly.count
          ? `${anomaly.count} anomalie(s) détectée(s).`
          : "Extraction prête pour révision humaine.",
      });
    }

    return { ok: true as const, status: nextStatus, providerUsed };
  } catch (err) {
    await failJob(
      supabase,
      jobId,
      document.id,
      document.uploaded_by,
      err instanceof Error ? err.message : "processing_error",
    );
    return { ok: false as const, reason: "exception" };
  }
}

async function failJob(
  supabase: SupabaseClient,
  jobId: string,
  documentId: string,
  userId: string | null,
  message: string,
) {
  await supabase
    .from("ocr_jobs" as never)
    .update({
      status: "failed",
      error_message: message.slice(0, 500),
      finished_at: new Date().toISOString(),
    } as never)
    .eq("id", jobId);

  await supabase
    .from("documents_importes" as never)
    .update({
      status: "failed",
      error_message: message.slice(0, 500),
      processing_progress: 100,
    } as never)
    .eq("id", documentId);

  if (userId) {
    await notifyOcrUser(supabase, {
      userId,
      documentId,
      type: "error",
      title: "Échec du traitement OCR",
      body: message.slice(0, 200),
    });
  }
}

export async function claimAndProcessNextJob(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("claim_ocr_job" as never, {
    p_worker_id: `worker-${process.pid}`,
    p_provider: null,
  } as never);

  if (error) throw new Error(error.message);
  const claimed = Array.isArray(data) ? data[0] : data;
  if (!claimed || typeof claimed !== "object" || !("id" in claimed)) {
    return null;
  }
  const jobId = String((claimed as { id: string }).id);
  return processOcrJobById(supabase, jobId);
}
