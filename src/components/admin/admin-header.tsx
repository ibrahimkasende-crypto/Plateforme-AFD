"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Maximize2, Menu, MessageSquare, Minimize2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { AdminProfileMenu } from "@/components/admin/admin-profile-menu";
import { AdminSearch } from "@/components/admin/admin-search";
import { PresentationModeBadge } from "@/components/admin/presentation-mode-badge";
import { adminSidebarItems } from "@/config/admin-navigation";
import type { AdminViewer, SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

type AdminHeaderProps = {
  title?: string;
  badges: SidebarBadges;
  viewer: AdminViewer;
  onMenuClick: () => void;
  presentationMode?: boolean;
};

export function AdminHeader({
  title,
  badges,
  viewer,
  onMenuClick,
  presentationMode = false,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const [fullscreen, setFullscreen] = useState(false);

  const resolvedTitle = useMemo(() => {
    if (title) return title;
    const match = adminSidebarItems.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    return match?.label ?? "Administration";
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

  const messageCount = badges.messages;

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
        <h1 className="truncate font-display text-[22px] font-extrabold leading-none text-[var(--admin-text)] md:text-[24px]">
          {resolvedTitle}
        </h1>
      </div>

      <div className="hidden flex-1 justify-center lg:flex">
        <AdminSearch />
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        {presentationMode ? <PresentationModeBadge /> : null}
        <AdminNotifications count={badges.notifications} />
        <Link
          href="/admin/messages"
          className={cn(
            "relative inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100",
          )}
          aria-label={
            messageCount
              ? `${messageCount} message(s) non traité(s)`
              : "Messages"
          }
        >
          <MessageSquare className="size-5" aria-hidden />
          {messageCount && messageCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {messageCount > 99 ? "99+" : messageCount}
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="hidden size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 sm:inline-flex"
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
