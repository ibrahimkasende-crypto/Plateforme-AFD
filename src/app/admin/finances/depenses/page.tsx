import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { saveDepense } from "@/features/finances/actions/manage-finances";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminDepenses } from "@/lib/queries/admin/finances";

export default async function AdminFinancesDepensesPage() {
  await requirePermission("finances:read");
  const items = await getAdminDepenses();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Dépenses"
        description="Dépenses enregistrées par programme ou projet."
        actions={
          <>
            <Link href="/admin/finances" className="rounded border px-3 py-2 text-sm">
              Vue finances
            </Link>
            <ImportRapportButton moduleCible="depenses" typeDocument="etat_depenses" />
          </>
        }
      />
      <form action={saveDepense} className="grid max-w-3xl gap-3 rounded border bg-white p-4 sm:grid-cols-2">
        <input required name="label" placeholder="Libellé" className="rounded border p-2 sm:col-span-2" />
        <input required type="number" step="0.01" name="amount" placeholder="Montant" className="rounded border p-2" />
        <input type="date" name="spent_at" className="rounded border p-2" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white sm:col-span-2">
          Enregistrer une dépense
        </button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucune dépense"
          description="Enregistrez les dépenses pour suivre l'exécution budgétaire."
          createHref="/admin/finances/depenses"
          createLabel="Ajouter ci-dessus"
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
                  <td className="p-3">{item.spent_at ?? "—"}</td>
                  <td>{item.label}</td>
                  <td>
                    {Number(item.amount).toLocaleString("fr-FR")} {item.currency}
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
