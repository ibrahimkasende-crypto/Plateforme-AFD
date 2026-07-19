import "server-only";

import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { OCR_BUCKET, getOcrConfig } from "@/features/document-intelligence/config";
import type { UploadDocumentMeta } from "@/features/document-intelligence/schemas/upload.schema";
import {
  assessPdfIntegrity,
  computeAndStoreFingerprint,
} from "@/features/document-intelligence/services/document-integrity.service";
import { notifyOcrUser } from "@/features/document-intelligence/services/document-notification.service";
import {
  isAllowedMimeAndExtension,
  sanitizeFilename,
} from "@/features/document-intelligence/utils/mime";

function emptyToNull(v: string | undefined): string | null {
  if (!v || !v.trim()) return null;
  return v.trim();
}

export async function uploadImportedDocument(
  supabase: SupabaseClient,
  input: {
    file: File;
    meta: UploadDocumentMeta;
    userId: string;
  },
) {
  const cfg = getOcrConfig();
  const filename = sanitizeFilename(input.file.name);
  const mimeType = input.file.type || "application/octet-stream";
  const sizeBytes = input.file.size;
  const maxBytes = cfg.maxFileSizeMb * 1024 * 1024;

  if (sizeBytes <= 0 || sizeBytes > maxBytes) {
    throw new Error(`Fichier trop volumineux (max ${cfg.maxFileSizeMb} Mo).`);
  }
  if (!isAllowedMimeAndExtension(mimeType, filename)) {
    throw new Error("Format non autorisé ou extension incohérente.");
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const documentId = randomUUID();
  const year = new Date().getFullYear();
  const storagePath = `ocr/${cfg.organisationId}/${year}/${documentId}/original/${filename}`;

  const integrity = await assessPdfIntegrity(buffer, mimeType);

  const { error: uploadError } = await supabase.storage
    .from(OCR_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Échec upload Storage : ${uploadError.message}`);
  }

  const row = {
    id: documentId,
    titre: input.meta.titre,
    type_document: input.meta.type_document,
    module_source: emptyToNull(input.meta.module_source) ?? "import-intelligent",
    module_cible: emptyToNull(input.meta.module_cible),
    programme_id: emptyToNull(input.meta.programme_id),
    projet_id: emptyToNull(input.meta.projet_id),
    province_id: emptyToNull(input.meta.province_id),
    periode_debut: emptyToNull(input.meta.periode_debut),
    periode_fin: emptyToNull(input.meta.periode_fin),
    bucket: OCR_BUCKET,
    storage_path: storagePath,
    original_filename: filename,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    language: input.meta.language || cfg.defaultLanguage,
    status: "security_check",
    processing_progress: 5,
    uploaded_by: input.userId,
    classification_sensibilite: input.meta.classification_sensibilite,
    provenance_source: input.meta.provenance_source,
    devise: input.meta.devise || "USD",
    integrity_status: integrity.integrityStatus,
    provenance_confidence: input.meta.provenance_source === "produit_interne" ? 0.8 : 0.45,
  };

  const { error: insertError } = await supabase
    .from("documents_importes" as never)
    .insert(row as never);

  if (insertError) {
    await supabase.storage.from(OCR_BUCKET).remove([storagePath]);
    throw new Error(`Échec enregistrement : ${insertError.message}`);
  }

  const { hash, duplicateOfId } = await computeAndStoreFingerprint(
    supabase,
    documentId,
    buffer,
  );

  if (duplicateOfId) {
    await supabase
      .from("documents_importes" as never)
      .update({
        duplicate_of_id: duplicateOfId,
        status: "suspicious",
        error_message: "Doublon exact détecté (même empreinte SHA-256).",
      } as never)
      .eq("id", documentId);

    await supabase.from("ocr_anomalies" as never).insert({
      document_id: documentId,
      anomaly_type: "duplicate",
      message: `Doublon exact du document ${duplicateOfId}`,
      severity: "error",
      status: "open",
      details: { duplicate_of_id: duplicateOfId, hash },
    } as never);
  }

  await supabase.from("document_versions" as never).insert({
    document_id: documentId,
    version_number: 1,
    storage_path: storagePath,
    hash_sha256: hash,
    mime_type: mimeType,
    size_bytes: sizeBytes,
    created_by: input.userId,
    comment: "Original — ne jamais écraser",
  } as never);

  await supabase.from("document_provenance" as never).insert({
    document_id: documentId,
    source_type: "upload",
    declared_source: input.meta.provenance_source,
    confidence: row.provenance_confidence,
    responsible_user_id: input.userId,
    metadata: { integrity_notes: integrity.notes },
  } as never);

  await supabase.from("document_signatures" as never).insert({
    document_id: documentId,
    signature_type: "autre",
    is_digital: integrity.digitalChecked && integrity.integrityStatus !== "unsigned",
    crypto_status: integrity.integrityStatus,
    verified: false,
    metadata: {
      note: "Une signature manuscrite ou un cachet OCR ne prouve pas l’authenticité.",
      notes: integrity.notes,
    },
  } as never);

  if (!duplicateOfId) {
    await supabase
      .from("documents_importes" as never)
      .update({ status: "queued", processing_progress: 10 } as never)
      .eq("id", documentId);

    await supabase.from("ocr_jobs" as never).insert({
      document_id: documentId,
      status: "queued",
      provider: cfg.provider,
      priority: 0,
      payload: { filename, mimeType },
    } as never);
  }

  await notifyOcrUser(supabase, {
    userId: input.userId,
    documentId,
    type: duplicateOfId ? "error" : "info",
    title: duplicateOfId ? "Doublon détecté" : "Document importé",
    body: duplicateOfId
      ? "Empreinte SHA-256 déjà connue — révision requise."
      : "Document mis en file d’attente OCR.",
  });

  return { documentId, hash, duplicateOfId, storagePath };
}
