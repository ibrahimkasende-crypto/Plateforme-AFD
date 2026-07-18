"use client";

import { ConfirmDeleteDialog } from "@/components/admin/actions/confirm-delete-dialog";

export function DuplicateDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Dupliquer cet élément ?"
      description="Une copie en brouillon sera créée."
      confirmLabel="Dupliquer"
    />
  );
}
