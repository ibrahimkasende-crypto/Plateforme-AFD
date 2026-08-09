import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import type { HeaderNotificationPreview } from "@/components/admin/header/admin-notifications-button";
import {
  countUnreadNotifications,
  listUserNotifications,
} from "@/features/notifications/services/notifications.service";
import { productBrand } from "@/config/product-brand";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";
import { getDashboardBundle } from "@/services/dashboard.service";
import { countCachedUnread } from "@/features/messagerie/services/mailbox.service";
import type { SidebarBadges } from "@/features/statistiques/types/dashboard";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: productBrand.adminMetadata.title,
  description: productBrand.adminMetadata.description,
  robots: { index: false, follow: false },
};

const EMPTY_BADGES: SidebarBadges = {
  newsletter: 0,
  messages: 0,
  adhesions: 0,
  notifications: 0,
  messagerie: null,
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
    badges = {
      newsletter: bundle.badges.newsletter ?? 0,
      messages: bundle.badges.messages ?? 0,
      adhesions: bundle.badges.adhesions ?? 0,
      notifications: bundle.badges.notifications ?? 0,
      messagerie: null,
    };
    presentationMode = Boolean(bundle.presentationMode ?? bundle.demoMode);
  } catch {
    // Conserver des badges à 0 si le chargement échoue.
  }

  try {
    const supabase = await createClientSafe();
    if (supabase) {
      const unread = await countUnreadNotifications(supabase, session.user.id);
      const mailUnread = await countCachedUnread(supabase, session.user.id);
      badges = {
        ...badges,
        notifications: unread,
        messagerie: mailUnread,
      };
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
