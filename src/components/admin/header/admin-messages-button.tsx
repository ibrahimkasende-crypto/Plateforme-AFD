"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminMessagesButtonProps = {
  count: number | null;
  className?: string;
};

function formatBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}

export function AdminMessagesButton({
  count,
  className,
}: AdminMessagesButtonProps) {
  const value = count ?? 0;
  const hasPending = value > 0;

  return (
    <Link
      href="/admin/messages?status=nouveau"
      className={cn(
        "relative inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40",
        className,
      )}
      aria-label={
        hasPending ? `${value} messages non traités` : "Messages"
      }
      title="Messages"
    >
      <MessageSquare className="size-5 shrink-0 text-slate-600" aria-hidden />
      <span className="hidden text-[12px] font-semibold sm:inline">Messages</span>
      <span
        className={cn(
          "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
          hasPending
            ? "bg-red-500 text-white"
            : "bg-slate-200 text-slate-600",
        )}
      >
        {formatBadge(value)}
      </span>
    </Link>
  );
}
