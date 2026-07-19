import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createDepartAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Depart = {
  id: string;
  type_depart: string;
  date_effet: string;
  statut: string;
  employe_id: string;
};

export default async function AdminRhDepartsPage() {
  await requirePermission("hr.manage_offboarding");
  const supabase = await createClientSafe();

  let items: Depart[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: rows }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_departs" as never)
        .select("id, type_depart, date_effet, statut, employe_id")
        .order("date_effet", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (rows ?? []) as Depart[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Départs" description="Procédures de sortie et offboarding." />

      <form action={createDepartAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required name="type_depart" placeholder="Type (démission, licenciement…)" className={fieldClass} />
        <input required type="date" name="date_effet" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white sm:col-span-3">
          Ouvrir un dossier de départ
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun départ en cours" description="Les dossiers de sortie seront listés ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Type</th>
                <th>Date d&apos;effet</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.type_depart}</td>
                  <td>{item.date_effet}</td>
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
