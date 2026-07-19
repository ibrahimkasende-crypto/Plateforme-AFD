import type { ProviderAnalysisResult } from "@/features/document-intelligence/types";

export type AnalyzeDocumentInput = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  language?: string;
};

export type ProviderJobStatus = {
  id: string;
  status: "queued" | "processing" | "succeeded" | "failed" | "cancelled";
  progress?: number;
  error?: string;
};

export type ProviderMetadata = {
  id: string;
  name: string;
  supportsTables: boolean;
  supportsKeyValuePairs: boolean;
  supportsSignatures: boolean;
  isCloud: boolean;
  limitations: string[];
};

export interface DocumentIntelligenceProvider {
  analyzeDocument(input: AnalyzeDocumentInput): Promise<ProviderAnalysisResult>;
  getJobStatus(jobId: string): Promise<ProviderJobStatus>;
  cancelJob(jobId: string): Promise<void>;
  normalizeResult(raw: unknown): ProviderAnalysisResult;
  supportsFileType(mimeType: string): boolean;
  supportsTables(): boolean;
  supportsKeyValuePairs(): boolean;
  supportsSignatures(): boolean;
  getProviderMetadata(): ProviderMetadata;
}
