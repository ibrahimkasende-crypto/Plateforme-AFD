"use client";

import Link from "next/link";
import {
  FileText,
  ListChecks,
  Palette,
  Plus,
  Send,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/admin/projets/nouveau",
    label: "Ajouter un projet",
    icon: Plus,
  },
  {
    href: "/admin/activites/nouvelle",
    label: "Ajouter une activité",
    icon: ListChecks,
  },
  {
    href: "/admin/beneficiaires/nouveau",
    label: "Ajouter un bénéficiaire",
    icon: UserPlus,
  },
  {
    href: "/admin/rapports/nouveau",
    label: "Générer un rapport",
    icon: FileText,
  },
  {
    href: "/admin/newsletter/campagnes/nouvelle",
    label: "Envoyer une newsletter",
    icon: Send,
  },
] as const;

type DashboardQuickActionsProps = {
  className?: string;
  compact?: boolean;
};

export function DashboardQuickActions({
  className,
  compact = false,
}: DashboardQuickActionsProps) {
  return (
    <div className={cn(compact ? "space-y-1.5" : "space-y-3", className)}>
      {actions.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--admin-primary)] font-semibold text-white transition hover:bg-[var(--admin-primary-dark)]",
            compact ? "h-8 px-2 text-[11px]" : "h-10 px-4 text-sm",
          )}
        >
          <Icon className={compact ? "size-3.5" : "size-4"} aria-hidden />
          {label}
        </Link>
      ))}
      <Link
        href="/admin/parametres?customize=dashboard"
        className={cn(
          "inline-flex w-full items-center justify-center gap-1.5 font-medium text-[var(--admin-primary)] hover:underline",
          compact ? "h-7 text-[11px]" : "text-sm",
        )}
      >
        <Palette className="size-3.5" aria-hidden />
        Personnaliser le tableau de bord
      </Link>
    </div>
  );
}
