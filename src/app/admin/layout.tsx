import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--adf-surface)]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[var(--adf-border)] bg-white px-6 py-4">
          <p className="text-sm font-medium text-[var(--adf-muted)]">
            Espace d’administration — Plateforme-ADF
          </p>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
