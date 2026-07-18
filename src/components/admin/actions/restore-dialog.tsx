"use client";

import { ConfirmDeleteDialog } from "@/components/admin/actions/confirm-delete-dialog";

export function RestoreDialog({
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
      title="Restaurer cet élément ?"
      description="L’élément redeviendra actif dans le module concerné."
      confirmLabel="Restaurer"
    />
  );
}
