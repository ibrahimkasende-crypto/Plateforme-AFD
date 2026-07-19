import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone: string | null;
  status: string | null;
  created_at: string | null;
};

const UNREAD_STATUSES = new Set([
  "pending",
  "nouveau",
  "unread",
  "new",
  "non_lu",
]);

export function isUntreatedMessageStatus(status: string | null | undefined): boolean {
  if (!status) return true;
  return UNREAD_STATUSES.has(status.toLowerCase());
}

export async function countUntreatedMessages(
  supabase: SupabaseClient,
): Promise<number> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, status");
  if (error || !data) return 0;
  return data.filter((m) => isUntreatedMessageStatus(m.status)).length;
}

export async function listMessages(
  supabase: SupabaseClient,
  filters: { q?: string; status?: string; limit?: number } = {},
): Promise<ContactMessageRow[]> {
  let query = supabase.from("messages").select("*").limit(filters.limit ?? 100);
  if (filters.q?.trim()) {
    const q = filters.q.trim().replace(/[%_,]/g, " ").slice(0, 120);
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`,
    );
  }
  if (filters.status?.trim()) {
    const s = filters.status.trim();
    if (s === "unread" || s === "nouveau") {
      query = query.in("status", ["unread", "nouveau", "pending", "new", "non_lu"]);
    } else {
      query = query.eq("status", s);
    }
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  return error || !data ? [] : (data as ContactMessageRow[]);
}

export async function getMessageById(
  supabase: SupabaseClient,
  id: string,
): Promise<ContactMessageRow | null> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return error || !data ? null : (data as ContactMessageRow);
}

export async function updateMessageStatus(
  supabase: SupabaseClient,
  id: string,
  status: string,
): Promise<void> {
  await supabase.from("messages").update({ status }).eq("id", id);
}
