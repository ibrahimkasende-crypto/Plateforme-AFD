"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { uploadDocumentMetaSchema } from "@/features/document-intelligence/schemas/upload.schema";
import { uploadImportedDocument } from "@/features/document-intelligence/services/document-upload.service";
import { processOcrJobById } from "@/features/document-intelligence/services/document-processing.service";

export type UploadActionState = {
  ok: boolean;
  message?: string;
  documentId?: string;
};

export async function uploadOcrDocumentAction(
  _prev: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  await requirePermission("ocr.upload");

  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: false, message: "Supabase indisponible." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Session requise." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Fichier requis." };
  }

  const parsed = uploadDocumentMetaSchema.safeParse({
    titre: formData.get("titre"),
    type_document: formData.get("type_document"),
    module_source: formData.get("module_source") || undefined,
    module_cible: formData.get("module_cible") || undefined,
    programme_id: formData.get("programme_id") || undefined,
    projet_id: formData.get("projet_id") || undefined,
    province_id: formData.get("province_id") || undefined,
    periode_debut: formData.get("periode_debut") || undefined,
    periode_fin: formData.get("periode_fin") || undefined,
    devise: formData.get("devise") || undefined,
    provenance_source: formData.get("provenance_source") || "import_admin",
    classification_sensibilite:
      formData.get("classification_sensibilite") || "interne",
    language: formData.get("language") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: "Métadonnées invalides." };
  }

  let documentId = "";
  try {
    const result = await uploadImportedDocument(supabase, {
      file,
      meta: parsed.data,
      userId: user.id,
    });
    documentId = result.documentId;

    after(async () => {
      try {
        const client = await createClientSafe();
        if (!client) return;
        const { data: job } = await client
          .from("ocr_jobs" as never)
          .select("id")
          .eq("document_id", documentId)
          .eq("status", "queued")
          .maybeSingle();
        if (!job || typeof job !== "object" || !("id" in job)) return;
        await processOcrJobById(client, String((job as { id: string }).id));
      } catch {
        // Repris par scripts/ocr-worker.ts ou /api/ocr/process
      }
    });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Échec de l’import.",
    };
  }

  redirect(`/admin/import-intelligent/${documentId}`);
}
