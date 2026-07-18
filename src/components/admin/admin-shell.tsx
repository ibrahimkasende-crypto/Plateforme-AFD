"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminViewer, SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: ReactNode;
  badges: SidebarBadges;
  viewer: AdminViewer;
  pageTitle?: string;
};

export function AdminShell({
  children,
  badges,
  viewer,
  pageTitle,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isOverview = pathname === "/admin";

  return (
    <div
      className={cn(
        "admin-shell min-h-screen",
        isOverview && "admin-shell--overview lg:min-h-0",
      )}
    >
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex">
        <AdminSidebar badges={badges} role={viewer.role} />
      </div>

      <AdminMobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        badges={badges}
        role={viewer.role}
      />

      <div
        className={cn(
          "flex flex-col lg:pl-[var(--admin-sidebar-width)]",
          isOverview ? "h-full min-h-0" : "min-h-screen",
        )}
      >
        <AdminHeader
          title={pageTitle}
          badges={badges}
          viewer={viewer}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main
          className={cn(
            "flex-1 min-h-0",
            isOverview
              ? "admin-main--overview"
              : "overflow-auto p-4 md:p-6",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
