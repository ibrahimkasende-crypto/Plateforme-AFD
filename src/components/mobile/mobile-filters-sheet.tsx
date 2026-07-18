"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Drawer filtres mobile — listes publiques (documents, opportunités, etc.). */
export function MobileFiltersSheet({
  title = "Filtres",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={cn("md:hidden", className)}>
      <button
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--afd-border)] bg-white px-4 text-sm font-semibold text-[var(--afd-navy)]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <Filter className="size-4" aria-hidden />
        {title}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--afd-dark-navy)]/45"
            aria-label="Fermer les filtres"
            onClick={() => setOpen(false)}
          />
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 max-h-[min(88dvh,640px)] overflow-y-auto rounded-t-2xl border border-[var(--afd-border)] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(3,27,60,0.2)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-heading text-lg font-bold text-[var(--afd-navy)]">
                {title}
              </p>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--afd-border)]"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div onSubmitCapture={() => setOpen(false)}>{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
