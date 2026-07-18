"use client";

import type { ReactNode } from "react";

export function PreviewDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/30" role="dialog" aria-modal>
      <button type="button" className="flex-1" aria-label="Fermer" onClick={onClose} />
      <aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded border px-3 py-1 text-sm">
            Fermer
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
