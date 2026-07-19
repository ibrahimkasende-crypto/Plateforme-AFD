import "server-only";

import { getOcrConfig } from "@/features/document-intelligence/config";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type {
  ExtractedField,
  ExtractedTable,
  ProviderAnalysisResult,
} from "@/features/document-intelligence/types";

/**
 * Adaptateur Azure Document Intelligence (Form Recognizer).
 * Utilise uniquement l’endpoint fourni par AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT.
 * API officielle : analyze prebuilt-layout (api-version 2024-11-30).
 */
export function createAzureProvider(): DocumentIntelligenceProvider {
  const cfg = getOcrConfig().azure;

  async function analyze(buffer: Buffer, mimeType: string): Promise<ProviderAnalysisResult> {
    const started = Date.now();
    if (!cfg.endpoint || !cfg.key) {
      throw new Error(
        "Azure Document Intelligence non configuré (AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT / KEY)",
      );
    }

    const base = cfg.endpoint.replace(/\/$/, "");
    const analyzeUrl = `${base}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2024-11-30`;

    const submit = await fetch(analyzeUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": cfg.key,
        "Content-Type": mimeType || "application/octet-stream",
      },
      body: new Uint8Array(buffer),
    });

    if (!submit.ok) {
      const errText = await submit.text().catch(() => "");
      throw new Error(
        `Azure DI analyze failed (${submit.status}): ${errText.slice(0, 200)}`,
      );
    }

    const operationLocation = submit.headers.get("operation-location");
    if (!operationLocation) {
      throw new Error("Azure DI : en-tête operation-location manquant");
    }

    let resultJson: Record<string, unknown> | null = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const poll = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": cfg.key },
      });
      const body = (await poll.json()) as {
        status?: string;
        analyzeResult?: Record<string, unknown>;
        error?: { message?: string };
      };
      if (body.status === "succeeded") {
        resultJson = body.analyzeResult ?? null;
        break;
      }
      if (body.status === "failed") {
        throw new Error(body.error?.message || "Azure DI failed");
      }
    }

    if (!resultJson) {
      throw new Error("Azure DI : timeout d’analyse");
    }

    const content = String(resultJson.content ?? "");
    const pagesRaw = (resultJson.pages as Array<{ pageNumber?: number }>) ?? [];
    const tablesRaw =
      (resultJson.tables as Array<{
        rowCount?: number;
        columnCount?: number;
        cells?: Array<{
          rowIndex: number;
          columnIndex: number;
          content?: string;
        }>;
        boundingRegions?: Array<{ pageNumber?: number }>;
      }>) ?? [];

    const kvRaw =
      (resultJson.keyValuePairs as Array<{
        key?: { content?: string };
        value?: { content?: string };
        confidence?: number;
      }>) ?? [];

    const tables: ExtractedTable[] = tablesRaw.map((t, idx) => {
      const rowsCount = t.rowCount ?? 0;
      const colsCount = t.columnCount ?? 0;
      const grid: string[][] = Array.from({ length: rowsCount }, () =>
        Array.from({ length: colsCount }, () => ""),
      );
      for (const cell of t.cells ?? []) {
        if (grid[cell.rowIndex]) {
          grid[cell.rowIndex][cell.columnIndex] = cell.content ?? "";
        }
      }
      return {
        name: `table_${idx + 1}`,
        page: t.boundingRegions?.[0]?.pageNumber ?? 1,
        headers: grid[0] ?? [],
        rows: grid.slice(1),
        confidence: 0.85,
      };
    });

    const keyValuePairs: ExtractedField[] = kvRaw
      .filter((kv) => kv.key?.content)
      .map((kv) => ({
        name: String(kv.key?.content),
        rawValue: String(kv.value?.content ?? ""),
        type: "string" as const,
        confidence: kv.confidence ?? 0.7,
        source: "ocr" as const,
      }));

    return {
      provider: "azure",
      modelVersion: "prebuilt-layout",
      processingMs: Date.now() - started,
      fullText: content,
      pages: pagesRaw.map((p, i) => ({
        pageNumber: p.pageNumber ?? i + 1,
        text: "",
        confidence: 0.85,
      })),
      fields: keyValuePairs,
      tables,
      keyValuePairs,
      requiresReview: true,
      signatureHints: {
        handwrittenDetected: false,
        stampDetected: false,
        digitalSignatureChecked: false,
      },
    };
  }

  return {
    analyzeDocument: (input) => analyze(input.buffer, input.mimeType),
    async getJobStatus(jobId) {
      return { id: jobId, status: "succeeded" };
    },
    async cancelJob() {},
    normalizeResult(raw) {
      return raw as ProviderAnalysisResult;
    },
    supportsFileType() {
      return Boolean(cfg.endpoint && cfg.key);
    },
    supportsTables: () => true,
    supportsKeyValuePairs: () => true,
    supportsSignatures: () => false,
    getProviderMetadata() {
      return {
        id: "azure",
        name: "Azure Document Intelligence",
        supportsTables: true,
        supportsKeyValuePairs: true,
        supportsSignatures: false,
        isCloud: true,
        limitations: [
          "Signature manuscrite ≠ signature numérique",
          "Révision humaine obligatoire avant application",
        ],
      };
    },
  };
}
