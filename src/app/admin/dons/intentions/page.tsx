import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { confirmDon } from "@/features/dons/actions/manage-don";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDonIntentions } from "@/lib/queries/admin/dons";

export default async function AdminDonsIntentionsPage() {
  await requirePermission("dons:read");
  const items = await getAdminDonIntentions();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Intentions de don"
        description="Dons en attente de confirmation."
        actions={
          <Link href="/admin/dons" className="rounded border px-3 py-2 text-sm">
            Tous les dons
          </Link>
        }
      />
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune intention en attente"
          description="Les nouvelles intentions de don s'affichent ici."
          createHref="/admin/dons"
          createLabel="Voir tous les dons"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Donateur</th>
                <th>Montant</th>
                <th />
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
                  <td className="p-3 text-right">
                    <form action={confirmDon.bind(null, item.id)} className="inline">
                      <button type="submit" className="text-[var(--afd-blue)]">
                        Confirmer
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
