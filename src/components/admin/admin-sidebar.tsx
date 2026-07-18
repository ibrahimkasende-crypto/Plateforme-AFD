"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  FolderKanban,
  Handshake,
  Images,
  LayoutDashboard,
  ListChecks,
  Mail,
  Map as MapIcon,
  MessageSquare,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Settings,
  Shield,
  Target,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { adminSidebarItems } from "@/config/admin-navigation";
import type { AdminNavBadgeKey, AdminNavItem } from "@/config/admin-navigation";
import { navItemAllowed } from "@/config/admin-nav-permissions";
import { siteConfig } from "@/config/site";
import { roleHasPermission } from "@/config/permissions";
import type { Role } from "@/config/roles";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import { cn } from "@/lib/utils";

export const adminNavIconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  ListChecks,
  Users,
  Target,
  Wallet,
  Map: MapIcon,
  Newspaper,
  Images,
  Mail,
  MessageSquare,
  Handshake,
  UsersRound,
  FileText,
  Shield,
  Settings,
  ScrollText,
};

type NavGroup = {
  id: string;
  label: string;
  hrefs: string[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "actions",
    label: "Gestion des actions",
    hrefs: [
      "/admin/programmes",
      "/admin/projets",
      "/admin/activites",
      "/admin/beneficiaires",
      "/admin/indicateurs",
    ],
  },
  {
    id: "com",
    label: "Communication",
    hrefs: ["/admin/actualites", "/admin/mediatheque", "/admin/newsletter"],
  },
  {
    id: "org",
    label: "Organisation",
    hrefs: ["/admin/partenaires", "/admin/equipe"],
  },
  {
    id: "admin",
    label: "Administration",
    hrefs: [
      "/admin/rapports",
      "/admin/utilisateurs",
      "/admin/parametres",
      "/admin/journal-activite",
    ],
  },
];

const PINNED_HREFS = new Set([
  "/admin",
  "/admin/finances",
  "/admin/zones-intervention",
  "/admin/publications",
  "/admin/messages",
  "/admin/opportunites",
  "/admin/enquetes",
  "/admin/agents",
  "/admin/candidatures",
  "/admin/documents",
]);

function badgeClassName(key: AdminNavBadgeKey): string {
  if (key === "newsletter") return "bg-[var(--admin-green)] text-white";
  if (key === "messages") return "bg-[var(--admin-red)] text-white";
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

function filterSidebarItems(role: Role) {
  const has = (permission: Parameters<typeof roleHasPermission>[1]) =>
    roleHasPermission(role, permission);
  return adminSidebarItems.filter((item) => navItemAllowed(item.href, has));
}

function NavLinkRow({
  item,
  badges,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  badges: SidebarBadges;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon ? adminNavIconMap[item.icon] : undefined;
  const active = isNavActive(pathname, item.href);
  const count = resolveBadge(item.badgeKey, badges);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        aria-label={collapsed ? item.label : undefined}
        className={cn(
          "group relative flex h-[36px] items-center rounded-[8px] text-[13px] transition-colors",
          collapsed ? "justify-center px-0" : "gap-2.5 px-2.5",
          active
            ? "bg-[var(--admin-sidebar-active)] font-medium text-white"
            : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
        )}
      >
        {Icon ? (
          <Icon className="size-[17px] shrink-0" strokeWidth={1.75} aria-hidden />
        ) : null}
        <span
          className={cn(
            "flex-1 truncate transition-opacity duration-200",
            collapsed ? "sr-only opacity-0" : "opacity-100",
          )}
        >
          {item.label}
        </span>
        {!collapsed && count !== null && count > 0 ? (
          <span
            className={cn(
              "inline-flex min-w-[18px] items-center justify-center rounded-full px-1 py-0.5 text-[9px] font-semibold",
              badgeClassName(item.badgeKey ?? "notifications"),
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
        {!collapsed && (count === null || count <= 0) ? (
          <ChevronRight className="size-3 shrink-0 opacity-35" aria-hidden />
        ) : null}
        {collapsed && count !== null && count > 0 ? (
          <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[var(--admin-red)]" />
        ) : null}
        {collapsed ? (
          <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-md bg-[#07152f] px-2 py-1 text-[11px] text-white shadow-lg group-hover:block group-focus-visible:block">
            {item.label}
          </span>
        ) : null}
      </Link>
    </li>
  );
}

type AdminSidebarNavProps = {
  badges: SidebarBadges;
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebarNav({
  badges,
  role,
  collapsed = false,
  onNavigate,
  className,
}: AdminSidebarNavProps) {
  const pathname = usePathname();
  const items = filterSidebarItems(role);
  const byHref = useMemo(
    () => new Map(items.map((item) => [item.href, item])),
    [items],
  );

  const pinned = items.filter((item) => PINNED_HREFS.has(item.href));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of NAV_GROUPS) {
      initial[group.id] = group.hrefs.some((href) => isNavActive(pathname, href));
    }
    return initial;
  });

  return (
    <nav
      className={cn("min-h-0 flex-1 overflow-y-auto px-2 py-1.5", className)}
      aria-label="Navigation admin"
    >
      <ul className="space-y-[3px]">
        {pinned.map((item) => (
          <NavLinkRow
            key={item.href}
            item={item}
            badges={badges}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </ul>

      {NAV_GROUPS.map((group) => {
        const groupItems = group.hrefs
          .map((href) => byHref.get(href))
          .filter((item): item is AdminNavItem => Boolean(item));
        if (groupItems.length === 0) return null;
        const open = collapsed ? true : (openGroups[group.id] ?? true);

        return (
          <div key={group.id} className="mt-2">
            {!collapsed ? (
              <button
                type="button"
                className="mb-0.5 flex h-7 w-full items-center justify-between rounded-md px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--admin-sidebar-muted)]/80 hover:bg-white/5"
                aria-expanded={open}
                onClick={() =>
                  setOpenGroups((prev) => ({ ...prev, [group.id]: !open }))
                }
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    open ? "rotate-0" : "-rotate-90",
                  )}
                  aria-hidden
                />
              </button>
            ) : null}
            {open ? (
              <ul className="space-y-[3px]">
                {groupItems.map((item) => (
                  <NavLinkRow
                    key={item.href}
                    item={item}
                    badges={badges}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
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
          {collapsed && onToggleCollapsed ? (
            <span className="sr-only">
              <PanelLeftOpen />
            </span>
          ) : null}
        </div>
      </div>

      <AdminSidebarNav
        badges={badges}
        role={role}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      <div className="mt-auto shrink-0 border-t border-white/10 p-2.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? "Voir le site public" : undefined}
          aria-label="Voir le site public"
          className={cn(
            "inline-flex h-[40px] w-full items-center justify-center gap-1.5 rounded-md bg-[var(--admin-primary)] text-[12px] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            collapsed && "px-0",
          )}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden />
          <span className={cn(collapsed && "sr-only")}>Voir le site public</span>
        </Link>
      </div>
    </aside>
  );
}
