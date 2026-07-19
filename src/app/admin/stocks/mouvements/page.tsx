import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { AdminEmptyState } from "@/components/admin/data/admin-empty-state";
import { createStockTransfertAction } from "@/features/stocks/actions/manage-stocks";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import {
  listStockArticles,
  listStockEntrepots,
  listStockMouvements,
} from "@/features/stocks/services/stocks.service";

export default async function AdminStockMouvementsPage() {
  await requirePermission("stocks:read");
  const supabase = await createClientSafe();
  const mouvements = supabase ? await listStockMouvements(supabase, 150) : [];
  const articles = supabase ? await listStockArticles(supabase) : [];
  const entrepots = supabase ? await listStockEntrepots(supabase) : [];

  const articleMap = new Map(articles.map((a) => [a.id, a]));
  const entrepotMap = new Map(entrepots.map((e) => [e.id, e]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Mouvements de stock"
        description="Historique des entrées, sorties et transferts."
        actions={
          <Link href="/admin/stocks" className="rounded border px-3 py-2 text-sm">
            Retour stocks
          </Link>
        }
      />

      {articles.length > 0 && entrepots.length > 1 ? (
        <section className="rounded border bg-white p-4">
          <h2 className="mb-3 font-semibold">Transfert inter-entrepôts</h2>
          <form action={createStockTransfertAction} className="grid gap-3 sm:grid-cols-5">
            <select name="article_id" required className="rounded border p-2 text-sm">
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.sku} — {a.nom}
                </option>
              ))}
            </select>
            <select name="from_entrepot_id" required className="rounded border p-2 text-sm">
              {entrepots.map((e) => (
                <option key={e.id} value={e.id}>
                  De : {e.nom}
                </option>
              ))}
            </select>
            <select name="to_entrepot_id" required className="rounded border p-2 text-sm">
              {entrepots.map((e) => (
                <option key={e.id} value={e.id}>
                  Vers : {e.nom}
                </option>
              ))}
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
              Transférer
            </button>
          </form>
        </section>
      ) : null}

      {mouvements.length === 0 ? (
        <AdminEmptyState title="Aucun mouvement" description="Les mouvements apparaîtront ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Article</th>
                <th>Entrepôt</th>
                <th>Type</th>
                <th>Qté</th>
                <th>Réf.</th>
              </tr>
            </thead>
            <tbody>
              {mouvements.map((m) => {
                const article = articleMap.get(m.article_id);
                const entrepot = entrepotMap.get(m.entrepot_id);
                return (
                  <tr className="border-t" key={m.id}>
                    <td className="p-3">{String(m.created_at ?? "").slice(0, 16)}</td>
                    <td>{article ? `${article.sku} — ${article.nom}` : m.article_id}</td>
                    <td>{entrepot?.nom ?? m.entrepot_id}</td>
                    <td>{m.type}</td>
                    <td>
                      {m.sens === -1 ? "−" : "+"}
                      {m.quantite}
                    </td>
                    <td className="font-mono text-xs">{m.reference ?? "—"}</td>
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
