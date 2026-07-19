import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createEquipementAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Equipement = {
  id: string;
  inventaire: string | null;
  type_equipement: string;
  etat: string;
  date_attribution: string | null;
  employe_id: string | null;
};

export default async function AdminRhEquipementsPage() {
  await requirePermission("hr.manage_employees");
  const supabase = await createClientSafe();

  let items: Equipement[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: eq }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_equipements" as never)
        .select("id, inventaire, type_equipement, etat, date_attribution, employe_id")
        .order("date_attribution", { ascending: false }),
      supabase.from("hr_employes" as never).select("id, nom_affichage").is("archived_at", null),
    ]);
    items = (eq ?? []) as Equipement[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader title="Équipements" description="Inventaire et attributions matérielles." />

      <form action={createEquipementAction} className="grid gap-3 rounded border bg-white p-4 lg:grid-cols-4">
        <input name="inventaire" placeholder="N° inventaire" className={fieldClass} />
        <input required name="type_equipement" placeholder="Type *" className={fieldClass} />
        <select name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Non attribué</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input type="date" name="date_attribution" className={fieldClass} />
        <select name="etat" className={fieldClass} defaultValue="bon">
          <option value="bon">Bon</option>
          <option value="usage">Usage normal</option>
          <option value="reparation">En réparation</option>
          <option value="hors_service">Hors service</option>
        </select>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white lg:col-span-3">
          Enregistrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun équipement" description="Ajoutez un équipement à l'inventaire." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Inventaire</th>
                <th>Type</th>
                <th>Employé</th>
                <th>État</th>
                <th>Attribution</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.inventaire ?? "—"}</td>
                  <td>{item.type_equipement}</td>
                  <td>
                    {item.employe_id ? (
                      <Link href={`/admin/rh/personnel/${item.employe_id}`} className="text-[var(--afd-blue)]">
                        {employeMap.get(item.employe_id) ?? "—"}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{item.etat}</td>
                  <td>{item.date_attribution ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
