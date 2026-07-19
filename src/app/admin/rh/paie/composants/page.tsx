import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createSalaryComponentAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Composant = {
  id: string;
  code: string;
  nom: string;
  kind: string;
  fixed_or_variable: string;
  active: boolean;
  priority: number;
};

export default async function AdminRhPaieComposantsPage() {
  await requirePermission("payroll.manage_components");
  const supabase = await createClientSafe();

  let items: Composant[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("salary_components" as never)
      .select("id, code, nom, kind, fixed_or_variable, active, priority")
      .order("priority");
    items = (data ?? []) as Composant[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Composants salariaux"
        description="Gains, retenues et charges patronales."
        actions={
          <Link href="/admin/rh/paie" className="rounded border px-4 py-2 text-sm">
            Retour paie
          </Link>
        }
      />

      <form action={createSalaryComponentAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4">
        <input required name="code" placeholder="Code *" className={fieldClass} />
        <input required name="nom" placeholder="Nom *" className={fieldClass} />
        <select required name="kind" className={fieldClass} defaultValue="earning">
          <option value="earning">Gain</option>
          <option value="deduction">Retenue</option>
          <option value="employer_charge">Charge employeur</option>
        </select>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Ajouter
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun composant" description="Définissez les éléments de rémunération." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Fixe/Variable</th>
                <th>Priorité</th>
                <th>Actif</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.code}</td>
                  <td>{item.nom}</td>
                  <td>{item.kind}</td>
                  <td>{item.fixed_or_variable}</td>
                  <td>{item.priority}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
