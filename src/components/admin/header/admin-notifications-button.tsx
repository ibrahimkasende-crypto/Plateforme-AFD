"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/notifications/actions/manage-notifications";
import { cn } from "@/lib/utils";

export type HeaderNotificationPreview = {
  id: string;
  titre: string;
  message: string;
  created_at: string | null;
  lien: string | null;
  lu_at: string | null;
  priorite: string | null;
};

type AdminNotificationsButtonProps = {
  count: number | null;
  previews?: HeaderNotificationPreview[];
  className?: string;
};

function formatBadge(count: number): string {
  return count > 99 ? "99+" : String(count);
}

export function AdminNotificationsButton({
  count,
  previews = [],
  className,
}: AdminNotificationsButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const value = count ?? 0;
  const hasUnread = value > 0;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40"
        aria-label={
          hasUnread ? `${value} notifications non lues` : "Notifications"
        }
        aria-expanded={open}
        title="Notifications"
      >
        <Bell className="size-5 shrink-0 text-slate-600" aria-hidden />
        <span className="hidden text-[12px] font-semibold sm:inline">
          Notifications
        </span>
        <span
          className={cn(
            "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
            hasUnread
              ? "bg-red-500 text-white"
              : "bg-slate-200 text-slate-600",
          )}
        >
          {formatBadge(value)}
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Fermer les notifications"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <p className="text-sm font-semibold text-[var(--admin-text)]">
                Notifications
                <span className="ml-2 text-xs font-normal text-[var(--admin-muted)]">
                  ({value})
                </span>
              </p>
              <button
                type="button"
                disabled={pending || !hasUnread}
                className="text-xs font-medium text-[var(--afd-blue)] disabled:opacity-50"
                onClick={() => {
                  startTransition(async () => {
                    await markAllNotificationsReadAction();
                    setOpen(false);
                  });
                }}
              >
                Tout marquer comme lu
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {previews.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--admin-muted)]">
                  Aucune notification récente
                </li>
              ) : (
                previews.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "border-b border-slate-50 px-3 py-2.5 last:border-0",
                      !item.lu_at && "bg-slate-50/80",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!item.lu_at ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-500" />
                      ) : (
                        <span className="mt-1.5 size-2 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--admin-text)]">
                          {item.titre}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-[var(--admin-muted)]">
                          {item.message}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                          {item.lien ? (
                            <Link
                              href={item.lien}
                              className="font-medium text-[var(--afd-blue)]"
                              onClick={() => setOpen(false)}
                            >
                              Ouvrir
                            </Link>
                          ) : null}
                          {!item.lu_at ? (
                            <button
                              type="button"
                              className="text-[var(--admin-muted)]"
                              onClick={() => {
                                startTransition(async () => {
                                  await markNotificationReadAction(item.id);
                                });
                              }}
                            >
                              Lu
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t px-3 py-2">
              <Link
                href="/admin/notifications"
                className="text-sm font-medium text-[var(--afd-blue)]"
                onClick={() => setOpen(false)}
              >
                Voir toutes les notifications
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Alias rétrocompatible */
export { AdminNotificationsButton as AdminNotifications };
