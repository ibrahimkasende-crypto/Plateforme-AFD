import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AdminEmptyState } from "@/components/admin/data/admin-empty-state";
import {
  archiveStockEntrepotAction,
  createStockEntrepotAction,
} from "@/features/stocks/actions/manage-stocks";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { listStockEntrepots } from "@/features/stocks/services/stocks.service";

export default async function AdminStockEntrepotsPage() {
  await requirePermission("stocks:read");
  const supabase = await createClientSafe();
  const entrepots = supabase ? await listStockEntrepots(supabase) : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Entrepôts"
        description="Lieux de stockage physiques."
        actions={
          <Link href="/admin/stocks" className="rounded border px-3 py-2 text-sm">
            Retour stocks
          </Link>
        }
      />
      <form
        action={createStockEntrepotAction}
        className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4"
      >
        <input name="code" required placeholder="Code" className="rounded border p-2 text-sm" />
        <input name="nom" required placeholder="Nom" className="rounded border p-2 text-sm" />
        <input name="province" placeholder="Province" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer
        </button>
      </form>
      {entrepots.length === 0 ? (
        <AdminEmptyState title="Aucun entrepôt" description="Créez un entrepôt pour stocker des articles." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Nom</th>
                <th>Province</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entrepots.map((e) => (
                <tr className="border-t" key={e.id}>
                  <td className="p-3 font-mono text-xs">{e.code}</td>
                  <td>{e.nom}</td>
                  <td>{e.province ?? "—"}</td>
                  <td className="p-3 text-right">
                    <form action={archiveStockEntrepotAction} className="inline">
                      <input type="hidden" name="id" value={e.id} />
                      <button type="submit" className="text-red-700">
                        Archiver
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
