import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminStockMouvementsPage() {
  await requirePermission("stocks:read");
  const supabase = await createClientSafe();
  let rows: Array<Record<string, unknown>> = [];
  if (supabase) {
    const { data } = await supabase
      .from("stock_mouvements" as never)
      .select(
        "id, type, quantite, sens, reference, created_at, article_id, entrepot_id",
      )
      .order("created_at", { ascending: false })
      .limit(100);
    rows = (data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Mouvements de stock"
        description="Historique des entrées, sorties et ajustements."
        createHref={"/admin/stocks"}
        createLabel={"Retour stocks"}
      />
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Date</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Sens</th>
              <th>Référence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={String(row.id)}>
                <td className="p-3">
                  {String(row.created_at ?? "")
                    .slice(0, 19)
                    .replace("T", " ")}
                </td>
                <td>{String(row.type)}</td>
                <td>{String(row.quantite)}</td>
                <td>{Number(row.sens) > 0 ? "+" : "-"}</td>
                <td>{String(row.reference ?? "—")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
