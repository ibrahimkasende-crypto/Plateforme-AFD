import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getFinancesSummary } from "@/lib/queries/admin/finances";

export default async function AdminFinancesPage() {
  await requirePermission("finances:read");
  const summary = await getFinancesSummary();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Finances"
        description="Budgets, dépenses et transactions."
        actions={
          <>
            <Link href="/admin/finances/budgets" className="rounded border px-3 py-2 text-sm">
              Budgets
            </Link>
            <Link href="/admin/finances/depenses" className="rounded border px-3 py-2 text-sm">
              Dépenses
            </Link>
            <Link href="/admin/finances/transactions" className="rounded border px-3 py-2 text-sm">
              Transactions
            </Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Budget total planifié</p>
          <p className="text-2xl font-bold">{summary.totalBudget.toLocaleString("fr-FR")} USD</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Dépenses enregistrées</p>
          <p className="text-2xl font-bold">{summary.totalDepenses.toLocaleString("fr-FR")} USD</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Lignes budget</p>
          <p className="text-2xl font-bold">{summary.budgetCount}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-[var(--afd-muted)]">Lignes dépenses</p>
          <p className="text-2xl font-bold">{summary.depenseCount}</p>
        </div>
      </div>
    </main>
  );
}
