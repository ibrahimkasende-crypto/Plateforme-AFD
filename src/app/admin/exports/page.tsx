import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminExportsPage() {
  await requirePermission("rapports:export");

  const exports = [
    { label: "Bénéficiaires (CSV)", href: "/admin/beneficiaires" },
    { label: "Activités (CSV)", href: "/admin/activites" },
    { label: "Dons (CSV)", href: "/admin/dons" },
    { label: "Rapports générés", href: "/admin/rapports/historique" },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Exports"
        description="Accès rapide aux modules exportables. Les exports CSV seront branchés sur les RPC dédiées."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {exports.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded border bg-white p-4 font-medium text-[var(--afd-blue)] hover:bg-[var(--afd-surface)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
