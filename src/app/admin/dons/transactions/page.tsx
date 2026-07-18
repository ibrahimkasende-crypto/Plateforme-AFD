import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDonTransactions } from "@/lib/queries/admin/dons";

export default async function AdminDonsTransactionsPage() {
  await requirePermission("payments:read");
  const items = await getAdminDonTransactions();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Transactions de don"
        description="Dons confirmés et payés."
        actions={
          <Link href="/admin/dons" className="rounded border px-3 py-2 text-sm">
            Retour aux dons
          </Link>
        }
      />
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune transaction"
          description="Les dons confirmés apparaîtront ici."
          createHref="/admin/dons/intentions"
          createLabel="Voir les intentions"
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
              {items.map((item) => (
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
    </main>
  );
}
