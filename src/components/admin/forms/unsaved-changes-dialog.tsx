"use client";

import { useEffect } from "react";

/** Avertit avant de quitter si le formulaire est dirty. */
export function useUnsavedChangesGuard(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
}: {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="unsaved-title" className="font-display text-lg font-bold">
          Modifications non enregistrées
        </h2>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Vos changements seront perdus si vous quittez cette page.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onStay}
            className="rounded-lg border px-3 py-2 text-sm font-medium"
          >
            Rester
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}
