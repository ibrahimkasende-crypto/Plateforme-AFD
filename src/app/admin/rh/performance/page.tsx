import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createPerformanceCycleAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Cycle = {
  id: string;
  nom: string;
  date_debut: string | null;
  date_fin: string | null;
  statut: string;
};

type Evaluation = {
  id: string;
  note: number | null;
  statut: string;
  employe_id: string;
  cycle_id: string | null;
};

export default async function AdminRhPerformancePage() {
  await requirePermission("hr.manage_performance");
  const supabase = await createClientSafe();

  let cycles: Cycle[] = [];
  let evaluations: Evaluation[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: c }, { data: e }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_performance_cycles" as never)
        .select("id, nom, date_debut, date_fin, statut")
        .order("date_debut", { ascending: false }),
      supabase
        .from("hr_evaluations" as never)
        .select("id, note, statut, employe_id, cycle_id")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    cycles = (c ?? []) as Cycle[];
    evaluations = (e ?? []) as Evaluation[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((x) => [x.id, x.nom_affichage ?? "—"]));
  const cycleMap = new Map(cycles.map((x) => [x.id, x.nom]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Performance" description="Cycles d'évaluation et notes." />

      <form action={createPerformanceCycleAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4">
        <input required name="nom" placeholder="Nom du cycle *" className={fieldClass} />
        <input type="date" name="date_debut" className={fieldClass} />
        <input type="date" name="date_fin" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer le cycle
        </button>
      </form>

      {cycles.length === 0 && evaluations.length === 0 ? (
        <EmptyState title="Aucune évaluation" description="Créez un cycle de performance pour commencer." />
      ) : (
        <>
          {cycles.length > 0 ? (
            <div className="overflow-x-auto rounded border bg-white">
              <h2 className="border-b p-3 font-semibold">Cycles</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="p-3">Nom</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map((item) => (
                    <tr className="border-t" key={item.id}>
                      <td className="p-3">{item.nom}</td>
                      <td>{item.date_debut ?? "—"}</td>
                      <td>{item.date_fin ?? "—"}</td>
                      <td>{item.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {evaluations.length > 0 ? (
            <div className="overflow-x-auto rounded border bg-white">
              <h2 className="border-b p-3 font-semibold">Évaluations récentes</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="p-3">Employé</th>
                    <th>Cycle</th>
                    <th>Note</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((item) => (
                    <tr className="border-t" key={item.id}>
                      <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                      <td>{item.cycle_id ? (cycleMap.get(item.cycle_id) ?? "—") : "—"}</td>
                      <td>{item.note ?? "—"}</td>
                      <td>{item.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
