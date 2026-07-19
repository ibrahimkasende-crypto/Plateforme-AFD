import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createCongeAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Conge = {
  id: string;
  type_conge: string;
  date_debut: string;
  date_fin: string;
  jours: number;
  statut: string;
  employe_id: string;
};

export default async function AdminRhCongesPage({
  searchParams,
}: {
  searchParams?: Promise<{ statut?: string }>;
}) {
  await requirePermission("hr.manage_leave");
  const { statut } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: Conge[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    let query = supabase
      .from("hr_conges" as never)
      .select("id, type_conge, date_debut, date_fin, jours, statut, employe_id")
      .order("date_debut", { ascending: false });
    if (statut) query = query.eq("statut", statut);
    const [{ data: conges }, { data: emps }] = await Promise.all([
      query,
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (conges ?? []) as Conge[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Congés" description="Demandes et soldes de congés." />

      <form className="flex flex-wrap gap-3">
        <select name="statut" defaultValue={statut ?? ""} className={fieldClass}>
          <option value="">Tous les statuts</option>
          <option value="demande">Demande</option>
          <option value="approuve_n1">Approuvé N+1</option>
          <option value="approuve_rh">Approuvé RH</option>
          <option value="rejete">Rejeté</option>
        </select>
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      <form action={createCongeAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-3">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required name="type_conge" placeholder="Type (annuel, maladie…)" className={fieldClass} />
        <input required type="number" step="0.5" name="jours" placeholder="Jours *" className={fieldClass} />
        <input required type="date" name="date_debut" className={fieldClass} />
        <input required type="date" name="date_fin" className={fieldClass} />
        <input name="motif" placeholder="Motif" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Soumettre la demande
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune demande" description="Créez une demande de congé ci-dessus." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Type</th>
                <th>Période</th>
                <th>Jours</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.type_conge}</td>
                  <td>
                    {item.date_debut} → {item.date_fin}
                  </td>
                  <td>{item.jours}</td>
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
