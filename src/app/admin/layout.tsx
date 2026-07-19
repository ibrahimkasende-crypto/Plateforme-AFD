import { AdminShell } from "@/components/admin/admin-shell";
import type { HeaderNotificationPreview } from "@/components/admin/header/admin-notifications-button";
import {
  countUnreadNotifications,
  listUserNotifications,
} from "@/features/notifications/services/notifications.service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { getDashboardBundle } from "@/services/dashboard.service";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import type { ReactNode } from "react";

const EMPTY_BADGES: SidebarBadges = {
  newsletter: null,
  messages: null,
  adhesions: null,
  notifications: null,
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  let badges: SidebarBadges = EMPTY_BADGES;
  let presentationMode = false;
  let notificationPreviews: HeaderNotificationPreview[] = [];

  try {
    const bundle = await getDashboardBundle();
    badges = bundle.badges;
    presentationMode = Boolean(bundle.presentationMode ?? bundle.demoMode);
  } catch {
    // Conserver des badges vides si le chargement échoue.
  }

  try {
    const supabase = await createClientSafe();
    if (supabase) {
      const unread = await countUnreadNotifications(supabase, session.user.id);
      if (unread > 0 || badges.notifications == null) {
        badges = { ...badges, notifications: unread };
      }
      const rows = await listUserNotifications(supabase, session.user.id, {
        limit: 8,
      });
      notificationPreviews = rows.map((r) => ({
        id: r.id,
        titre: r.titre,
        message: r.message,
        created_at: r.created_at,
        lien: r.lien,
        lu_at: r.lu_at,
        priorite: r.priorite,
      }));
    }
  } catch {
    // Les notifications ne doivent pas bloquer le shell admin.
  }

  return (
    <AdminShell
      badges={badges}
      viewer={session.viewer}
      presentationMode={presentationMode}
      notificationPreviews={notificationPreviews}
    >
      {children}
    </AdminShell>
  );
}
