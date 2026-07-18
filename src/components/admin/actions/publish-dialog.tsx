"use client";

import { ConfirmDeleteDialog } from "@/components/admin/actions/confirm-delete-dialog";

export function PublishDialog({
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
      title="Publier cet élément ?"
      description="Le contenu sera visible selon les règles de publication du site."
      confirmLabel="Publier"
    />
  );
}
