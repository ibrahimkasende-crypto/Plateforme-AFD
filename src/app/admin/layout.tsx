import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/require-admin";
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
  try {
    const bundle = await getDashboardBundle();
    badges = bundle.badges;
  } catch {
    // Conserver des badges vides si le chargement échoue.
  }

  return (
    <AdminShell badges={badges} viewer={session.viewer}>
      {children}
    </AdminShell>
  );
}
