export type MailFolderId =
  | "inbox"
  | "sent"
  | "drafts"
  | "spam"
  | "trash";

export type MailAttachmentMeta = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
};

export type MailMessageSummary = {
  id: string;
  folder: MailFolderId;
  from: string;
  to: string[];
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  hasAttachment: boolean;
  priority?: "normal" | "high" | "low";
};

export type MailMessageDetail = MailMessageSummary & {
  cc: string[];
  html: string | null;
  text: string | null;
  attachments: MailAttachmentMeta[];
};

export type MailboxStatus =
  | "pending"
  | "active"
  | "suspended"
  | "disabled"
  | "error";

export type UserMailboxRow = {
  id: string;
  user_id: string;
  email_address: string;
  display_name: string | null;
  mailbox_status: MailboxStatus;
  imap_enabled: boolean;
  smtp_enabled: boolean;
  unread_count: number;
  last_sync_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
