"use client";

import { ConfirmDeleteDialog } from "@/components/admin/actions/confirm-delete-dialog";

export function ArchiveDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Archiver cet élément ?",
  description = "L’élément sera archivé et pourra être restauré ultérieurement.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
}) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={title}
      description={description}
      confirmLabel="Archiver"
    />
  );
}
