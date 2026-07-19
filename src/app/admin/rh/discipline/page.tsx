import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createDisciplineAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Discipline = {
  id: string;
  categorie: string;
  date_fait: string | null;
  description: string | null;
  statut: string;
  employe_id: string;
};

export default async function AdminRhDisciplinePage() {
  await requirePermission("hr.manage_discipline");
  const supabase = await createClientSafe();

  let items: Discipline[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: rows }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_discipline" as never)
        .select("id, categorie, date_fait, description, statut, employe_id")
        .order("date_fait", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (rows ?? []) as Discipline[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Discipline" description="Incidents et procédures disciplinaires." />

      <form action={createDisciplineAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required name="categorie" placeholder="Catégorie *" className={fieldClass} />
        <input type="date" name="date_fait" className={fieldClass} />
        <textarea name="description" placeholder="Description" rows={2} className={`${fieldClass} lg:col-span-3`} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Enregistrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun dossier disciplinaire" description="Les incidents seront listés ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.categorie}</td>
                  <td>{item.date_fait ?? "—"}</td>
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
