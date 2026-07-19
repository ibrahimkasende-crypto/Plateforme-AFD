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
  const show = count != null && count > 0;

  return (
    <Link
      href="/admin/messages?status=nouveau"
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40",
        className,
      )}
      aria-label={
        show ? `${count} messages non traités` : "Messages"
      }
      title="Messages"
    >
      <MessageSquare className="size-5" aria-hidden />
      {show ? (
        <span
          className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
          aria-hidden
        >
          {formatBadge(count)}
        </span>
      ) : null}
    </Link>
  );
}
