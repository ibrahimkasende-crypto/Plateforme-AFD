"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSuperActor } from "@/features/identity/security/privilege-guards";
import {
  requestMailboxPasswordReset,
  setMailboxStatus,
  upsertMailbox,
} from "@/features/messagerie/services/mailbox.service";
import { logAdminActivity } from "@/lib/auth/log-admin-activity";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

function canManageMailboxes(roles: string[]): boolean {
  return (
    isSuperActor(roles) ||
    roles.includes("admin_principal_it")
  );
}

const associateSchema = z.object({
  userId: z.string().uuid(),
  emailAddress: z.string().email().max(320),
  displayName: z.string().max(200).optional(),
});

export async function associateMailboxAction(input: unknown) {
  const session = await requireAdmin("/admin/messagerie/comptes");
  if (!canManageMailboxes(session.roles)) {
    return { ok: false, message: "Accès refusé." };
  }

  const parsed = associateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données invalides." };
  }

  const supabase = await createClient();
  const result = await upsertMailbox(supabase, {
    userId: parsed.data.userId,
    emailAddress: parsed.data.emailAddress,
    displayName: parsed.data.displayName,
    mailboxStatus: "active",
  });

  if (result.ok) {
    await logAdminActivity(
      "mailbox.associate",
      {
        email: parsed.data.emailAddress,
        target_user: parsed.data.userId,
      },
      session.user.id,
    );
    revalidatePath("/admin/messagerie");
    revalidatePath("/admin/messagerie/comptes");
  }

  return result;
}

export async function setMailboxStatusAction(input: unknown) {
  const session = await requireAdmin("/admin/messagerie/comptes");
  if (!canManageMailboxes(session.roles)) {
    return { ok: false, message: "Accès refusé." };
  }

  const parsed = z
    .object({
      mailboxId: z.string().uuid(),
      status: z.enum(["pending", "active", "suspended", "disabled", "error"]),
    })
    .safeParse(input);

  if (!parsed.success) return { ok: false, message: "Données invalides." };

  const supabase = await createClient();
  const result = await setMailboxStatus(
    supabase,
    parsed.data.mailboxId,
    parsed.data.status,
  );

  if (result.ok) {
    await logAdminActivity(
      "mailbox.status",
      {
        mailbox_id: parsed.data.mailboxId,
        status: parsed.data.status,
      },
      session.user.id,
    );
    revalidatePath("/admin/messagerie/comptes");
    revalidatePath("/admin/messagerie");
  }

  return result;
}

export async function requestEmailPasswordResetAction(justification?: string) {
  const session = await requireAdmin("/admin/messagerie");
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_mailboxes" as never)
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const mailboxId = (data as { id?: string } | null)?.id;
  if (!mailboxId) {
    return {
      ok: false,
      message: "Aucune boîte professionnelle associée à votre compte.",
    };
  }

  const result = await requestMailboxPasswordReset(supabase, {
    userId: session.user.id,
    mailboxId,
    justification,
  });

  if (result.ok) {
    await logAdminActivity(
      "mailbox.password_reset_requested",
      { channel: "professional_email", mailbox_id: mailboxId },
      session.user.id,
    );
  }

  return result;
}
