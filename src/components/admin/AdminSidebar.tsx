"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  FilePlus,
  FileText,
  Files,
  FolderKanban,
  Handshake,
  Heart,
  HeartHandshake,
  History,
  Images,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  Mail,
  Map,
  MessageSquare,
  Network,
  Newspaper,
  RotateCcw,
  ScrollText,
  Send,
  Settings,
  Shield,
  Target,
  UserPlus,
  UserRound,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { adminNavigation } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  ListChecks,
  Users,
  Target,
  Map,
  Wallet,
  HeartHandshake,
  CreditCard,
  RotateCcw,
  Newspaper,
  Images,
  Mail,
  UserRound,
  Send,
  UsersRound,
  Building2,
  Handshake,
  Network,
  MessageSquare,
  UserPlus,
  Heart,
  BarChart3,
  FileText,
  FilePlus,
  Files,
  History,
  Shield,
  KeyRound,
  Settings,
  ScrollText,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-[var(--afd-border)] bg-white">
      <div className="border-b border-[var(--afd-border)] px-5 py-4">
        <p className="font-display text-lg font-semibold text-[var(--afd-ink)]">
          Administration
        </p>
        <p className="text-xs text-[var(--afd-muted)]">Plateforme-AFD</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation admin">
        {adminNavigation.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--afd-muted)]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon ? iconMap[item.icon] : undefined;
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition",
                        active
                          ? "bg-[var(--afd-accent-soft)] font-medium text-[var(--afd-accent)]"
                          : "text-[var(--afd-ink)] hover:bg-[var(--afd-surface)]",
                      )}
                    >
                      {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
