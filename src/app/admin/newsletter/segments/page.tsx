import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAbonnes } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterSegmentsPage() {
  await requirePermission("newsletter:read");
  const abonnes = await getAdminAbonnes({ statut: "actif" });

  const segments = [
    { id: "tous", label: "Tous les abonnés actifs", count: abonnes.length },
    {
      id: "consent",
      label: "Avec consentement explicite",
      count: abonnes.filter((a) => a.consentement).length,
    },
  ];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Segments"
        description="Segments d'audience dérivés des abonnés."
        actions={
          <Link href="/admin/newsletter/abonnes" className="rounded border px-3 py-2 text-sm">
            Voir les abonnés
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.id} className="rounded border bg-white p-4">
            <h2 className="font-semibold">{segment.label}</h2>
            <p className="mt-2 text-2xl font-bold">{segment.count}</p>
            <p className="text-sm text-[var(--afd-muted)]">contacts</p>
          </div>
        ))}
      </div>
    </main>
  );
}
