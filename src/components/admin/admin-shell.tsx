"use client";

import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminViewer, SidebarBadges } from "@/features/statistiques/types/dashboard";

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

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">
        <AdminSidebar badges={badges} />
      </div>

      <AdminMobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        badges={badges}
      />

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <AdminHeader
          title={pageTitle}
          badges={badges}
          viewer={viewer}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
