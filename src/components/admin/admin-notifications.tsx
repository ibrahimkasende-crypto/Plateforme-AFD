"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminNotificationsProps = {
  count: number | null;
  className?: string;
};

export function AdminNotifications({ count, className }: AdminNotificationsProps) {
  const displayCount = count && count > 0 ? (count > 99 ? "99+" : String(count)) : null;

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100",
        className,
      )}
      aria-label={
        displayCount
          ? `${displayCount} notification(s) non lue(s)`
          : "Notifications"
      }
    >
      <Bell className="size-5" aria-hidden />
      {displayCount ? (
        <span className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {displayCount}
        </span>
      ) : null}
    </button>
  );
}
