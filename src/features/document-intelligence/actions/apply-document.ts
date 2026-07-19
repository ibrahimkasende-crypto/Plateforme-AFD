"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  applyApplicationPlan,
  buildApplicationPlan,
  rollbackApplication,
} from "@/features/document-intelligence/services/document-application.service";

export async function getApplicationPlanAction(documentId: string) {
  await requirePermission("ocr.apply");
  const supabase = await createClientSafe();
  if (!supabase) throw new Error("Supabase indisponible");
  return buildApplicationPlan(supabase, documentId);
}

export async function applyOcrDocumentAction(formData: FormData): Promise<void> {
  await requirePermission("ocr.apply");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  const confirm = formData.get("confirm") === "1";

  try {
    await applyApplicationPlan(supabase, {
      documentId,
      userId: user.id,
      confirm,
    });
    revalidatePath(`/admin/import-intelligent/${documentId}`);
    revalidatePath("/admin/import-intelligent");
  } catch {
    // plan bloqué / confirmation manquante
  }
}

export async function rollbackOcrDocumentAction(formData: FormData): Promise<void> {
  await requirePermission("ocr.rollback_import");
  const supabase = await createClientSafe();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const documentId = String(formData.get("documentId") || "");
  try {
    await rollbackApplication(supabase, { documentId, userId: user.id });
    revalidatePath(`/admin/import-intelligent/${documentId}`);
  } catch {
    // aucune application
  }
}
