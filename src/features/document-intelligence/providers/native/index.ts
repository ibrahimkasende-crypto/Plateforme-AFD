import "server-only";

import ExcelJS from "exceljs";
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type {
  ExtractedField,
  ExtractedTable,
  ProviderAnalysisResult,
} from "@/features/document-intelligence/types";

function emptyResult(
  provider: string,
  processingMs: number,
  limits: string[],
): ProviderAnalysisResult {
  return {
    provider,
    processingMs,
    fullText: "",
    pages: [],
    fields: [],
    tables: [],
    keyValuePairs: [],
    limits,
    requiresReview: true,
  };
}

async function extractPdf(buffer: Buffer): Promise<ProviderAnalysisResult> {
  const started = Date.now();
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text, totalPages } = await extractText(pdf, { mergePages: false });
  const pagesText = Array.isArray(text) ? text : [String(text)];
  const fullText = pagesText.join("\n\n").trim();
  const pages = pagesText.map((t, i) => ({
    pageNumber: i + 1,
    text: t,
    confidence: fullText.length > 40 ? 0.92 : 0.4,
  }));

  return {
    provider: "native",
    modelVersion: "unpdf",
    language: "fr",
    processingMs: Date.now() - started,
    fullText,
    pages,
    fields: [],
    tables: [],
    keyValuePairs: [],
    limits:
      fullText.length < 40
        ? ["PDF peu textuel — OCR recommandé"]
        : undefined,
    requiresReview: true,
    pageCountHint: totalPages,
  } as ProviderAnalysisResult & { pageCountHint?: number };
}

async function extractDocx(buffer: Buffer): Promise<ProviderAnalysisResult> {
  const started = Date.now();
  const result = await mammoth.extractRawText({ buffer });
  const fullText = result.value.trim();
  return {
    provider: "native",
    modelVersion: "mammoth",
    processingMs: Date.now() - started,
    fullText,
    pages: [{ pageNumber: 1, text: fullText, confidence: 0.95 }],
    fields: [],
    tables: [],
    keyValuePairs: [],
    limits: result.messages.length
      ? result.messages.map((m) => m.message)
      : undefined,
    requiresReview: true,
  };
}

async function extractXlsx(buffer: Buffer): Promise<ProviderAnalysisResult> {
  const started = Date.now();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ArrayBuffer);
  const tables: ExtractedTable[] = [];
  const fields: ExtractedField[] = [];
  const textParts: string[] = [];

  wb.eachSheet((sheet, sheetId) => {
    const rows: string[][] = [];
    sheet.eachRow((row, rowNumber) => {
      const values = row.values as Array<string | number | null | undefined>;
      const cells = values.slice(1).map((v) => (v == null ? "" : String(v)));
      rows.push(cells);
      textParts.push(cells.join("\t"));
      if (rowNumber === 1) return;
    });
    if (rows.length) {
      tables.push({
        name: sheet.name,
        page: sheetId,
        headers: rows[0] ?? [],
        rows: rows.slice(1),
        confidence: 0.97,
      });
    }
  });

  return {
    provider: "native",
    modelVersion: "exceljs",
    processingMs: Date.now() - started,
    fullText: textParts.join("\n"),
    pages: [{ pageNumber: 1, text: textParts.join("\n"), confidence: 0.97 }],
    fields,
    tables,
    keyValuePairs: [],
    requiresReview: true,
  };
}

function extractCsv(buffer: Buffer): ProviderAnalysisResult {
  const started = Date.now();
  const text = buffer.toString("utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows = lines.map((line) => line.split(/[;,]/));
  const tables: ExtractedTable[] = rows.length
    ? [
        {
          name: "csv",
          page: 1,
          headers: rows[0] ?? [],
          rows: rows.slice(1),
          confidence: 0.98,
        },
      ]
    : [];

  return {
    provider: "native",
    modelVersion: "csv",
    processingMs: Date.now() - started,
    fullText: text,
    pages: [{ pageNumber: 1, text, confidence: 0.98 }],
    fields: [],
    tables,
    keyValuePairs: [],
    requiresReview: true,
  };
}

export function createNativeProvider(): DocumentIntelligenceProvider {
  return {
    async analyzeDocument(input) {
      const mime = input.mimeType.toLowerCase();
      if (mime === "application/pdf") return extractPdf(input.buffer);
      if (mime.includes("wordprocessingml")) return extractDocx(input.buffer);
      if (mime.includes("spreadsheetml")) return extractXlsx(input.buffer);
      if (mime === "text/csv" || mime === "application/csv") {
        return extractCsv(input.buffer);
      }
      return emptyResult("native", 0, ["Type non supporté par extraction native"]);
    },
    async getJobStatus(jobId) {
      return { id: jobId, status: "succeeded", progress: 100 };
    },
    async cancelJob() {
      /* sync */
    },
    normalizeResult(raw) {
      return raw as ProviderAnalysisResult;
    },
    supportsFileType(mimeType) {
      return (
        mimeType === "application/pdf" ||
        mimeType.includes("wordprocessingml") ||
        mimeType.includes("spreadsheetml") ||
        mimeType === "text/csv" ||
        mimeType === "application/csv"
      );
    },
    supportsTables: () => true,
    supportsKeyValuePairs: () => false,
    supportsSignatures: () => false,
    getProviderMetadata() {
      return {
        id: "native",
        name: "Extraction native",
        supportsTables: true,
        supportsKeyValuePairs: false,
        supportsSignatures: false,
        isCloud: false,
        limitations: [
          "Pas d’OCR sur images / PDF scannés",
          "Tableaux PDF complexes limités",
        ],
      };
    },
  };
}
