import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserMailboxRow } from "@/lib/mail/mail-types";

export async function getMailboxForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserMailboxRow | null> {
  const { data, error } = await supabase
    .from("user_mailboxes" as never)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as UserMailboxRow;
}

export async function listMailboxes(
  supabase: SupabaseClient,
): Promise<UserMailboxRow[]> {
  const { data, error } = await supabase
    .from("user_mailboxes" as never)
    .select("*")
    .order("email_address", { ascending: true });

  if (error || !data) return [];
  return data as unknown as UserMailboxRow[];
}

export async function upsertMailbox(
  supabase: SupabaseClient,
  input: {
    userId: string;
    emailAddress: string;
    displayName?: string | null;
    mailboxStatus?: UserMailboxRow["mailbox_status"];
    imapEnabled?: boolean;
    smtpEnabled?: boolean;
    notes?: string | null;
  },
): Promise<{ ok: boolean; message: string; row?: UserMailboxRow }> {
  const email = input.emailAddress.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Adresse e-mail invalide." };
  }

  const now = new Date().toISOString();
  const payload = {
    user_id: input.userId,
    email_address: email,
    display_name: input.displayName ?? null,
    mailbox_status: input.mailboxStatus ?? "active",
    imap_enabled: input.imapEnabled ?? false,
    smtp_enabled: input.smtpEnabled ?? false,
    notes: input.notes ?? null,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("user_mailboxes" as never)
    .upsert(payload as never, { onConflict: "user_id" })
    .select("*")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: "Boîte associée.",
    row: data as unknown as UserMailboxRow,
  };
}

export async function setMailboxStatus(
  supabase: SupabaseClient,
  mailboxId: string,
  status: UserMailboxRow["mailbox_status"],
): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from("user_mailboxes" as never)
    .update({
      mailbox_status: status,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", mailboxId);

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Statut mis à jour." };
}

export async function requestMailboxPasswordReset(
  supabase: SupabaseClient,
  input: { userId: string; mailboxId: string; justification?: string },
): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase
    .from("mailbox_password_reset_requests" as never)
    .insert({
      mailbox_id: input.mailboxId,
      user_id: input.userId,
      justification: input.justification ?? null,
      status: "pending",
    } as never);

  if (error) return { ok: false, message: error.message };
  return {
    ok: true,
    message:
      "Demande enregistrée. L’équipe IT traitera la réinitialisation via CyberPanel.",
  };
}

export async function countCachedUnread(
  supabase: SupabaseClient,
  userId: string,
): Promise<number | null> {
  const box = await getMailboxForUser(supabase, userId);
  if (!box || box.mailbox_status !== "active") return null;
  if (!box.imap_enabled) return null;
  return Math.max(0, box.unread_count ?? 0);
}
