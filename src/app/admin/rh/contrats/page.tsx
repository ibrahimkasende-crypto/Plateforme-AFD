import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createContratAction } from "@/features/hr/actions/manage-hr-modules";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Contrat = {
  id: string;
  reference: string | null;
  type_contrat: string;
  date_debut: string;
  date_fin: string | null;
  salaire_base: number;
  devise: string;
  statut: string;
  employe_id: string;
};

export default async function AdminRhContratsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.manage_contracts");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user ? await hasPermission(user.id, "payroll.view_salary") : false;

  let items: Contrat[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: contrats }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_contrats" as never)
        .select("id, reference, type_contrat, date_debut, date_fin, salaire_base, devise, statut, employe_id")
        .order("date_debut", { ascending: false }),
      supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage")
        .is("archived_at", null)
        .order("nom_affichage"),
    ]);
    items = (contrats ?? []) as Contrat[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
    if (q?.trim()) {
      const ids = new Set(
        employes.filter((e) => e.nom_affichage?.toLowerCase().includes(q.trim().toLowerCase())).map((e) => e.id),
      );
      if (ids.size) items = items.filter((c) => ids.has(c.employe_id));
    }
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Contrats" description="Contrats de travail et renouvellements." />

      <form action={createContratAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-4">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required name="type_contrat" placeholder="Type (CDD, CDI…)" className={fieldClass} />
        <input required type="date" name="date_debut" className={fieldClass} />
        <input type="date" name="date_fin" className={fieldClass} />
        {canViewSalary ? (
          <input type="number" step="0.01" name="salaire_base" placeholder="Salaire base" className={fieldClass} />
        ) : null}
        <input name="reference" placeholder="Référence" className={fieldClass} />
        <input name="horaire" placeholder="Horaire" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-2">
          Créer le contrat
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun contrat" description="Créez un contrat pour un employé." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                {canViewSalary ? <th>Salaire</th> : null}
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.type_contrat}</td>
                  <td>{item.date_debut}</td>
                  <td>{item.date_fin ?? "—"}</td>
                  {canViewSalary ? (
                    <td>
                      {item.salaire_base.toLocaleString("fr-FR")} {item.devise}
                    </td>
                  ) : null}
                  <td>{item.statut}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/rh/personnel/${item.employe_id}`} className="text-[var(--afd-blue)]">
                      Fiche
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
