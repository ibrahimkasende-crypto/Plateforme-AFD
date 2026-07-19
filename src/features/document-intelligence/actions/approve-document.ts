"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  approveDocument,
  rejectDocument,
} from "@/features/document-intelligence/services/document-review.service";

export async function approveOcrDocumentAction(formData: FormData): Promise<void> {
  await requirePermission("ocr.approve");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  const comment = String(formData.get("comment") || "");

  try {
    await approveDocument(supabase, {
      documentId,
      approverId: user.id,
      uploaderId: null,
      comment,
    });
    revalidatePath(`/admin/import-intelligent/${documentId}`);
  } catch {
    // erreur métier (ex. auto-approbation finance)
  }
}

export async function rejectOcrDocumentAction(formData: FormData): Promise<void> {
  await requirePermission("ocr.reject");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  const comment = String(formData.get("comment") || "Rejeté");

  await rejectDocument(supabase, {
    documentId,
    approverId: user.id,
    comment,
  });
  revalidatePath(`/admin/import-intelligent/${documentId}`);
}
