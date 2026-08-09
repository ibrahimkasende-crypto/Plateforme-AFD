import { processContactMessage } from "@/lib/contact/process-contact-message";

export type ContactMessageInsert = {
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  requestType?: string | null;
  subject: string;
  message: string;
  province?: string | null;
};

export type ContactMutationResult =
  | { ok: true; messageId?: string; emailNotificationSent?: boolean }
  | { ok: false; reason: "unavailable" | "insert_failed" };

export async function submitContactMessage(
  input: ContactMessageInsert,
): Promise<ContactMutationResult> {
  const result = await processContactMessage(input);
  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason === "unavailable" ? "unavailable" : "insert_failed",
    };
  }
  return {
    ok: true,
    messageId: result.messageId,
    emailNotificationSent: result.emailNotificationSent,
  };
}
