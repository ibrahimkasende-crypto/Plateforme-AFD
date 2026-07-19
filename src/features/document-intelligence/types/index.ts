export const DOCUMENT_STATUSES = [
  "uploaded",
  "security_check",
  "queued",
  "processing",
  "extracted",
  "needs_review",
  "inconsistent",
  "suspicious",
  "approved",
  "rejected",
  "applying",
  "applied",
  "failed",
  "archived",
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const INTEGRITY_STATUSES = [
  "cryptographically_verified",
  "signature_valid_but_untrusted",
  "signature_invalid",
  "modified_after_signature",
  "unsigned",
  "verification_unavailable",
  "document_non_verifie",
  "document_necessitant_verification",
  "document_suspect",
  "document_rejete",
] as const;

export type IntegrityStatus = (typeof INTEGRITY_STATUSES)[number];

export const PROVENANCE_SOURCES = [
  "produit_interne",
  "partenaire",
  "email",
  "physique",
  "import_admin",
  "genere_plateforme",
  "inconnue",
] as const;

export type ProvenanceSource = (typeof PROVENANCE_SOURCES)[number];

export const SENSITIVITY_LEVELS = [
  "public",
  "interne",
  "sensible",
  "confidentiel",
  "strictement_confidentiel",
] as const;

export type SensitivityLevel = (typeof SENSITIVITY_LEVELS)[number];

export const ANOMALY_LEVELS = ["info", "warning", "high", "critical"] as const;
export type AnomalyLevel = (typeof ANOMALY_LEVELS)[number];

export const ANOMALY_STATUSES = [
  "detected",
  "under_review",
  "justified",
  "corrected",
  "rejected",
  "resolved",
  "false_positive",
] as const;
export type AnomalyStatus = (typeof ANOMALY_STATUSES)[number];

export const FIELD_VALUE_TYPES = [
  "string",
  "integer",
  "decimal",
  "currency",
  "percentage",
  "date",
  "boolean",
  "reference",
  "email",
  "phone",
  "location",
  "table",
] as const;
export type FieldValueType = (typeof FIELD_VALUE_TYPES)[number];

export type BoundingBox = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExtractedField = {
  name: string;
  rawValue: string;
  normalizedValue?: string | number | boolean | null;
  type: FieldValueType;
  page?: number;
  boundingBox?: BoundingBox;
  confidence: number;
  source: "native" | "ocr" | "user" | "rule";
  reviewStatus?: "pending" | "confirmed" | "corrected" | "ignored" | "missing";
  correctedValue?: string | null;
};

export type ExtractedTable = {
  name?: string;
  page: number;
  headers: string[];
  rows: string[][];
  confidence: number;
};

export type ExtractedPage = {
  pageNumber: number;
  text: string;
  confidence: number;
  width?: number;
  height?: number;
};

export type ProviderAnalysisResult = {
  provider: string;
  modelVersion?: string;
  language?: string;
  processingMs: number;
  fullText: string;
  pages: ExtractedPage[];
  fields: ExtractedField[];
  tables: ExtractedTable[];
  keyValuePairs: ExtractedField[];
  limits?: string[];
  requiresReview: boolean;
  signatureHints?: {
    handwrittenDetected: boolean;
    stampDetected: boolean;
    /** Jamais une preuve cryptographique. */
    digitalSignatureChecked: boolean;
  };
};

export type ApplicationPlanLine = {
  action: "create" | "update" | "skip";
  targetTable: string;
  targetId?: string;
  payload: Record<string, unknown>;
  previousValues?: Record<string, unknown>;
  sourceFieldNames: string[];
  conflict?: string;
};

export type ApplicationPlan = {
  documentId: string;
  lines: ApplicationPlanLine[];
  warnings: string[];
  blocked: boolean;
};

export type DocumentsImporteRow = {
  id: string;
  titre: string;
  type_document: string;
  module_source: string | null;
  module_cible: string | null;
  programme_id: string | null;
  projet_id: string | null;
  province_id: string | null;
  periode_debut: string | null;
  periode_fin: string | null;
  bucket: string;
  storage_path: string;
  original_filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  page_count: number | null;
  language: string | null;
  status: DocumentStatus;
  processing_progress: number;
  ocr_provider: string | null;
  hash_sha256: string | null;
  duplicate_of_id: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  applied_at: string | null;
  archived_at: string | null;
  classification_sensibilite: SensitivityLevel;
  provenance_source: string | null;
  devise: string | null;
  integrity_status: string | null;
  provenance_confidence: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
