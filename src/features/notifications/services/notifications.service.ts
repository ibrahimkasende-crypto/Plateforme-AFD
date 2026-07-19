import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type UserNotificationRow = {
  id: string;
  titre: string;
  message: string;
  module: string | null;
  priorite: string | null;
  lien: string | null;
  created_at: string | null;
  lu_at: string | null;
};

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

export async function countUnreadNotifications(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("notification_recipients" as never)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("lu_at", null);
  if (error) return 0;
  return count ?? 0;
}

export async function listUserNotifications(
  supabase: SupabaseClient,
  userId: string,
  opts: { unreadOnly?: boolean; limit?: number } = {},
): Promise<UserNotificationRow[]> {
  let query = supabase
    .from("notification_recipients" as never)
    .select(
      "lu_at, notification_id, notifications(id, titre, message, module, priorite, lien, created_at)",
    )
    .eq("user_id", userId)
    .limit(opts.limit ?? 50);

  if (opts.unreadOnly) {
    query = query.is("lu_at", null);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  type Row = {
    lu_at: string | null;
    notifications: {
      id: string;
      titre: string;
      message: string;
      module: string | null;
      priorite: string | null;
      lien: string | null;
      created_at: string | null;
    } | null;
  };

  return (data as unknown as Row[])
    .map((row) => {
      const n = row.notifications;
      if (!n) return null;
      return {
        id: n.id,
        titre: n.titre,
        message: n.message,
        module: n.module,
        priorite: n.priorite,
        lien: n.lien,
        created_at: n.created_at,
        lu_at: row.lu_at,
      };
    })
    .filter((x): x is UserNotificationRow => Boolean(x))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}
