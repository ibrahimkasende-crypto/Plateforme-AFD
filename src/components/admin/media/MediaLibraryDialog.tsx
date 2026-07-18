"use client";

import type { MediaRecord } from "@/services/media.service";
import { MediaPicker } from "@/components/admin/media/MediaPicker";

export function MediaLibraryDialog({
  open,
  items,
  onClose,
  onSelect,
}: {
  open: boolean;
  items: MediaRecord[];
  onClose: () => void;
  onSelect: (media: MediaRecord | null) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--afd-navy)]/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Médiathèque"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[var(--afd-navy)]">
            Choisir un média
          </h2>
          <button
            type="button"
            className="text-sm font-semibold text-[var(--afd-muted)]"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <MediaPicker
          items={items}
          onSelect={(media) => {
            onSelect(media);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
