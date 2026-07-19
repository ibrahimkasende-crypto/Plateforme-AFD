import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createAdvanceAction } from "@/features/hr/actions/manage-hr-modules";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Avance = {
  id: string;
  amount: number;
  currency: string;
  statut: string;
  balance: number | null;
  employe_id: string;
  created_at: string;
};

export default async function AdminRhAvancesPage() {
  await requirePermission("payroll.view");
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;

  let items: Avance[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: rows }, { data: emps }] = await Promise.all([
      supabase
        .from("employee_advances" as never)
        .select("id, amount, currency, statut, balance, employe_id, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (rows ?? []) as Avance[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Avances sur salaire" description="Demandes et remboursements d'avances." />

      {canViewSalary ? (
        <form action={createAdvanceAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4">
          <select required name="employe_id" className={fieldClass} defaultValue="">
            <option value="">Employé *</option>
            {employes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom_affichage}
              </option>
            ))}
          </select>
          <input required type="number" step="0.01" name="amount" placeholder="Montant *" className={fieldClass} />
          <input name="currency" defaultValue="USD" className={fieldClass} />
          <input type="number" step="0.01" name="monthly_deduction" placeholder="Retenue mensuelle" className={fieldClass} />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white sm:col-span-4">
            Enregistrer l&apos;avance
          </button>
        </form>
      ) : null}

      {items.length === 0 ? (
        <EmptyState title="Aucune avance" description="Les avances sur salaire seront listées ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                {canViewSalary ? <th>Montant</th> : null}
                {canViewSalary ? <th>Solde</th> : null}
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">
                    <Link href={`/admin/rh/personnel/${item.employe_id}`} className="text-[var(--afd-blue)]">
                      {employeMap.get(item.employe_id) ?? "—"}
                    </Link>
                  </td>
                  {canViewSalary ? (
                    <td>
                      {item.amount.toLocaleString("fr-FR")} {item.currency}
                    </td>
                  ) : null}
                  {canViewSalary ? (
                    <td>
                      {item.balance != null
                        ? `${item.balance.toLocaleString("fr-FR")} ${item.currency}`
                        : "—"}
                    </td>
                  ) : null}
                  <td>{item.statut}</td>
                  <td>{item.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
