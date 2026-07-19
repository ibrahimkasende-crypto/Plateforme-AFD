import { z } from "zod";
import { PROVENANCE_SOURCES, SENSITIVITY_LEVELS } from "@/features/document-intelligence/types";

export const uploadDocumentMetaSchema = z.object({
  titre: z.string().trim().min(2).max(200),
  type_document: z.string().trim().min(2).max(80),
  module_source: z.string().trim().max(80).optional(),
  module_cible: z.string().trim().max(80).optional(),
  programme_id: z.string().uuid().optional().or(z.literal("")),
  projet_id: z.string().uuid().optional().or(z.literal("")),
  province_id: z.string().uuid().optional().or(z.literal("")),
  periode_debut: z.string().optional().or(z.literal("")),
  periode_fin: z.string().optional().or(z.literal("")),
  devise: z.string().trim().max(8).optional(),
  provenance_source: z.enum(PROVENANCE_SOURCES).default("import_admin"),
  classification_sensibilite: z.enum(SENSITIVITY_LEVELS).default("interne"),
  language: z.string().trim().max(10).optional(),
});

export type UploadDocumentMeta = z.infer<typeof uploadDocumentMetaSchema>;
