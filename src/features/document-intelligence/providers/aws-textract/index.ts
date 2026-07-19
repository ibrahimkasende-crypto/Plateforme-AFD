import "server-only";

import { getOcrConfig } from "@/features/document-intelligence/config";
import type { DocumentIntelligenceProvider } from "@/features/document-intelligence/providers/types";
import type { ProviderAnalysisResult } from "@/features/document-intelligence/types";

/**
 * Adaptateur AWS Textract — non inventé d’endpoints.
 * Nécessite @aws-sdk/client-textract + credentials.
 */
export function createAwsTextractProvider(): DocumentIntelligenceProvider {
  const cfg = getOcrConfig().aws;

  return {
    async analyzeDocument() {
      if (!cfg.region || !cfg.accessKeyId || !cfg.secretAccessKey) {
        throw new Error(
          "AWS Textract non configuré (AWS_TEXTRACT_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)",
        );
      }
      throw new Error(
        "AWS Textract : SDK officiel à brancher (@aws-sdk/client-textract). Configuration détectée mais adaptateur non activé sans SDK.",
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
        id: "aws",
        name: "AWS Textract",
        supportsTables: true,
        supportsKeyValuePairs: true,
        supportsSignatures: false,
        isCloud: true,
        limitations: ["Requiert SDK AWS officiel"],
      };
    },
  };
}
