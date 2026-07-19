"use client";

import { usePathname } from "next/navigation";
import { Suspense, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AfdPageLoadingIndicator } from "@/components/admin/afd-page-loading-indicator";
import { roleHasPermission } from "@/config/permissions";
import type { AdminViewer, SidebarBadges } from "@/features/statistiques/types/dashboard";
import { useAdminSidebarCollapsed } from "@/hooks/use-admin-sidebar-collapsed";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: ReactNode;
  badges: SidebarBadges;
  viewer: AdminViewer;
  pageTitle?: string;
  presentationMode?: boolean;
};

export function AdminShell({
  children,
  badges,
  viewer,
  pageTitle,
  presentationMode = false,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useAdminSidebarCollapsed(false);
  const pathname = usePathname();
  const isOverview = pathname === "/admin";

  const canManageSettings = useMemo(
    () => roleHasPermission(viewer.role, "parametres:manage"),
    [viewer.role],
  );

  return (
    <div
      className={cn(
        "admin-shell min-h-screen",
        isOverview && "admin-shell--overview lg:min-h-0",
        collapsed && "admin-shell--sidebar-collapsed",
      )}
      data-sidebar-collapsed={collapsed ? "true" : "false"}
      style={
        {
          "--admin-sidebar-current-width": collapsed
            ? "var(--admin-sidebar-width-collapsed)"
            : "var(--admin-sidebar-width)",
        } as CSSProperties
      }
    >
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex">
        <AdminSidebar
          badges={badges}
          role={viewer.role}
          collapsed={collapsed}
          onToggleCollapsed={toggle}
        />
      </div>

      <AdminMobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        badges={badges}
        role={viewer.role}
      />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-200 ease-out",
          "lg:pl-[var(--admin-sidebar-current-width)]",
          isOverview ? "h-full min-h-0" : "min-h-screen",
        )}
      >
        <AdminHeader
          title={pageTitle}
          badges={badges}
          viewer={viewer}
          presentationMode={presentationMode}
          canManageSettings={canManageSettings}
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

      <Suspense fallback={null}>
        <AfdPageLoadingIndicator />
      </Suspense>
    </div>
  );
}
