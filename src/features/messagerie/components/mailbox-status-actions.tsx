"use client";

import { useTransition } from "react";
import { setMailboxStatusAction } from "@/features/messagerie/actions/mailbox-actions";
import type { MailboxStatus } from "@/lib/mail/mail-types";

export function MailboxStatusActions({
  mailboxId,
  status,
}: {
  mailboxId: string;
  status: MailboxStatus;
}) {
  const [pending, startTransition] = useTransition();

  function setStatus(next: MailboxStatus) {
    startTransition(async () => {
      await setMailboxStatusAction({ mailboxId, status: next });
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "active" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("active")}
          className="rounded-md border px-2 py-1 text-xs font-semibold"
        >
          Activer
        </button>
      ) : null}
      {status !== "suspended" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("suspended")}
          className="rounded-md border px-2 py-1 text-xs font-semibold text-amber-800"
        >
          Suspendre
        </button>
      ) : null}
      {status !== "disabled" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("disabled")}
          className="rounded-md border px-2 py-1 text-xs font-semibold text-red-700"
        >
          Désactiver
        </button>
      ) : null}
    </div>
  );
}
