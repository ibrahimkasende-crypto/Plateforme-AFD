import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { refundDon } from "@/features/dons/actions/manage-don";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDonRemboursements, getAdminDonTransactions } from "@/lib/queries/admin/dons";

export default async function AdminDonsRemboursementsPage() {
  await requirePermission("payments:manage");
  const [remboursements, transactions] = await Promise.all([
    getAdminDonRemboursements(),
    getAdminDonTransactions(),
  ]);

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Remboursements"
        description="Gestion des remboursements de dons."
        actions={
          <Link href="/admin/dons/transactions" className="rounded border px-3 py-2 text-sm">
            Transactions
          </Link>
        }
      />
      {remboursements.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun remboursement"
          description="Les remboursements effectués s'affichent ici. Vous pouvez rembourser une transaction confirmée."
          createHref="/admin/dons/transactions"
          createLabel="Voir les transactions"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Donateur</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {remboursements.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>{item.donor_name}</td>
                  <td>
                    {item.amount} {item.currency ?? "USD"}
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {transactions.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Rembourser une transaction</h2>
          <div className="overflow-x-auto rounded border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-3">Donateur</th>
                  <th>Montant</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((item) => (
                  <tr className="border-t" key={item.id}>
                    <td className="p-3">{item.donor_name}</td>
                    <td>
                      {item.amount} {item.currency ?? "USD"}
                    </td>
                    <td className="p-3 text-right">
                      <form action={refundDon.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Rembourser
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}
