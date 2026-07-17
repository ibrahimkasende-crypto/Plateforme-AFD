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

const actionClassName =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4ed8]";

type DashboardQuickActionsProps = {
  className?: string;
};

export function DashboardQuickActions({ className }: DashboardQuickActionsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Link href="/admin/projets/nouveau" className={cn(actionClassName, "w-full")}>
        <Plus className="size-4" aria-hidden />
        Ajouter un projet
      </Link>
      <Link href="/admin/activites/nouveau" className={cn(actionClassName, "w-full")}>
        <ListChecks className="size-4" aria-hidden />
        Ajouter une activité
      </Link>
      <Link
        href="/admin/beneficiaires/nouveau"
        className={cn(actionClassName, "w-full")}
      >
        <UserPlus className="size-4" aria-hidden />
        Ajouter un bénéficiaire
      </Link>
      <Link
        href="/admin/rapports/nouveau"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
      >
        <FileText className="size-4" aria-hidden />
        Générer un rapport
      </Link>
      <Link
        href="/admin/newsletter/campagnes/nouveau"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
      >
        <Send className="size-4" aria-hidden />
        Envoyer une newsletter
      </Link>
      <Link
        href="/admin/parametres"
        className="inline-flex items-center gap-2 text-sm text-[#2563eb] hover:underline"
      >
        <Palette className="size-4" aria-hidden />
        Personnaliser
      </Link>
    </div>
  );
}
