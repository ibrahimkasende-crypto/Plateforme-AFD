"use client";

import { useState, useTransition } from "react";

type ApprovalPanelProps = {
  requestId: string;
  currentState: string;
  onAction: (formData: FormData) => Promise<void>;
};

export function ApprovalPanel({
  requestId,
  currentState,
  onAction,
}: ApprovalPanelProps) {
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(actionCode: string, toState: string) {
    const fd = new FormData();
    fd.set("request_id", requestId);
    fd.set("action_code", actionCode);
    fd.set("to_state", toState);
    fd.set("comment", comment);
    startTransition(async () => {
      await onAction(fd);
    });
  }

  return (
    <div className="space-y-3 rounded border bg-white p-4">
      <p className="text-sm">
        État actuel : <strong>{currentState}</strong>
      </p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Commentaire"
        className="w-full rounded border p-2 text-sm"
        rows={3}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className="rounded bg-[var(--afd-blue)] px-3 py-2 text-sm text-white disabled:opacity-50"
          onClick={() => submit("approve", "approuve")}
        >
          Approuver
        </button>
        <button
          type="button"
          disabled={pending}
          className="rounded border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => submit("reject", "rejete")}
        >
          Rejeter
        </button>
      </div>
    </div>
  );
}
