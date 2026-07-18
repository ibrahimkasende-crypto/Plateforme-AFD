import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { confirmDon } from "@/features/dons/actions/manage-don";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDons } from "@/lib/queries/admin/dons";

export default async function AdminDonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("dons:read");
  const { q, status } = await searchParams;
  const items = await getAdminDons({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Dons"
        description="Intentions et transactions de don."
        actions={
          <>
            <Link href="/admin/dons/intentions" className="rounded border px-3 py-2 text-sm">
              Intentions
            </Link>
            <Link href="/admin/dons/transactions" className="rounded border px-3 py-2 text-sm">
              Transactions
            </Link>
            <Link href="/admin/dons/remboursements" className="rounded border px-3 py-2 text-sm">
              Remboursements
            </Link>
          </>
        }
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="pending">En attente</option>
          <option value="intent">Intention</option>
          <option value="confirmed">Confirmé</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun don enregistré"
          description="Les intentions de don soumises en ligne apparaîtront ici."
          createHref="/faire-un-don"
          createLabel="Page don public"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Donateur</th>
                <th>Montant</th>
                <th>Méthode</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>
                    <div>{item.donor_name}</div>
                    <div className="text-[var(--afd-muted)]">{item.donor_email}</div>
                  </td>
                  <td>
                    {item.amount} {item.currency ?? "USD"}
                  </td>
                  <td>{item.payment_method}</td>
                  <td>{item.status ?? "pending"}</td>
                  <td className="p-3 text-right">
                    {item.status === "pending" ? (
                      <form action={confirmDon.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Confirmer
                        </button>
                      </form>
                    ) : null}
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
