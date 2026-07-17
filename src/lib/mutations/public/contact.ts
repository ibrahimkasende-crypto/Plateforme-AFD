import type { Database } from "@/types/database.types";
import { createClientSafe } from "@/lib/supabase/safe";

export type ContactMessageInsert = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];

export type ContactMutationResult =
  | { ok: true }
  | { ok: false; reason: "unavailable" | "insert_failed" };

export async function submitContactMessage(
  input: ContactMessageInsert,
): Promise<ContactMutationResult> {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: false, reason: "unavailable" };
  }

  const payload: MessageInsert = {
    name: input.name,
    email: input.email,
    phone: input.phone?.trim() || null,
    subject: input.subject,
    message: input.message,
    status: "pending",
  };

  const { error } = await supabase.from("messages").insert(payload);
  if (error) {
    return { ok: false, reason: "insert_failed" };
  }

  return { ok: true };
}
