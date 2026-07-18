"use client";

import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar";
import type { Role } from "@/config/roles";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminMobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  badges: SidebarBadges;
  role: Role;
};

export function AdminMobileSidebar({
  open,
  onClose,
  badges,
  role,
}: AdminMobileSidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#0d254e] text-white shadow-xl transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
        aria-label="Menu de navigation mobile"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-display text-sm font-semibold">AFD ASBL</p>
            <p className="text-xs text-white/60">Administration</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Fermer le menu"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <AdminSidebarNav badges={badges} role={role} onNavigate={onClose} />
        <div className="mt-auto shrink-0 border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            aria-label="Voir le site public"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[var(--admin-primary)] text-[12px] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ExternalLink className="size-4 shrink-0" aria-hidden />
            Voir le site public
          </Link>
        </div>
      </aside>
    </>
  );
}
