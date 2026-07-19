import "server-only";

import Tesseract from "tesseract.js";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type { ProviderAnalysisResult } from "@/features/document-intelligence/types";
import { getOcrConfig } from "@/features/document-intelligence/config";

const LIMITS = [
  "Tesseract : texte simple uniquement",
  "Tableaux complexes non structurés de façon fiable",
  "Révision humaine obligatoire",
  "Ne remplace pas un fournisseur cloud pour rapports financiers",
];

export function createTesseractProvider(): DocumentIntelligenceProvider {
  return {
    async analyzeDocument(input) {
      const started = Date.now();
      const cfg = getOcrConfig();
      if (!input.mimeType.startsWith("image/") && input.mimeType !== "application/pdf") {
        return {
          provider: "tesseract",
          processingMs: Date.now() - started,
          fullText: "",
          pages: [],
          fields: [],
          tables: [],
          keyValuePairs: [],
          limits: [...LIMITS, "Type non supporté par Tesseract fallback"],
          requiresReview: true,
        };
      }

      // PDF scanné : Tesseract.js ne lit pas le PDF multipage nativement ici.
      if (input.mimeType === "application/pdf") {
        return {
          provider: "tesseract",
          processingMs: Date.now() - started,
          fullText: "",
          pages: [],
          fields: [],
          tables: [],
          keyValuePairs: [],
          limits: [
            ...LIMITS,
            "PDF scanné : conversion page→image non disponible dans ce fallback",
            "Échec partiel — ne pas présenter comme succès OCR",
          ],
          requiresReview: true,
        };
      }

      const lang = [cfg.defaultLanguage, ...cfg.secondaryLanguages]
        .filter(Boolean)
        .join("+");

      const result = await Tesseract.recognize(input.buffer, lang || "fra+eng", {
        logger: () => undefined,
      });

      const fullText = result.data.text.trim();
      const confidence = (result.data.confidence || 0) / 100;

      if (!fullText) {
        return {
          provider: "tesseract",
          processingMs: Date.now() - started,
          fullText: "",
          pages: [],
          fields: [],
          tables: [],
          keyValuePairs: [],
          limits: [...LIMITS, "Résultat vide — échec OCR"],
          requiresReview: true,
        };
      }

      return {
        provider: "tesseract",
        modelVersion: "tesseract.js",
        language: lang,
        processingMs: Date.now() - started,
        fullText,
        pages: [
          {
            pageNumber: 1,
            text: fullText,
            confidence,
          },
        ],
        fields: [],
        tables: [],
        keyValuePairs: [],
        limits: LIMITS,
        requiresReview: true,
        signatureHints: {
          handwrittenDetected: false,
          stampDetected: false,
          digitalSignatureChecked: false,
        },
      } satisfies ProviderAnalysisResult;
    },
    async getJobStatus(jobId) {
      return { id: jobId, status: "succeeded", progress: 100 };
    },
    async cancelJob() {},
    normalizeResult(raw) {
      return raw as ProviderAnalysisResult;
    },
    supportsFileType(mime) {
      return mime.startsWith("image/");
    },
    supportsTables: () => false,
    supportsKeyValuePairs: () => false,
    supportsSignatures: () => false,
    getProviderMetadata() {
      return {
        id: "tesseract",
        name: "Tesseract (fallback)",
        supportsTables: false,
        supportsKeyValuePairs: false,
        supportsSignatures: false,
        isCloud: false,
        limitations: LIMITS,
      };
    },
  };
}
