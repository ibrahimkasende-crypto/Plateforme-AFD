import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createDisciplineAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Reclamation = {
  id: string;
  categorie: string;
  date_fait: string | null;
  description: string | null;
  statut: string;
  employe_id: string;
};

export default async function AdminRhReclamationsPage() {
  await requirePermission("hr.manage_discipline");
  const supabase = await createClientSafe();

  let items: Reclamation[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: rows }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_discipline" as never)
        .select("id, categorie, date_fait, description, statut, employe_id")
        .ilike("categorie", "%reclamation%")
        .order("date_fait", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (rows ?? []) as Reclamation[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Réclamations"
        description="Réclamations et plaintes du personnel (catégorie « reclamation »)."
      />

      <form action={createDisciplineAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input type="hidden" name="categorie" value="reclamation" />
        <input type="date" name="date_fait" className={fieldClass} />
        <textarea
          required
          name="description"
          placeholder="Description de la réclamation *"
          rows={2}
          className={`${fieldClass} lg:col-span-3`}
        />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Enregistrer la réclamation
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune réclamation" description="Les réclamations enregistrées apparaîtront ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Date</th>
                <th>Description</th>
                <th>Statut</th>
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
                  <td>{item.date_fait ?? "—"}</td>
                  <td className="max-w-md truncate">{item.description ?? "—"}</td>
                  <td>{item.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
