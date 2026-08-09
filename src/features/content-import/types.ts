/**
 * Import intelligent de contenus métier (projets, programmes, activités…).
 * Réutilise le moteur OCR natif (document-intelligence) + extraction heuristique.
 * Aucune publication sans validation utilisateur.
 */

export type ContentEntityType =
  | "projet"
  | "programme"
  | "activite"
  | "actualite"
  | "appel_offres"
  | "rapport"
  | "histoire_impact"
  | "partenaire"
  | "bibliotheque"
  | "document";

export type FieldConfidence = "recognized" | "uncertain" | "missing";

export type ExtractedContentField = {
  key: string;
  label: string;
  value: string;
  confidence: FieldConfidence;
  score: number;
  sourceHint?: string;
};

export type ContentImportAnalysis = {
  entityType: ContentEntityType;
  language: string;
  provider: string;
  processingMs: number;
  fullTextPreview: string;
  fields: ExtractedContentField[];
  warnings: string[];
  fileName: string;
};

export type ContentImportWizardStep =
  | "import"
  | "analyse"
  | "extraction"
  | "correction"
  | "publication";

export const CONTENT_IMPORT_STEPS: {
  id: ContentImportWizardStep;
  label: string;
  order: number;
}[] = [
  { id: "import", label: "Importer", order: 1 },
  { id: "analyse", label: "Analyse", order: 2 },
  { id: "extraction", label: "Extraction", order: 3 },
  { id: "correction", label: "Correction", order: 4 },
  { id: "publication", label: "Publication", order: 5 },
];
