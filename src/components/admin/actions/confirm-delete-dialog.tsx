"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  loading = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/45" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[90] w-[calc(100vw-24px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--admin-border)] bg-white p-5 shadow-xl focus:outline-none",
          )}
        >
          <Dialog.Title className="font-display text-lg font-semibold text-[var(--admin-text)]">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-[var(--admin-muted)]">
            {description}
          </Dialog.Description>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Dialog.Close
              type="button"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--admin-border)] px-4 text-sm font-medium text-[var(--admin-text)] transition hover:bg-slate-50 disabled:opacity-60"
            >
              {cancelLabel}
            </Dialog.Close>
            <button
              type="button"
              disabled={loading}
              onClick={() => void onConfirm()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden />
              ) : null}
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
