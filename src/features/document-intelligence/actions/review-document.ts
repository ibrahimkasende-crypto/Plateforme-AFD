"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  correctExtractedField,
  submitForApproval,
} from "@/features/document-intelligence/services/document-review.service";

export async function correctOcrFieldAction(formData: FormData) {
  await requirePermission("ocr.review");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  const fieldId = String(formData.get("fieldId") || "");
  const correctedValue = String(formData.get("correctedValue") || "");
  const action = String(formData.get("action") || "correct") as
    | "confirm"
    | "correct"
    | "ignore"
    | "missing";

  await correctExtractedField(supabase, {
    documentId,
    fieldId,
    correctedValue,
    userId: user.id,
    action,
  });

  revalidatePath(`/admin/import-intelligent/${documentId}`);
  revalidatePath(`/admin/import-intelligent/${documentId}/revision`);
  revalidatePath(`/admin/import-intelligent/${documentId}/donnees`);
}

export async function submitOcrForApprovalAction(formData: FormData): Promise<void> {
  await requirePermission("ocr.review");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  try {
    await submitForApproval(supabase, documentId, user.id);
    revalidatePath(`/admin/import-intelligent/${documentId}`);
  } catch {
    // message affiché via toast ultérieur / page detail
  }
}
