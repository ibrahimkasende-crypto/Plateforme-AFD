import "server-only";

import { getOcrConfig } from "@/features/document-intelligence/config";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type { ProviderAnalysisResult } from "@/features/document-intelligence/types";

/**
 * Adaptateur Google Document AI.
 * Ne fabrique aucun endpoint. Active uniquement si les variables officielles sont présentes.
 * L’intégration SDK complète nécessite @google-cloud/documentai (non forcée ici).
 */
export function createGoogleProvider(): DocumentIntelligenceProvider {
  const cfg = getOcrConfig().google;

  return {
    async analyzeDocument() {
      if (!cfg.projectId || !cfg.location || !cfg.processorId) {
        throw new Error(
          "Google Document AI non configuré (GOOGLE_DOCUMENT_AI_PROJECT_ID / LOCATION / PROCESSOR_ID)",
        );
      }
      throw new Error(
        "Google Document AI : SDK officiel à brancher (@google-cloud/documentai). Configuration détectée mais adaptateur non activé sans SDK.",
      );
    },
    async getJobStatus(jobId) {
      return { id: jobId, status: "failed", error: "not_configured" };
    },
    async cancelJob() {},
    normalizeResult(raw) {
      return raw as ProviderAnalysisResult;
    },
    supportsFileType: () => false,
    supportsTables: () => true,
    supportsKeyValuePairs: () => true,
    supportsSignatures: () => false,
    getProviderMetadata() {
      return {
        id: "google",
        name: "Google Document AI",
        supportsTables: true,
        supportsKeyValuePairs: true,
        supportsSignatures: false,
        isCloud: true,
        limitations: ["Requiert SDK officiel et credentials GCP"],
      };
    },
  };
}
