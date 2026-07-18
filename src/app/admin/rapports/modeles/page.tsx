import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminModeles } from "@/lib/queries/admin/newsletter-admin";

export default async function AdminRapportsModelesPage() {
  await requirePermission("rapports:read");
  const modeles = await getAdminModeles();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Modèles de rapport"
        description="Modèles réutilisables (réutilise les modèles newsletter comme base)."
        actions={
          <Link href="/admin/rapports/nouveau" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
            Nouveau rapport
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {modeles.length === 0 ? (
          <p className="text-sm text-[var(--afd-muted)]">
            Aucun modèle disponible. Créez un modèle dans la section newsletter ou générez un rapport directement.
          </p>
        ) : (
          modeles.map((m) => (
            <div key={m.id} className="rounded border bg-white p-4">
              <h2 className="font-semibold">{m.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--afd-muted)]">{m.body}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
