import "server-only";

export type OcrProviderId =
  | "native"
  | "tesseract"
  | "azure"
  | "google"
  | "aws"
  | "mock";

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function boolEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return raw === "1" || raw.toLowerCase() === "true";
}

export function getOcrConfig() {
  const provider = (process.env.OCR_PROVIDER?.trim().toLowerCase() ||
    "native") as OcrProviderId;

  const allowMock =
    process.env.NODE_ENV === "test" ||
    (provider === "mock" && process.env.NODE_ENV !== "production");

  return {
    provider: provider === "mock" && !allowMock ? ("native" as const) : provider,
    allowMock,
    maxFileSizeMb: numEnv("OCR_MAX_FILE_SIZE_MB", 25),
    maxPages: numEnv("OCR_MAX_PAGES", 100),
    defaultLanguage: process.env.OCR_DEFAULT_LANGUAGE?.trim() || "fr",
    secondaryLanguages: (process.env.OCR_SECONDARY_LANGUAGES || "en")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    minConfidence: numEnv("OCR_MIN_CONFIDENCE", 0.75),
    enableTableExtraction: boolEnv("OCR_ENABLE_TABLE_EXTRACTION", true),
    enableSignatureDetection: boolEnv("OCR_ENABLE_SIGNATURE_DETECTION", true),
    organisationId: process.env.OCR_ORGANISATION_ID?.trim() || "afd-asbl",
    workerSecret: process.env.OCR_WORKER_SECRET?.trim() || "",
    azure: {
      endpoint: process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT?.trim() || "",
      key: process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY?.trim() || "",
    },
    google: {
      projectId: process.env.GOOGLE_DOCUMENT_AI_PROJECT_ID?.trim() || "",
      location: process.env.GOOGLE_DOCUMENT_AI_LOCATION?.trim() || "",
      processorId: process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID?.trim() || "",
      credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || "",
    },
    aws: {
      region: process.env.AWS_TEXTRACT_REGION?.trim() || "",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID?.trim() || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.trim() || "",
    },
  };
}

export const OCR_BUCKET = "documents-ocr-prives";

export const ALLOWED_TARGET_TABLES = [
  "finances_depenses",
  "finances_budgets",
  "activites",
  "beneficiaires_agregats",
  "rapports_generes",
] as const;

export type AllowedTargetTable = (typeof ALLOWED_TARGET_TABLES)[number];
