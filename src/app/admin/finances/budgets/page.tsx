import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { saveBudget } from "@/features/finances/actions/manage-finances";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminBudgets } from "@/lib/queries/admin/finances";

export default async function AdminFinancesBudgetsPage() {
  await requirePermission("finances:read");
  const items = await getAdminBudgets();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Budgets"
        description="Lignes budgétaires par programme ou projet."
        actions={
          <>
            <Link href="/admin/finances" className="rounded border px-3 py-2 text-sm">
              Vue finances
            </Link>
            <ImportRapportButton moduleCible="budgets" typeDocument="budget" />
          </>
        }
      />
      <form action={saveBudget} className="grid max-w-3xl gap-3 rounded border bg-white p-4 sm:grid-cols-2">
        <input required name="label" placeholder="Libellé" className="rounded border p-2 sm:col-span-2" />
        <input required type="number" step="0.01" name="amount_planned" placeholder="Montant" className="rounded border p-2" />
        <input name="currency" defaultValue="USD" className="rounded border p-2" />
        <input type="date" name="period_start" className="rounded border p-2" />
        <input type="date" name="period_end" className="rounded border p-2" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white sm:col-span-2">
          Ajouter un budget
        </button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun budget"
          description="Créez une première ligne budgétaire."
          createHref="/admin/finances/budgets"
          createLabel="Ajouter ci-dessus"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Libellé</th>
                <th>Période</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.label}</td>
                  <td>
                    {item.period_start ?? "—"} → {item.period_end ?? "—"}
                  </td>
                  <td>
                    {Number(item.amount_planned).toLocaleString("fr-FR")} {item.currency}
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
