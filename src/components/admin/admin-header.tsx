"use client";

import {
  Maximize2,
  Menu,
  Minimize2,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AdminMessagesButton } from "@/components/admin/header/admin-messages-button";
import {
  AdminNotificationsButton,
  type HeaderNotificationPreview,
} from "@/components/admin/header/admin-notifications-button";
import { AdminProfileMenu } from "@/components/admin/admin-profile-menu";
import { AdminSearch } from "@/components/admin/admin-search";
import { AfdEnvironmentBadge } from "@/components/admin/afd-environment-badge";
import { OrganizationBadge } from "@/components/branding/organization-badge";
import { resolveAdminNavTitle } from "@/config/admin-navigation";
import { productBrand } from "@/config/product-brand";
import type { AdminViewer, SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminHeaderProps = {
  title?: string;
  badges: SidebarBadges;
  viewer: AdminViewer;
  onMenuClick: () => void;
  presentationMode?: boolean;
  canManageSettings?: boolean;
  notificationPreviews?: HeaderNotificationPreview[];
};

export function AdminHeader({
  title,
  badges,
  viewer,
  onMenuClick,
  canManageSettings = false,
  notificationPreviews = [],
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [fullscreen, setFullscreen] = useState(false);

  const resolvedTitle = useMemo(() => {
    if (title) return title;
    return resolveAdminNavTitle(pathname);
  }, [pathname, title]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      setFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[var(--admin-header-height)] shrink-0 items-center gap-3 border-b border-[var(--admin-border)] bg-white px-3 md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex size-10 items-center justify-center rounded-lg text-[var(--admin-text)] hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="hidden text-[10px] font-semibold uppercase tracking-wide text-[var(--admin-primary)] sm:block">
            {productBrand.productName}
          </p>
          <h1 className="truncate font-display text-[20px] font-extrabold leading-none text-[var(--admin-text)] md:text-[24px]">
            {resolvedTitle}
          </h1>
        </div>
      </div>

      <div className="hidden flex-1 justify-center lg:flex">
        <AdminSearch />
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <OrganizationBadge className="hidden md:inline-flex" />
        <AfdEnvironmentBadge className="hidden sm:inline-flex" />        <AdminNotificationsButton
          count={badges.notifications}
          previews={notificationPreviews}
        />
        <AdminMessagesButton count={badges.messages} />
        {canManageSettings ? (
          <Link
            href="/admin/parametres"
            className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            aria-label="Paramètres"
            title="Paramètres"
          >
            <Settings className="size-5" aria-hidden />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={toggleFullscreen}
          className={cn(
            "hidden size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:inline-flex",
          )}
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {fullscreen ? (
            <Minimize2 className="size-5" aria-hidden />
          ) : (
            <Maximize2 className="size-5" aria-hidden />
          )}
        </button>
        <AdminProfileMenu viewer={viewer} />
      </div>
    </header>
  );
}
