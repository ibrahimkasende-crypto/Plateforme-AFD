import "server-only";

import { MailError, MAIL_ERROR_CODES } from "@/lib/mail/mail-errors";
import { isMailConfigReadyForImap } from "@/lib/mail/mail-config";
import type { MailFolderId, MailMessageDetail, MailMessageSummary } from "@/lib/mail/mail-types";

/**
 * Client IMAP — Phase 2.
 * Non activé tant que MAIL_INTEGRATED_ENABLED + hôtes ne sont pas validés.
 */
export async function assertImapReady(): Promise<void> {
  if (!isMailConfigReadyForImap() || process.env.MAIL_INTEGRATED_ENABLED !== "true") {
    throw new MailError(
      MAIL_ERROR_CODES.PHASE2_DISABLED,
      "La messagerie IMAP intégrée n’est pas encore activée. Utilisez le webmail.",
      501,
    );
  }
}

export async function listFolders(_mailboxEmail: string): Promise<MailFolderId[]> {
  await assertImapReady();
  return ["inbox", "sent", "drafts", "spam", "trash"];
}

export async function listMessages(_params: {
  mailboxEmail: string;
  folder: MailFolderId;
  limit?: number;
}): Promise<MailMessageSummary[]> {
  await assertImapReady();
  return [];
}

export async function getMessage(_params: {
  mailboxEmail: string;
  messageId: string;
}): Promise<MailMessageDetail | null> {
  await assertImapReady();
  return null;
}

export async function markRead(_params: {
  mailboxEmail: string;
  messageId: string;
  unread?: boolean;
}): Promise<void> {
  await assertImapReady();
}

export async function moveMessage(_params: {
  mailboxEmail: string;
  messageId: string;
  targetFolder: MailFolderId;
}): Promise<void> {
  await assertImapReady();
}

export async function deleteMessage(_params: {
  mailboxEmail: string;
  messageId: string;
}): Promise<void> {
  await assertImapReady();
}

export async function getUnreadCount(_mailboxEmail: string): Promise<number | null> {
  if (!isMailConfigReadyForImap() || process.env.MAIL_INTEGRATED_ENABLED !== "true") {
    return null;
  }
  await assertImapReady();
  return 0;
}
