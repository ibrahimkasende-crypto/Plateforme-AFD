import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/notifications/actions/manage-notifications";
import { listUserNotifications } from "@/features/notifications/services/notifications.service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await requireAdmin("/admin/notifications");
  const { filter } = await searchParams;
  const supabase = await createClientSafe();
  const items = supabase
    ? await listUserNotifications(supabase, session.user.id, {
        unreadOnly: filter === "unread",
      })
    : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Notifications"
        description="Alertes système, projets, finance, RH et OCR."
        backFallbackHref="/admin"
        actions={
          <form action={markAllNotificationsReadAction}>
            <button
              type="submit"
              className="rounded border px-3 py-2 text-sm font-semibold"
            >
              Tout marquer comme lu
            </button>
          </form>
        }
      />

      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Toutes", href: "/admin/notifications" },
          { id: "unread", label: "Non lues", href: "/admin/notifications?filter=unread" },
        ].map((f) => (
          <Link
            key={f.id}
            href={f.href}
            className={
              (filter ?? "all") === f.id || (!filter && f.id === "all")
                ? "rounded-md bg-[var(--admin-primary)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--admin-primary)]"
                : "rounded-md px-3 py-1.5 text-sm text-[var(--admin-muted)] hover:bg-slate-50"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune notification"
          description="Les alertes apparaîtront ici selon vos permissions."
          createHref="/admin"
          createLabel="Retour au tableau de bord"
        />
      ) : (
        <ul className="divide-y rounded-xl border bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--admin-text)]">
                  {!item.lu_at ? (
                    <span className="mr-2 inline-block size-2 rounded-full bg-red-500" aria-hidden />
                  ) : null}
                  {item.titre}
                </p>
                <p className="mt-1 text-sm text-[var(--admin-muted)]">{item.message}</p>
                <p className="mt-1 text-xs text-[var(--admin-muted)]">
                  {item.created_at?.slice(0, 16)?.replace("T", " ") ?? "—"}
                  {item.module ? ` · ${item.module}` : ""}
                  {item.priorite ? ` · ${item.priorite}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {item.lien ? (
                  <Link
                    href={item.lien}
                    className="text-sm font-medium text-[var(--afd-blue)]"
                  >
                    Ouvrir
                  </Link>
                ) : null}
                {!item.lu_at ? (
                  <form action={markNotificationReadAction.bind(null, item.id)}>
                    <button type="submit" className="text-sm text-[var(--admin-muted)]">
                      Lu
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
