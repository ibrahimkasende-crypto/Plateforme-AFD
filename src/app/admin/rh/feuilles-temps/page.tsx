import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Presence = {
  id: string;
  date_jour: string;
  heure_entree: string | null;
  heure_sortie: string | null;
  pause_minutes: number;
  heures_sup: number;
  statut: string;
  employe_id: string;
};

export default async function AdminRhFeuillesTempsPage({
  searchParams,
}: {
  searchParams?: Promise<{ mois?: string }>;
}) {
  await requirePermission("hr.manage_attendance");
  const { mois } = (await searchParams) ?? {};
  const supabase = await createClientSafe();
  const moisFilter = mois ?? new Date().toISOString().slice(0, 7);

  let items: Presence[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: presences }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_presences" as never)
        .select("id, date_jour, heure_entree, heure_sortie, pause_minutes, heures_sup, statut, employe_id")
        .gte("date_jour", `${moisFilter}-01`)
        .lte("date_jour", `${moisFilter}-31`)
        .order("date_jour", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (presences ?? []) as Presence[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Feuilles de temps"
        description="Synthèse mensuelle des présences et heures."
        actions={
          <Link href="/admin/rh/presences" className="rounded border px-4 py-2 text-sm">
            Pointages
          </Link>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input
          type="month"
          name="mois"
          defaultValue={moisFilter}
          className="rounded border p-2 text-sm"
        />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune entrée" description="Aucune présence pour la période sélectionnée." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Employé</th>
                <th>Entrée</th>
                <th>Sortie</th>
                <th>Pause (min)</th>
                <th>H. sup.</th>
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
                  <td>{item.pause_minutes}</td>
                  <td>{item.heures_sup}</td>
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
