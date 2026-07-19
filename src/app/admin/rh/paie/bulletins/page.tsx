import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Bulletin = {
  id: string;
  reference: string | null;
  brut: number;
  net: number;
  currency: string;
  generated_at: string;
  employe_id: string;
};

export default async function AdminRhPaieBulletinsPage() {
  await requirePermission("payroll.view");
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;

  let items: Bulletin[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: bulletins }, { data: emps }] = await Promise.all([
      supabase
        .from("payslips" as never)
        .select("id, reference, brut, net, currency, generated_at, employe_id")
        .order("generated_at", { ascending: false })
        .limit(100),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (bulletins ?? []) as Bulletin[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Bulletins de paie"
        description="Bulletins générés par période."
        actions={
          <Link href="/admin/rh/paie/periodes" className="rounded border px-4 py-2 text-sm">
            Périodes
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="Aucun bulletin"
          description="Les bulletins seront générés après calcul et validation d'une période."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Référence</th>
                <th>Employé</th>
                {canViewSalary ? <th>Brut</th> : null}
                {canViewSalary ? <th>Net</th> : null}
                <th>Généré le</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.reference ?? "—"}</td>
                  <td>
                    <Link href={`/admin/rh/personnel/${item.employe_id}`} className="text-[var(--afd-blue)]">
                      {employeMap.get(item.employe_id) ?? "—"}
                    </Link>
                  </td>
                  {canViewSalary ? (
                    <td>
                      {item.brut.toLocaleString("fr-FR")} {item.currency}
                    </td>
                  ) : null}
                  {canViewSalary ? (
                    <td>
                      {item.net.toLocaleString("fr-FR")} {item.currency}
                    </td>
                  ) : null}
                  <td>{item.generated_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
