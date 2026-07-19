import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  approvePayrollAction,
  calculatePayrollAction,
  closePayrollAction,
} from "@/features/payroll/actions/manage-payroll";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Periode = {
  id: string;
  label: string;
  date_debut: string;
  date_fin: string;
  statut: string;
  currency: string;
};

type RunEmployee = {
  id: string;
  employe_id: string;
  brut: number;
  retenues: number;
  net: number;
  statut: string;
};

export default async function AdminRhPaiePeriodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("payroll.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;
  const canCalculate = user ? await hasPermission(user.id, "payroll.calculate") : false;
  const canApprove = user ? await hasPermission(user.id, "payroll.approve") : false;
  const canClose = user ? await hasPermission(user.id, "payroll.close") : false;

  const { data: periode } = await supabase
    .from("payroll_periods" as never)
    .select("id, label, date_debut, date_fin, statut, currency")
    .eq("id", id)
    .maybeSingle();

  if (!periode) notFound();
  const period = periode as Periode;

  const { data: run } = await supabase
    .from("payroll_runs" as never)
    .select("id")
    .eq("period_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let employees: RunEmployee[] = [];
  if (run && typeof run === "object" && "id" in run) {
    const { data } = await supabase
      .from("payroll_run_employees" as never)
      .select("id, employe_id, brut, retenues, net, statut")
      .eq("run_id", (run as { id: string }).id);
    employees = (data ?? []) as RunEmployee[];
  }

  const { data: emps } = await supabase
    .from("hr_employes" as never)
    .select("id, nom_affichage")
    .is("archived_at", null);
  const employeMap = new Map(
    ((emps ?? []) as Array<{ id: string; nom_affichage: string | null }>).map((e) => [
      e.id,
      e.nom_affichage ?? "—",
    ]),
  );

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={period.label}
        description={`${period.date_debut} → ${period.date_fin} · Statut : ${period.statut}`}
        actions={
          <Link href="/admin/rh/paie/periodes" className="rounded border px-4 py-2 text-sm">
            Retour
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        {canCalculate ? (
          <form action={calculatePayrollAction}>
            <input type="hidden" name="periodId" value={period.id} />
            <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
              Calculer la paie
            </button>
          </form>
        ) : null}
        {canApprove ? (
          <form action={approvePayrollAction}>
            <input type="hidden" name="periodId" value={period.id} />
            <button type="submit" className="rounded border px-4 py-2 text-sm">
              Approuver
            </button>
          </form>
        ) : null}
        {canClose ? (
          <form action={closePayrollAction}>
            <input type="hidden" name="periodId" value={period.id} />
            <button type="submit" className="rounded border border-red-200 px-4 py-2 text-sm text-red-700">
              Clôturer
            </button>
          </form>
        ) : null}
      </div>

      {employees.length === 0 ? (
        <EmptyState
          title="Paie non calculée"
          description="Lancez le calcul pour générer les lignes de paie."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                {canViewSalary ? <th>Brut</th> : null}
                {canViewSalary ? <th>Retenues</th> : null}
                {canViewSalary ? <th>Net</th> : null}
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((row) => (
                <tr className="border-t" key={row.id}>
                  <td className="p-3">
                    <Link
                      href={`/admin/rh/personnel/${row.employe_id}`}
                      className="text-[var(--afd-blue)]"
                    >
                      {employeMap.get(row.employe_id) ?? "—"}
                    </Link>
                  </td>
                  {canViewSalary ? (
                    <td>
                      {row.brut.toLocaleString("fr-FR")} {period.currency}
                    </td>
                  ) : null}
                  {canViewSalary ? (
                    <td>
                      {row.retenues.toLocaleString("fr-FR")} {period.currency}
                    </td>
                  ) : null}
                  {canViewSalary ? (
                    <td>
                      {row.net.toLocaleString("fr-FR")} {period.currency}
                    </td>
                  ) : null}
                  <td>{row.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
