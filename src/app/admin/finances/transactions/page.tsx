import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDons } from "@/lib/queries/admin/dons";

export default async function AdminFinancesTransactionsPage() {
  await requirePermission("finances:read");
  const items = await getAdminDons();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Transactions financières"
        description="Flux financiers incluant les dons enregistrés."
        actions={
          <Link href="/admin/dons/transactions" className="rounded border px-3 py-2 text-sm">
            Dons confirmés
          </Link>
        }
      />
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune transaction"
          description="Les dons et mouvements financiers apparaîtront ici."
          createHref="/admin/finances/budgets"
          createLabel="Gérer les budgets"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Libellé</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>Don — {item.donor_name}</td>
                  <td>
                    {item.amount} {item.currency ?? "USD"}
                  </td>
                  <td>{item.status ?? "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
