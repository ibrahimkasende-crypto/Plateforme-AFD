/**
 * Import intelligent de contenus éditoriaux / opérationnels.
 * Complète le hub OCR `/admin/import-intelligent` (finances…)
 * pour projets, programmes, activités, actualités, etc.
 */
export type {
  ContentEntityType,
  ContentImportAnalysis,
  ExtractedContentField,
} from "@/features/content-import/types";
export { CreationModeChooser } from "@/features/content-import/components/CreationModeChooser";
export { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
