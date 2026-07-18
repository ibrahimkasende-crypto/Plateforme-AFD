import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getNewsletterStats } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterStatistiquesPage() {
  await requirePermission("newsletter:read");
  const stats = await getNewsletterStats();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Statistiques newsletter"
        description="Vue synthétique de l'audience et des campagnes."
        actions={
          <Link href="/admin/newsletter" className="rounded border px-3 py-2 text-sm">
            Retour newsletter
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Abonnés actifs</p>
          <p className="text-3xl font-bold">{stats.abonnesActifs}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Campagnes envoyées</p>
          <p className="text-3xl font-bold">{stats.campagnesEnvoyees}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Brouillons</p>
          <p className="text-3xl font-bold">{stats.campagnesBrouillon}</p>
        </div>
      </div>
    </main>
  );
}
