import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  input: {
    type: string;
    titre: string;
    message: string;
    recipientUserIds: string[];
    module?: string;
    entityType?: string;
    entityId?: string;
    priorite?: "basse" | "normale" | "haute" | "critique";
    lien?: string;
  },
) {
  const { data, error } = await supabase
    .from("notifications" as never)
    .insert({
      type: input.type,
      titre: input.titre,
      message: input.message,
      module: input.module ?? null,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      priorite: input.priorite ?? "normale",
      lien: input.lien ?? null,
    } as never)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Échec création notification");
  }

  const id = String((data as { id: string }).id);
  if (input.recipientUserIds.length) {
    await supabase.from("notification_recipients" as never).insert(
      input.recipientUserIds.map((userId) => ({
        notification_id: id,
        user_id: userId,
      })) as never,
    );
  }
  return id;
}

export async function markNotificationRead(
  supabase: SupabaseClient,
  userId: string,
  notificationId: string,
) {
  await supabase
    .from("notification_recipients" as never)
    .update({ lu_at: new Date().toISOString() } as never)
    .eq("notification_id", notificationId)
    .eq("user_id", userId);
}

export async function markAllNotificationsRead(
  supabase: SupabaseClient,
  userId: string,
) {
  await supabase
    .from("notification_recipients" as never)
    .update({ lu_at: new Date().toISOString() } as never)
    .eq("user_id", userId)
    .is("lu_at", null);
}
