import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AdminEmptyState } from "@/components/admin/data/admin-empty-state";
import {
  archiveStockArticleAction,
  createStockArticleAction,
  createStockMouvementAction,
} from "@/features/stocks/actions/manage-stocks";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  listStockArticles,
  listStockCategories,
  listStockDisponibles,
  listStockEntrepots,
} from "@/features/stocks/services/stocks.service";

export default async function AdminStocksPage() {
  await requirePermission("stocks:read");
  const supabase = await createClientSafe();
  const articles = supabase ? await listStockArticles(supabase) : [];
  const dispos = supabase ? await listStockDisponibles(supabase) : [];
  const entrepots = supabase ? await listStockEntrepots(supabase) : [];
  const categories = supabase ? await listStockCategories(supabase) : [];

  const dispoByArticle = new Map<string, number>();
  for (const row of dispos) {
    const id = String(row.article_id);
    dispoByArticle.set(
      id,
      (dispoByArticle.get(id) ?? 0) + Number(row.quantite_disponible ?? 0),
    );
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Stocks"
        description="Articles, entrepôts et mouvements. Quantités calculées depuis les mouvements."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/stocks/entrepots" className="rounded border px-3 py-2 text-sm">
              Entrepôts
            </Link>
            <Link href="/admin/stocks/categories" className="rounded border px-3 py-2 text-sm">
              Catégories
            </Link>
            <Link href="/admin/stocks/mouvements" className="rounded border px-3 py-2 text-sm">
              Mouvements
            </Link>
          </div>
        }
      />

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">Nouvel article</h2>
        <form action={createStockArticleAction} className="grid gap-3 sm:grid-cols-5">
          <input name="sku" required placeholder="SKU" className="rounded border p-2 text-sm" />
          <input name="nom" required placeholder="Nom" className="rounded border p-2 text-sm" />
          <select name="categorie_id" className="rounded border p-2 text-sm" defaultValue="">
            <option value="">Sans catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.nom}
              </option>
            ))}
          </select>
          <input name="seuil_min" type="number" defaultValue={0} className="rounded border p-2 text-sm" />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Créer
          </button>
        </form>
      </section>

      {entrepots.length > 0 && articles.length > 0 ? (
        <section className="rounded border bg-white p-4">
          <h2 className="mb-3 font-semibold">Enregistrer un mouvement</h2>
          <form action={createStockMouvementAction} className="grid gap-3 sm:grid-cols-5">
            <select name="article_id" required className="rounded border p-2 text-sm">
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.sku} — {a.nom}
                </option>
              ))}
            </select>
            <select name="entrepot_id" required className="rounded border p-2 text-sm">
              {entrepots.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nom}
                </option>
              ))}
            </select>
            <select name="type" className="rounded border p-2 text-sm" defaultValue="entree">
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="retour">Retour</option>
              <option value="ajustement">Ajustement</option>
              <option value="reservation">Réservation</option>
            </select>
            <input
              name="quantite"
              type="number"
              step="0.01"
              min="0.01"
              required
              className="rounded border p-2 text-sm"
            />
            <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
              Enregistrer
            </button>
          </form>
        </section>
      ) : (
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Créez au moins un entrepôt et un article pour enregistrer des mouvements.
        </p>
      )}

      {articles.length === 0 ? (
        <AdminEmptyState
          title="Aucun article"
          description="Créez un article puis un entrepôt pour enregistrer des mouvements."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">SKU</th>
                <th>Nom</th>
                <th>Disponible</th>
                <th>Seuil min</th>
                <th>Alerte</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const qty = dispoByArticle.get(a.id) ?? 0;
                const seuil = Number(a.seuil_min ?? 0);
                const alert = qty < seuil;
                return (
                  <tr className="border-t" key={a.id}>
                    <td className="p-3 font-mono text-xs">{a.sku}</td>
                    <td>{a.nom}</td>
                    <td className={alert ? "font-semibold text-red-700" : ""}>{qty}</td>
                    <td>{seuil}</td>
                    <td>{alert ? "Sous seuil" : "OK"}</td>
                    <td className="p-3 text-right">
                      <form action={archiveStockArticleAction} className="inline">
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className="text-red-700">
                          Archiver
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
