import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createFormationAction } from "@/features/hr/actions/manage-hr-modules";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Formation = {
  id: string;
  titre: string;
  formateur: string | null;
  date_debut: string | null;
  date_fin: string | null;
  cout: number | null;
  devise: string | null;
};

export default async function AdminRhFormationsPage() {
  await requirePermission("hr.manage_training");
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;

  let items: Formation[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("hr_formations" as never)
      .select("id, titre, formateur, date_debut, date_fin, cout, devise")
      .order("date_debut", { ascending: false });
    items = (data ?? []) as Formation[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Formations" description="Catalogue et sessions de formation." />

      <form action={createFormationAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <input required name="titre" placeholder="Titre *" className={fieldClass} />
        <input name="formateur" placeholder="Formateur" className={fieldClass} />
        <input type="date" name="date_debut" className={fieldClass} />
        <input type="date" name="date_fin" className={fieldClass} />
        {canViewSalary ? (
          <>
            <input type="number" step="0.01" name="cout" placeholder="Coût" className={fieldClass} />
            <input name="devise" placeholder="Devise" defaultValue="USD" className={fieldClass} />
          </>
        ) : null}
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Ajouter la formation
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune formation" description="Planifiez une session de formation." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Formateur</th>
                <th>Période</th>
                {canViewSalary ? <th>Coût</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.titre}</td>
                  <td>{item.formateur ?? "—"}</td>
                  <td>
                    {item.date_debut ?? "—"} → {item.date_fin ?? "—"}
                  </td>
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
