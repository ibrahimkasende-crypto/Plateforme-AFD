"use client";

import { X } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminMobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  badges: SidebarBadges;
};

export function AdminMobileSidebar({
  open,
  onClose,
  badges,
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
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0d254e]">
              AFD
            </div>
            <div>
              <p className="font-display text-sm font-semibold">AFD ASBL</p>
              <p className="text-xs text-white/60">Administration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Fermer le menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminSidebarNav badges={badges} onNavigate={onClose} />
      </aside>
    </>
  );
}
