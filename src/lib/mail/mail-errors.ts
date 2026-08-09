export class MailError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "MailError";
    this.code = code;
    this.status = status;
  }
}

export const MAIL_ERROR_CODES = {
  PHASE2_DISABLED: "PHASE2_DISABLED",
  NO_MAILBOX: "NO_MAILBOX",
  FORBIDDEN_MAILBOX: "FORBIDDEN_MAILBOX",
  IMAP_UNAVAILABLE: "IMAP_UNAVAILABLE",
  SMTP_UNAVAILABLE: "SMTP_UNAVAILABLE",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  RATE_LIMITED: "RATE_LIMITED",
  ATTACHMENT_REJECTED: "ATTACHMENT_REJECTED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
} as const;
