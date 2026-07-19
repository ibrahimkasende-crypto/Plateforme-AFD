import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createPayrollPeriodAction } from "@/features/payroll/actions/manage-payroll";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Periode = {
  id: string;
  label: string;
  date_debut: string;
  date_fin: string;
  statut: string;
  currency: string;
};

export default async function AdminRhPaiePeriodesPage() {
  await requirePermission("payroll.view");
  const supabase = await createClientSafe();

  let items: Periode[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("payroll_periods" as never)
      .select("id, label, date_debut, date_fin, statut, currency")
      .order("date_debut", { ascending: false });
    items = (data ?? []) as Periode[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Périodes de paie"
        description="Cycles mensuels et statuts de traitement."
        actions={
          <Link href="/admin/rh/paie" className="rounded border px-4 py-2 text-sm">
            Retour paie
          </Link>
        }
      />

      <form action={createPayrollPeriodAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input required name="label" placeholder="Libellé (ex. Paie janvier 2026) *" className={fieldClass} />
        <input required type="date" name="date_debut" className={fieldClass} />
        <input required type="date" name="date_fin" className={fieldClass} />
        <input name="currency" defaultValue="USD" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune période" description="Créez une période de paie ci-dessus." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Libellé</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Devise</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.label}</td>
                  <td>
                    {item.date_debut} → {item.date_fin}
                  </td>
                  <td>{item.statut}</td>
                  <td>{item.currency}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/rh/paie/periodes/${item.id}`} className="text-[var(--afd-blue)]">
                      Ouvrir
                    </Link>
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
