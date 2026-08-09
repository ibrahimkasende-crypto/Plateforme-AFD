"use server";

import type { Permission } from "@/config/permissions";
import {
  detectLanguageHint,
  extractContentFields,
} from "@/features/content-import/extractors/heuristic-extractor";
import type {
  ContentEntityType,
  ContentImportAnalysis,
} from "@/features/content-import/types";
import { getOcrConfig } from "@/features/document-intelligence/config";
import {
  getActiveOcrProvider,
  getFallbackProvider,
  getNativeProvider,
} from "@/features/document-intelligence/providers/registry";
import { requirePermission } from "@/lib/auth/require-permission";

const ENTITY_PERMISSION: Partial<Record<ContentEntityType, Permission>> = {
  projet: "projets:write",
  programme: "programmes:write",
  activite: "activites:write",
  actualite: "actualites:write",
};

function sniffMime(file: File): string {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".xlsx") || name.endsWith(".xls"))
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (name.endsWith(".csv")) return "text/csv";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".txt")) return "text/plain";
  return "application/octet-stream";
}

export async function analyzeContentImportAction(
  formData: FormData,
): Promise<{ ok: true; analysis: ContentImportAnalysis } | { ok: false; error: string }> {
  const entityType = String(formData.get("entityType") || "") as ContentEntityType;
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Aucun fichier fourni." };
  }

  const permission = ENTITY_PERMISSION[entityType] ?? "projets:write";
  await requirePermission(permission);

  const cfg = getOcrConfig();
  const maxBytes = cfg.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Fichier trop volumineux (max ${cfg.maxFileSizeMb} Mo).`,
    };
  }

  const mime = sniffMime(file);
  const buffer = Buffer.from(await file.arrayBuffer());
  const warnings: string[] = [];
  const input = {
    buffer,
    mimeType: mime,
    filename: file.name,
    language: cfg.defaultLanguage,
  };

  let result;
  try {
    const native = getNativeProvider();
    if (native.supportsFileType(mime)) {
      result = await native.analyzeDocument(input);
      if (
        (!result.fullText || result.fullText.trim().length < 40) &&
        mime === "application/pdf"
      ) {
        warnings.push("PDF peu textuel — tentative OCR / fournisseur actif…");
        const active = getActiveOcrProvider();
        if (active.getProviderMetadata().id !== "native") {
          result = await active.analyzeDocument(input);
        } else {
          result = await getFallbackProvider().analyzeDocument(input);
        }
      }
    } else if (mime.startsWith("image/")) {
      result = await getFallbackProvider().analyzeDocument(input);
      warnings.push("OCR image (Tesseract) — vérifiez les champs incertains.");
    } else if (mime === "text/plain") {
      const text = buffer.toString("utf8");
      result = {
        provider: "native",
        processingMs: 1,
        fullText: text,
        pages: [{ pageNumber: 1, text, confidence: 1 }],
        fields: [],
        tables: [],
        keyValuePairs: [],
        requiresReview: true,
      };
    } else {
      const active = getActiveOcrProvider();
      result = await active.analyzeDocument(input);
      if (!result.fullText?.trim()) {
        warnings.push(
          "Format partiellement supporté (PowerPoint/ZIP). Convertissez en PDF ou Word pour un meilleur résultat.",
        );
      }
    }
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Échec de l’analyse du document.",
    };
  }

  if (result.limits?.length) warnings.push(...result.limits);
  if (!result.fullText || result.fullText.trim().length < 20) {
    warnings.push(
      "Peu de texte extrait. Préférez un PDF textuel ou Word, ou activez Azure Document Intelligence pour les scans.",
    );
  }

  const language =
    result.language || detectLanguageHint(result.fullText || "");
  const fields = extractContentFields(entityType, result.fullText || "");

  return {
    ok: true,
    analysis: {
      entityType,
      language,
      provider: result.provider,
      processingMs: result.processingMs,
      fullTextPreview: (result.fullText || "").slice(0, 1200),
      fields,
      warnings,
      fileName: file.name,
    },
  };
}
