import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type OcrNotificationType =
  | "info"
  | "review_required"
  | "approved"
  | "rejected"
  | "applied"
  | "error";

export async function notifyOcrUser(
  supabase: SupabaseClient,
  input: {
    userId: string;
    documentId: string;
    type: OcrNotificationType;
    title: string;
    body?: string;
  },
) {
  await supabase.from("ocr_notifications" as never).insert({
    user_id: input.userId,
    document_id: input.documentId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
  } as never);
}

export async function listUnreadOcrNotifications(
  supabase: SupabaseClient,
  userId: string,
  limit = 20,
) {
  const { data } = await supabase
    .from("ocr_notifications" as never)
    .select("id, type, title, body, document_id, created_at, read_at")
    .eq("user_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
