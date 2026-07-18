"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronRight,
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
import { assets } from "@/config/assets";
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
    <nav
      className={cn("min-h-0 flex-1 overflow-y-auto px-2.5 py-2", className)}
      aria-label="Navigation admin"
    >
      <ul className="space-y-0.5">
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
                  "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors",
                  active
                    ? "bg-[var(--admin-sidebar-active)] font-medium text-white"
                    : "text-[var(--admin-sidebar-muted)] hover:bg-white/10 hover:text-white",
                )}
              >
                {Icon ? (
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                ) : null}
                <span className="flex-1 truncate">{item.label}</span>
                {count !== null && count > 0 ? (
                  <span
                    className={cn(
                      "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      badgeClassName(item.badgeKey ?? "notifications"),
                    )}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                ) : (
                  <ChevronRight
                    className="size-3.5 shrink-0 opacity-40"
                    aria-hidden
                  />
                )}
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
        "flex h-full w-[var(--admin-sidebar-width)] shrink-0 flex-col text-[var(--admin-sidebar-text)]",
        className,
      )}
      style={{
        background:
          "linear-gradient(180deg, var(--admin-sidebar-top) 0%, var(--admin-sidebar-bottom) 100%)",
      }}
    >
      <div className="shrink-0 border-b border-white/10 px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/20">
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[14px] font-bold leading-tight">
              {siteConfig.shortName}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--admin-sidebar-muted)]">
              Alliance des Femmes pour le Développement
            </p>
          </div>
        </div>
      </div>

      <AdminSidebarNav badges={badges} role={role} onNavigate={onNavigate} />

      <div className="mt-auto shrink-0 border-t border-white/10 px-3 py-2.5">
        <div className="overflow-hidden rounded-lg bg-white/5">
          <div className="relative h-12 w-full">
            <Image
              src={assets.home.presentation}
              alt=""
              fill
              className="object-cover opacity-90"
              sizes="220px"
            />
          </div>
          <div className="px-2.5 py-2">
            <p className="text-[10px] font-semibold text-white">AFD ASBL</p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--admin-sidebar-muted)]">
              Réinventer l&apos;avenir de chaque voix et le leadership des femmes
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-[var(--admin-primary)] text-[11px] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)]"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              Voir le site public
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
