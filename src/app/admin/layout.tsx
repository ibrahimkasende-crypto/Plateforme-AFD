import { AdminShell } from "@/components/admin/admin-shell";
import { getDashboardBundle } from "@/services/dashboard.service";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const bundle = await getDashboardBundle();

  return (
    <AdminShell badges={bundle.badges} viewer={bundle.viewer}>
      {children}
    </AdminShell>
  );
}
