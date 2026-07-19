"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type DashboardContextMenuAction = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

type DashboardContextMenuProps = {
  actions: DashboardContextMenuAction[];
  label?: string;
  className?: string;
};

export function DashboardContextMenu({
  actions,
  label = "Actions du graphique",
  className,
}: DashboardContextMenuProps) {
  const [open, setOpen] = useState(false);
  const usable = actions.filter((a) => a.href || a.onClick);
  if (usable.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex size-7 items-center justify-center rounded-md text-[var(--admin-muted)] hover:bg-slate-100 hover:text-[var(--admin-text)]"
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {usable.map((action) =>
            action.href ? (
              <Link
                key={action.id}
                href={action.href}
                role="menuitem"
                className="block px-3 py-2 text-sm text-[var(--admin-text)] hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {action.label}
              </Link>
            ) : (
              <button
                key={action.id}
                type="button"
                role="menuitem"
                className="block w-full px-3 py-2 text-left text-sm text-[var(--admin-text)] hover:bg-slate-50"
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
              >
                {action.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
