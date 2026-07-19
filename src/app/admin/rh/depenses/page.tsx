import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Depense = {
  id: string;
  titre: string;
  formateur: string | null;
  date_debut: string | null;
  cout: number | null;
  devise: string | null;
};

export default async function AdminRhDepensesPage() {
  await requirePermission("hr.view");
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;

  let items: Depense[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("hr_formations" as never)
      .select("id, titre, formateur, date_debut, cout, devise")
      .not("cout", "is", null)
      .order("date_debut", { ascending: false });
    items = (data ?? []) as Depense[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Dépenses RH"
        description="Coûts de formation et dépenses liées au personnel."
      />

      {items.length === 0 ? (
        <EmptyState
          title="Aucune dépense enregistrée"
          description="Les coûts de formation avec montant renseigné apparaîtront ici."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Libellé</th>
                <th>Formateur</th>
                <th>Date</th>
                {canViewSalary ? <th>Montant</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.titre}</td>
                  <td>{item.formateur ?? "—"}</td>
                  <td>{item.date_debut ?? "—"}</td>
                  {canViewSalary ? (
                    <td>
                      {item.cout != null
                        ? `${item.cout.toLocaleString("fr-FR")} ${item.devise ?? "USD"}`
                        : "—"}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
