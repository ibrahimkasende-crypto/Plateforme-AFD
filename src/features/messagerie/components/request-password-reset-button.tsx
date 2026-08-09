"use client";

import { useState, useTransition } from "react";
import { requestEmailPasswordResetAction } from "@/features/messagerie/actions/mailbox-actions";

export function RequestEmailPasswordResetButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  function onClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await requestEmailPasswordResetAction();
      setOk(result.ok);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Demander la réinitialisation du mot de passe email"}
      </button>
      {message ? (
        <p
          className={
            ok ? "text-sm text-emerald-700" : "text-sm text-red-700"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
