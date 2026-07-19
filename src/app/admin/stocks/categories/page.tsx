import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AdminEmptyState } from "@/components/admin/data/admin-empty-state";
import { createStockCategoryAction } from "@/features/stocks/actions/manage-stocks";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { listStockCategories } from "@/features/stocks/services/stocks.service";

export default async function AdminStockCategoriesPage() {
  await requirePermission("stocks:read");
  const supabase = await createClientSafe();
  const categories = supabase ? await listStockCategories(supabase) : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Catégories de stock"
        description="Classification des articles."
        actions={
          <Link href="/admin/stocks" className="rounded border px-3 py-2 text-sm">
            Retour stocks
          </Link>
        }
      />
      <form
        action={createStockCategoryAction}
        className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3"
      >
        <input name="code" required placeholder="Code" className="rounded border p-2 text-sm" />
        <input name="nom" required placeholder="Nom" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer
        </button>
      </form>
      {categories.length === 0 ? (
        <AdminEmptyState title="Aucune catégorie" description="Créez une catégorie pour classer les articles." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr className="border-t" key={c.id}>
                  <td className="p-3 font-mono text-xs">{c.code}</td>
                  <td>{c.nom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
