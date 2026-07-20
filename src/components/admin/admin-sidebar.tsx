"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  PanelLeftClose,
  Shield,
  Target,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  adminNavGroups,
  navGroupAllowed,
  type AdminNavBadgeKey,
  type AdminNavGroupDef,
  type AdminNavItem,
} from "@/config/admin-navigation";
import { navItemAllowed } from "@/config/admin-nav-permissions";
import { siteConfig } from "@/config/site";
import { roleHasPermission } from "@/config/permissions";
import type { Role } from "@/config/roles";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

export const adminNavIconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  Target,
  Newspaper,
  MessageSquare,
  UsersRound,
  Wallet,
  FileText,
  Shield,
};

function badgeClassName(key: AdminNavBadgeKey): string {
  if (key === "newsletter") return "bg-[var(--admin-green)] text-white";
  if (key === "messages") return "bg-[var(--admin-red)] text-white";
  if (key === "adhesions") return "bg-[var(--admin-primary)] text-white";
  return "bg-[var(--admin-primary)] text-white";
}

function resolveBadge(
  key: AdminNavBadgeKey | undefined,
  badges: SidebarBadges,
): number | null {
  if (!key) return null;
  return badges[key];
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActiveItem(pathname: string, group: AdminNavGroupDef): boolean {
  if (group.href) return isNavActive(pathname, group.href);
  return group.items.some((item) => isNavActive(pathname, item.href));
}

function filterNavGroups(role: Role) {
  const has = (permission: Parameters<typeof roleHasPermission>[1]) =>
    roleHasPermission(role, permission);

  return adminNavGroups
    .filter((group) => navGroupAllowed(group, has))
    .map((group) => {
      if (group.href) return group;
      const items = group.items.filter((item) => navItemAllowed(item.href, has));
      return { ...group, items };
    })
    .filter((group) => group.href || group.items.length > 0);
}

function NavItemLink({
  item,
  badges,
  collapsed,
  indented = true,
  onNavigate,
}: {
  item: AdminNavItem;
  badges: SidebarBadges;
  collapsed?: boolean;
  indented?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const count = resolveBadge(item.badgeKey, badges);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-9 items-center rounded-lg text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          collapsed ? "justify-center px-0" : cn("gap-2 px-2.5", indented && "pl-3"),
          active
            ? "bg-[var(--admin-sidebar-active)] font-medium text-white"
            : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
        )}
      >
        <span
          className={cn(
            "flex-1 truncate",
            collapsed && "sr-only",
          )}
        >
          {item.label}
        </span>
        {!collapsed && count !== null ? (
          <span
            className={cn(
              "inline-flex min-w-[18px] shrink-0 items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold tabular-nums",
              count > 0
                ? badgeClassName(item.badgeKey ?? "notifications")
                : "bg-white/15 text-white/80",
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
        {collapsed ? (
          <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-[#07152f] px-2 py-1 text-[11px] text-white shadow-lg group-hover:block group-focus-visible:block">
            {item.label}
            {count !== null ? ` (${count})` : ""}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function TopLevelNavLink({
  group,
  collapsed,
  onNavigate,
}: {
  group: AdminNavGroupDef;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const href = group.href!;
  const Icon = adminNavIconMap[group.icon];
  const active = isNavActive(pathname, href);

  return (
    <div className="mb-2.5">
      <Link
        href={href}
        onClick={onNavigate}
        title={collapsed ? group.label : undefined}
        aria-current={active ? "page" : undefined}
        aria-label={group.label}
        className={cn(
          "group relative flex items-center rounded-xl text-[13px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          collapsed ? "h-12 justify-center px-0" : "h-10 gap-2.5 px-2.5",
          active
            ? "bg-[var(--admin-sidebar-active)] font-medium text-white"
            : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
        )}
      >
        {Icon ? (
          <Icon
            className={cn("shrink-0", collapsed ? "size-6" : "size-[18px]")}
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
        <span className={cn("truncate", collapsed && "sr-only")}>{group.label}</span>
        {collapsed ? (
          <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-[#07152f] px-2 py-1 text-[11px] text-white shadow-lg group-hover:block group-focus-visible:block">
            {group.label}
          </span>
        ) : null}
      </Link>
    </div>
  );
}

function NavGroupAccordion({
  group,
  badges,
  collapsed,
  open,
  onOpenChange,
  onNavigate,
  onExpandSidebar,
  flyoutOpen,
  onFlyoutOpenChange,
}: {
  group: AdminNavGroupDef;
  badges: SidebarBadges;
  collapsed: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: () => void;
  onExpandSidebar?: () => void;
  flyoutOpen: boolean;
  onFlyoutOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const panelId = useId();
  const flyoutRef = useRef<HTMLDivElement>(null);
  const Icon = adminNavIconMap[group.icon];
  const active = groupHasActiveItem(pathname, group);
  const groupBadgeCount = group.items.reduce((sum, item) => {
    const count = resolveBadge(item.badgeKey, badges);
    return sum + (count && count > 0 ? count : 0);
  }, 0);

  const handleCollapsedClick = useCallback(() => {
    // Spec D4 : ouvrir la sidebar, afficher les libellés et le groupe sélectionné.
    onExpandSidebar?.();
    onOpenChange(true);
    onFlyoutOpenChange(false);
  }, [onExpandSidebar, onFlyoutOpenChange, onOpenChange]);

  useEffect(() => {
    if (!flyoutOpen || collapsed) return;
    onFlyoutOpenChange(false);
  }, [collapsed, flyoutOpen, onFlyoutOpenChange]);

  useEffect(() => {
    if (!flyoutOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!flyoutRef.current?.contains(event.target as Node)) {
        onFlyoutOpenChange(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onFlyoutOpenChange(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [flyoutOpen, onFlyoutOpenChange]);

  if (collapsed) {
    return (
      <div ref={flyoutRef} className="relative">
        <button
          type="button"
          title={group.label}
          aria-label={group.label}
          aria-expanded={open}
          onClick={handleCollapsedClick}
          className={cn(
            "relative flex h-12 w-full items-center justify-center rounded-xl transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            active
              ? "bg-[var(--admin-sidebar-active)] text-white"
              : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
          )}
        >
          {Icon ? (
            <Icon className="size-6 shrink-0" strokeWidth={1.75} aria-hidden />
          ) : null}
          {groupBadgeCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--admin-red)]" />
          ) : null}
        </button>
        {flyoutOpen ? (
          <div
            role="menu"
            aria-label={group.label}
            className="absolute left-full top-0 z-50 ml-2 min-w-[196px] rounded-lg border border-white/10 bg-[#07152f] py-1.5 shadow-xl"
          >
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
              {group.label}
            </p>
            <ul className="space-y-0.5 px-1.5">
              {group.items.map((item) => {
                const itemActive = isNavActive(pathname, item.href);
                const count = resolveBadge(item.badgeKey, badges);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      onClick={() => {
                        onFlyoutOpenChange(false);
                        onNavigate?.();
                      }}
                      aria-current={itemActive ? "page" : undefined}
                      className={cn(
                        "flex h-9 items-center justify-between gap-2 rounded-md px-2.5 text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                        itemActive
                          ? "bg-[var(--admin-sidebar-active)] font-medium text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <span className="truncate">{item.label}</span>
                      {count !== null ? (
                        <span
                          className={cn(
                            "inline-flex min-w-[18px] items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold tabular-nums",
                            count > 0
                              ? badgeClassName(item.badgeKey ?? "notifications")
                              : "bg-white/15 text-white/80",
                          )}
                        >
                          {count > 99 ? "99+" : count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          active
            ? "text-white"
            : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
        )}
      >
        {Icon ? (
          <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
        ) : null}
        <span className="flex-1 truncate">{group.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        hidden={!open}
        className={cn(!open && "hidden")}
      >
        <ul className="space-y-0.5 pb-1">
          {group.items.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              badges={badges}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

type AdminSidebarNavProps = {
  badges: SidebarBadges;
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
  onExpandSidebar?: () => void;
  className?: string;
};

export function AdminSidebarNav({
  badges,
  role,
  collapsed = false,
  onNavigate,
  onExpandSidebar,
  className,
}: AdminSidebarNavProps) {
  const pathname = usePathname();
  const groups = useMemo(() => filterNavGroups(role), [role]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      if (!group.href) {
        initial[group.id] = groupHasActiveItem(pathname, group);
      }
    }
    return initial;
  });
  const [openFlyoutGroupId, setOpenFlyoutGroupId] = useState<string | null>(null);

  // Ouvre automatiquement le groupe actif sans setState dans un effect :
  // fusion dérivée au rendu (le toggle utilisateur reste prioritaire via openGroups).
  const resolvedOpenGroups = useMemo(() => {
    const next = { ...openGroups };
    for (const group of groups) {
      if (!group.href && groupHasActiveItem(pathname, group) && next[group.id] === undefined) {
        next[group.id] = true;
      }
    }
    return next;
  }, [openGroups, groups, pathname]);

  return (
    <nav
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-2",
        className,
      )}
      aria-label="Navigation admin"
      data-sidebar-collapsed={collapsed ? "true" : "false"}
    >
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          collapsed
            ? "justify-evenly gap-[clamp(0.35rem,1.2vh,0.85rem)]"
            : "space-y-2.5",
        )}
      >
        {groups.map((group) => {
          if (group.href) {
            return (
              <TopLevelNavLink
                key={group.id}
                group={group}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            );
          }

          return (
            <NavGroupAccordion
              key={group.id}
              group={group}
              badges={badges}
              collapsed={collapsed}
              open={resolvedOpenGroups[group.id] ?? false}
              onOpenChange={(next) =>
                setOpenGroups((prev) => ({ ...prev, [group.id]: next }))
              }
              onNavigate={onNavigate}
              onExpandSidebar={onExpandSidebar}
              flyoutOpen={openFlyoutGroupId === group.id}
              onFlyoutOpenChange={(next) =>
                setOpenFlyoutGroupId(next ? group.id : null)
              }
            />
          );
        })}
      </div>
    </nav>
  );
}

type AdminSidebarProps = {
  badges: SidebarBadges;
  role: Role;
  className?: string;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export function AdminSidebar({
  badges,
  role,
  className,
  onNavigate,
  collapsed = false,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const expandSidebar = useCallback(() => {
    if (collapsed) onToggleCollapsed?.();
  }, [collapsed, onToggleCollapsed]);

  return (
    <aside
      data-admin-sidebar
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "flex h-full shrink-0 flex-col text-[var(--admin-sidebar-text)] transition-[width] duration-200 ease-out",
        collapsed
          ? "w-[var(--admin-sidebar-width-collapsed)]"
          : "w-[var(--admin-sidebar-width)]",
        className,
      )}
      style={{
        background:
          "linear-gradient(180deg, var(--admin-sidebar-top) 0%, var(--admin-sidebar-bottom) 100%)",
      }}
    >
      <div className="shrink-0 border-b border-white/10 px-2.5 py-2.5">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/20 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={collapsed ? "Ouvrir la barre latérale" : "Réduire la barre latérale"}
            aria-expanded={!collapsed}
            title={collapsed ? "Ouvrir la barre latérale" : "Réduire la barre latérale"}
          >
            <Image
              src={siteConfig.logo.src}
              alt=""
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          </button>
          <div
            className={cn(
              "min-w-0 transition-opacity duration-200",
              collapsed ? "sr-only opacity-0" : "opacity-100",
            )}
          >
            <p className="font-display text-[13.5px] font-bold leading-tight">
              {siteConfig.shortName}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--admin-sidebar-muted)]">
              Alliance des Femmes pour le Développement
            </p>
          </div>
          {!collapsed && onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Réduire la barre latérale"
            >
              <PanelLeftClose className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <AdminSidebarNav
        badges={badges}
        role={role}
        collapsed={collapsed}
        onNavigate={onNavigate}
        onExpandSidebar={expandSidebar}
      />

      <div className="mt-auto shrink-0 border-t border-white/10 p-2.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Voir le site public" : undefined}
          aria-label="Voir le site public"
          className={cn(
            "inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--admin-primary)] text-[12px] font-semibold text-white transition duration-200 hover:bg-[var(--admin-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            collapsed ? "h-12 px-0" : "h-10",
          )}
          data-admin-public-site
        >
          <ExternalLink
            className={cn("shrink-0", collapsed ? "size-5" : "size-4")}
            aria-hidden
          />
          <span className={cn(collapsed && "sr-only")}>Voir le site public</span>
        </Link>
      </div>
    </aside>
  );
}
