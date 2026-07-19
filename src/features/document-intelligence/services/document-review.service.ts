import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getOcrConfig } from "@/features/document-intelligence/config";
import { notifyOcrUser } from "@/features/document-intelligence/services/document-notification.service";

export async function correctExtractedField(
  supabase: SupabaseClient,
  input: {
    fieldId: string;
    documentId: string;
    correctedValue: string;
    userId: string;
    action: "confirm" | "correct" | "ignore" | "missing";
  },
) {
  const reviewStatus =
    input.action === "confirm"
      ? "confirmed"
      : input.action === "ignore"
        ? "ignored"
        : input.action === "missing"
          ? "missing"
          : "corrected";

  await supabase
    .from("ocr_champs_extraits" as never)
    .update({
      corrected_value: input.correctedValue,
      corrected_by: input.userId,
      corrected_at: new Date().toISOString(),
      review_status: reviewStatus,
    } as never)
    .eq("id", input.fieldId)
    .eq("document_id", input.documentId);

  const { data: revisions } = await supabase
    .from("ocr_revisions" as never)
    .select("revision_number")
    .eq("document_id", input.documentId)
    .order("revision_number", { ascending: false })
    .limit(1);

  const last =
    Array.isArray(revisions) && revisions[0] && typeof revisions[0] === "object"
      ? Number((revisions[0] as { revision_number: number }).revision_number)
      : 0;

  await supabase.from("ocr_revisions" as never).insert({
    document_id: input.documentId,
    revision_number: last + 1,
    author_id: input.userId,
    changes: {
      fieldId: input.fieldId,
      action: input.action,
      correctedValue: input.correctedValue,
    },
  } as never);
}

export async function submitForApproval(
  supabase: SupabaseClient,
  documentId: string,
  userId: string,
) {
  const cfg = getOcrConfig();

  const { data: fields } = await supabase
    .from("ocr_champs_extraits" as never)
    .select("field_key, confidence, review_status, value_type, raw_value, corrected_value")
    .eq("document_id", documentId);

  const criticalKeys = new Set([
    "budget_prevu",
    "depenses",
    "solde",
    "montant_total",
    "stock_physique",
    "stock_theorique",
    "total",
  ]);

  for (const raw of fields ?? []) {
    const f = raw as {
      field_key: string;
      confidence: number | null;
      review_status: string;
      value_type: string;
    };
    const isCritical =
      criticalKeys.has(f.field_key) ||
      f.value_type === "currency" ||
      f.value_type === "number";
    if (
      isCritical &&
      (f.confidence ?? 0) < cfg.minConfidence &&
      f.review_status === "pending"
    ) {
      throw new Error(
        `Champ critique « ${f.field_key} » à faible confiance — correction obligatoire avant soumission.`,
      );
    }
  }

  await supabase
    .from("documents_importes" as never)
    .update({
      status: "needs_review",
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq("id", documentId);

  await supabase.from("ocr_approbations" as never).insert({
    document_id: documentId,
    status: "pending",
    comment: "Soumis pour validation métier",
  } as never);
}

export async function approveDocument(
  supabase: SupabaseClient,
  input: {
    documentId: string;
    approverId: string;
    uploaderId: string | null;
    comment?: string;
  },
) {
  const { data: doc } = await supabase
    .from("documents_importes" as never)
    .select("uploaded_by, status")
    .eq("id", input.documentId)
    .single();

  const uploadedBy =
    doc && typeof doc === "object" && "uploaded_by" in doc
      ? (doc as { uploaded_by: string | null }).uploaded_by
      : null;

  // Double validation financière : l'importateur ne peut pas tout valider seul
  if (uploadedBy && uploadedBy === input.approverId) {
    const { data: d2 } = await supabase
      .from("documents_importes" as never)
      .select("module_cible, type_document")
      .eq("id", input.documentId)
      .single();
    const targetModule =
      d2 && typeof d2 === "object" && "module_cible" in d2
        ? String((d2 as { module_cible: string | null }).module_cible ?? "")
        : "";
    const type =
      d2 && typeof d2 === "object" && "type_document" in d2
        ? String((d2 as { type_document: string }).type_document)
        : "";
    const isFinancial =
      targetModule.includes("finance") ||
      targetModule.includes("depenses") ||
      targetModule.includes("budget") ||
      type.includes("financ") ||
      type.includes("facture");
    if (isFinancial) {
      throw new Error(
        "Validation financière : l’importateur ne peut pas approuver seul ce document.",
      );
    }
  }

  await supabase
    .from("documents_importes" as never)
    .update({
      status: "approved",
      approved_by: input.approverId,
      approved_at: new Date().toISOString(),
    } as never)
    .eq("id", input.documentId);

  await supabase.from("ocr_approbations" as never).insert({
    document_id: input.documentId,
    approver_id: input.approverId,
    status: "approved",
    comment: input.comment ?? null,
    approved_at: new Date().toISOString(),
  } as never);

  if (uploadedBy) {
    await notifyOcrUser(supabase, {
      userId: uploadedBy,
      documentId: input.documentId,
      type: "approved",
      title: "Document approuvé",
      body: "Vous pouvez préparer le plan d’application des données.",
    });
  }
}

export async function rejectDocument(
  supabase: SupabaseClient,
  input: {
    documentId: string;
    approverId: string;
    comment: string;
  },
) {
  await supabase
    .from("documents_importes" as never)
    .update({
      status: "rejected",
      approved_by: input.approverId,
      approved_at: new Date().toISOString(),
      error_message: input.comment,
    } as never)
    .eq("id", input.documentId);

  await supabase.from("ocr_approbations" as never).insert({
    document_id: input.documentId,
    approver_id: input.approverId,
    status: "rejected",
    comment: input.comment,
    approved_at: new Date().toISOString(),
  } as never);

  const { data: doc } = await supabase
    .from("documents_importes" as never)
    .select("uploaded_by")
    .eq("id", input.documentId)
    .single();
  const uploadedBy =
    doc && typeof doc === "object" && "uploaded_by" in doc
      ? (doc as { uploaded_by: string | null }).uploaded_by
      : null;
  if (uploadedBy) {
    await notifyOcrUser(supabase, {
      userId: uploadedBy,
      documentId: input.documentId,
      type: "rejected",
      title: "Document rejeté",
      body: input.comment,
    });
  }
}
