import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminSystemePage() {
  await requirePermission("parametres:manage");

  const links = [
    { href: "/admin/parametres", label: "Paramètres du site" },
    { href: "/admin/journal-activite", label: "Journal d'activité" },
    { href: "/admin/securite", label: "Sécurité" },
    { href: "/admin/sauvegardes", label: "Sauvegardes" },
    { href: "/admin/exports", label: "Exports" },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Système" description="Administration technique de la plateforme." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded border bg-white p-4 font-medium hover:bg-[var(--afd-surface)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
