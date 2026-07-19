import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createPresenceAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Presence = {
  id: string;
  date_jour: string;
  heure_entree: string | null;
  heure_sortie: string | null;
  statut: string;
  employe_id: string;
};

export default async function AdminRhPresencesPage({
  searchParams,
}: {
  searchParams?: Promise<{ date?: string }>;
}) {
  await requirePermission("hr.manage_attendance");
  const { date } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: Presence[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    let query = supabase
      .from("hr_presences" as never)
      .select("id, date_jour, heure_entree, heure_sortie, statut, employe_id")
      .order("date_jour", { ascending: false })
      .limit(100);
    if (date) query = query.eq("date_jour", date);
    const [{ data: presences }, { data: emps }] = await Promise.all([
      query,
      supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage")
        .is("archived_at", null)
        .order("nom_affichage"),
    ]);
    items = (presences ?? []) as Presence[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Présences"
        description="Pointage quotidien et statuts de présence."
        actions={
          <Link href="/admin/rh/feuilles-temps" className="rounded border px-4 py-2 text-sm">
            Feuilles de temps
          </Link>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input type="date" name="date" defaultValue={date} className={fieldClass} />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      <form action={createPresenceAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-5">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required type="date" name="date_jour" className={fieldClass} />
        <input type="time" name="heure_entree" className={fieldClass} />
        <input type="time" name="heure_sortie" className={fieldClass} />
        <select name="statut" className={fieldClass} defaultValue="present">
          <option value="present">Présent</option>
          <option value="absent">Absent</option>
          <option value="retard">Retard</option>
          <option value="mission">Mission</option>
          <option value="teletravail">Télétravail</option>
        </select>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-5">
          Enregistrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune présence" description="Enregistrez un pointage ci-dessus." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Employé</th>
                <th>Entrée</th>
                <th>Sortie</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.date_jour}</td>
                  <td>{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.heure_entree ?? "—"}</td>
                  <td>{item.heure_sortie ?? "—"}</td>
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
