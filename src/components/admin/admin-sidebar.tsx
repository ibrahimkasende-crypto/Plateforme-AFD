"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  Handshake,
  Images,
  LayoutDashboard,
  ListChecks,
  Mail,
  Map,
  MessageSquare,
  Newspaper,
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
import type { AdminNavBadgeKey } from "@/config/admin-navigation";
import { navItemAllowed } from "@/config/admin-nav-permissions";
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
  Map,
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

function badgeClassName(key: AdminNavBadgeKey): string {
  if (key === "newsletter") return "bg-[#16a34a] text-white";
  if (key === "messages") return "bg-red-500 text-white";
  return "bg-[#2563eb] text-white";
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

type AdminSidebarNavProps = {
  badges: SidebarBadges;
  role: Role;
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebarNav({
  badges,
  role,
  onNavigate,
  className,
}: AdminSidebarNavProps) {
  const pathname = usePathname();
  const items = filterSidebarItems(role);

  return (
    <nav className={cn("flex-1 overflow-y-auto px-3 py-4", className)} aria-label="Navigation admin">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon ? adminNavIconMap[item.icon] : undefined;
          const active = isNavActive(pathname, item.href);
          const count = resolveBadge(item.badgeKey, badges);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-[#2563eb] font-medium text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white",
                )}
              >
                {Icon ? <Icon className="size-[18px] shrink-0" aria-hidden /> : null}
                <span className="flex-1 truncate">{item.label}</span>
                {count !== null && count > 0 ? (
                  <span
                    className={cn(
                      "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                      badgeClassName(item.badgeKey ?? "notifications"),
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
    </nav>
  );
}

type AdminSidebarProps = {
  badges: SidebarBadges;
  role: Role;
  className?: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ badges, role, className, onNavigate }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[260px] shrink-0 flex-col bg-[#0d254e] text-white",
        className,
      )}
    >
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0d254e]">
            AFD
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight">AFD ASBL</p>
            <p className="text-xs text-white/60">Administration</p>
          </div>
        </div>
      </div>

      <AdminSidebarNav badges={badges} role={role} onNavigate={onNavigate} />

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="rounded-xl bg-white/5 px-3 py-3 text-xs text-white/70">
          <p className="font-medium text-white/90">Plateforme institutionnelle</p>
          <p className="mt-1 leading-relaxed">
            Gestion des programmes, projets et indicateurs d&apos;impact AFD.
          </p>
        </div>
        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden />
          Voir le site public
        </Link>
      </div>
    </aside>
  );
}
