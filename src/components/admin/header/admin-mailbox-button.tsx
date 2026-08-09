"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  count: number | null;
  className?: string;
};

function formatBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}

/**
 * Accès messagerie professionnelle (distinct des messages de contact).
 * Badge masqué si count = 0 ou null (IMAP non synchronisé).
 */
export function AdminMailboxButton({ count, className }: Props) {
  const value = count ?? 0;
  const showBadge = count != null && value > 0;

  return (
    <Link
      href="/admin/messagerie"
      className={cn(
        "relative inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40",
        className,
      )}
      aria-label={
        showBadge
          ? `${value} messages non lus — Messagerie`
          : "Messagerie professionnelle"
      }
      title="Messagerie professionnelle"
    >
      <Mail className="size-5 shrink-0 text-slate-600" aria-hidden />
      <span className="hidden text-[12px] font-semibold lg:inline">
        Messagerie
      </span>
      {showBadge ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-red-500 px-1 py-0.5 text-[10px] font-bold tabular-nums text-white sm:static sm:min-w-[1.25rem] sm:px-1.5">
          {formatBadge(value)}
        </span>
      ) : null}
    </Link>
  );
}
