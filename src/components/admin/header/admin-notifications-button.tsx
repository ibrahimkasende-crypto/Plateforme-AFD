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
  const show = count != null && count > 0;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40"
        aria-label={
          show ? `${count} notifications non lues` : "Notifications"
        }
        aria-expanded={open}
        title="Notifications"
      >
        <Bell className="size-5" aria-hidden />
        {show ? (
          <span
            className="absolute right-1.5 top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
            aria-hidden
          >
            {formatBadge(count)}
          </span>
        ) : null}
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
              </p>
              <button
                type="button"
                disabled={pending}
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
