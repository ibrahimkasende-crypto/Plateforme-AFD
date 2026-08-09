import "server-only";

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/require-admin";
import { getMailServerConfig } from "@/lib/mail/mail-config";
import { MAIL_ERROR_CODES } from "@/lib/mail/mail-errors";
import { getMailboxForUser } from "@/features/messagerie/services/mailbox.service";
import { createClient } from "@/lib/supabase/server";

/**
 * Garde commune des routes /api/mail/* — Phase 2.
 * Vérifie session + boîte propriétaire ; jamais d’identifiants dans la réponse.
 */
export async function requireOwnMailboxApi() {
  const session = await getAdminSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, code: MAIL_ERROR_CODES.SESSION_EXPIRED },
        { status: 401 },
      ),
    };
  }

  const supabase = await createClient();
  const mailbox = await getMailboxForUser(supabase, session.user.id);
  if (!mailbox || mailbox.mailbox_status !== "active") {
    return {
      error: NextResponse.json(
        { ok: false, code: MAIL_ERROR_CODES.NO_MAILBOX },
        { status: 404 },
      ),
    };
  }

  const cfg = getMailServerConfig();
  if (!cfg.integratedMailEnabled) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          code: MAIL_ERROR_CODES.PHASE2_DISABLED,
          message:
            "Messagerie intégrée désactivée. Ouvrez le webmail depuis /admin/messagerie.",
        },
        { status: 501 },
      ),
    };
  }

  return { session, mailbox, cfg };
}
