import Link from "next/link";
import type { ReactNode } from "react";

type AdminFormFooterProps = {
  cancelHref?: string;
  submitLabel?: string;
  draftLabel?: string;
  showDraft?: boolean;
  previewSlot?: ReactNode;
  sticky?: boolean;
};

export function AdminFormFooter({
  cancelHref = "/admin",
  submitLabel = "Enregistrer",
  draftLabel = "Enregistrer le brouillon",
  showDraft = false,
  previewSlot,
  sticky = true,
}: AdminFormFooterProps) {
  return (
    <footer
      className={
        sticky
          ? "sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--admin-border)] bg-white/95 px-4 py-3 backdrop-blur"
          : "flex flex-wrap items-center justify-end gap-2"
      }
    >
      <Link
        href={cancelHref}
        className="inline-flex h-11 items-center rounded-lg border border-[var(--admin-border)] px-4 text-sm font-medium"
      >
        Annuler
      </Link>
      {previewSlot}
      {showDraft ? (
        <button
          type="submit"
          name="intent"
          value="draft"
          className="inline-flex h-11 items-center rounded-lg border border-[var(--admin-border)] px-4 text-sm font-semibold"
        >
          {draftLabel}
        </button>
      ) : null}
      <button
        type="submit"
        name="intent"
        value="publish"
        className="inline-flex h-11 items-center rounded-lg bg-[var(--admin-primary)] px-4 text-sm font-semibold text-white"
      >
        {submitLabel}
      </button>
    </footer>
  );
}
