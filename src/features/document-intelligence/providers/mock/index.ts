import "server-only";

import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type { ProviderAnalysisResult } from "@/features/document-intelligence/types";

/** Mock réservé aux tests — jamais en production. */
export function createMockProvider(): DocumentIntelligenceProvider {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Mock OCR interdit en production");
  }

  return {
    async analyzeDocument(input) {
      const started = Date.now();
      const text = `MOCK EXTRACTION\nFichier: ${input.filename}\nBudget prévu: 1.250,50 USD\nDépenses: 800,00 USD\nSolde: 450,50 USD\nPériode: 01/01/2026 - 31/03/2026`;
      return {
        provider: "mock",
        modelVersion: "test",
        processingMs: Date.now() - started,
        fullText: text,
        pages: [{ pageNumber: 1, text, confidence: 0.99 }],
        fields: [
          {
            name: "budget_prevu",
            rawValue: "1.250,50 USD",
            type: "currency",
            confidence: 0.99,
            source: "ocr",
          },
          {
            name: "depenses",
            rawValue: "800,00 USD",
            type: "currency",
            confidence: 0.98,
            source: "ocr",
          },
          {
            name: "solde",
            rawValue: "450,50 USD",
            type: "currency",
            confidence: 0.97,
            source: "ocr",
          },
        ],
        tables: [
          {
            name: "lignes",
            page: 1,
            headers: ["libelle", "montant"],
            rows: [
              ["Formation", "500"],
              ["Transport", "300"],
            ],
            confidence: 0.95,
          },
        ],
        keyValuePairs: [],
        requiresReview: true,
      } satisfies ProviderAnalysisResult;
    },
    async getJobStatus(jobId) {
      return { id: jobId, status: "succeeded", progress: 100 };
    },
    async cancelJob() {},
    normalizeResult(raw) {
      return raw as ProviderAnalysisResult;
    },
    supportsFileType: () => true,
    supportsTables: () => true,
    supportsKeyValuePairs: () => true,
    supportsSignatures: () => false,
    getProviderMetadata() {
      return {
        id: "mock",
        name: "Mock (tests)",
        supportsTables: true,
        supportsKeyValuePairs: true,
        supportsSignatures: false,
        isCloud: false,
        limitations: ["Tests uniquement"],
      };
    },
  };
}
