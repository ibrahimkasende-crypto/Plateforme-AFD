import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getNewsletterStats } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminNewsletterPage() {
  await requirePermission("newsletter:read");
  const stats = await getNewsletterStats();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Newsletter"
        description="Abonnés, campagnes et modèles d'e-mails."
        actions={
          <>
            <Link href="/admin/newsletter/abonnes" className="rounded border px-3 py-2 text-sm">
              Abonnés
            </Link>
            <Link href="/admin/newsletter/campagnes" className="rounded border px-3 py-2 text-sm">
              Campagnes
            </Link>
            <Link href="/admin/newsletter/modeles" className="rounded border px-3 py-2 text-sm">
              Modèles
            </Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Abonnés actifs</p>
          <p className="text-2xl font-bold">{stats.abonnesActifs}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Campagnes envoyées</p>
          <p className="text-2xl font-bold">{stats.campagnesEnvoyees}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Brouillons</p>
          <p className="text-2xl font-bold">{stats.campagnesBrouillon}</p>
        </div>
      </div>
    </main>
  );
}
