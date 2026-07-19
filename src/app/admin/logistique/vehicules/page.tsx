import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  archiveVehiculeAction,
  createVehiculeAction,
  updateVehiculeAction,
} from "@/features/logistique/actions/manage-logistique";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function LogistiqueVehiculesPage() {
  await requirePermission("logistique:read");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("logistique_vehicules" as never)
        .select("id, immatriculation, type, statut, kilometrage")
        .eq("actif", true)
        .limit(100)
    : { data: [] };
  const rows = (data ?? []) as Array<{
    id: string;
    immatriculation: string;
    type: string;
    statut: string;
    kilometrage: number | null;
  }>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Véhicules"
        description="Parc automobile et engins."
        createHref={"/admin/logistique"}
        createLabel={"Retour"}
      />
      <form action={createVehiculeAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <input
          name="immatriculation"
          required
          placeholder="Immatriculation"
          className="rounded border p-2 text-sm"
        />
        <input name="type" placeholder="Type" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Ajouter
        </button>
      </form>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Immatriculation</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Km</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={row.id}>
                <td className="p-3">{row.immatriculation}</td>
                <td>{row.type}</td>
                <td>{row.statut}</td>
                <td>{row.kilometrage ?? 0}</td>
                <td className="space-x-2 p-3">
                  <form action={updateVehiculeAction} className="inline-flex items-center gap-1">
                    <input type="hidden" name="id" value={row.id} />
                    <select name="statut" defaultValue={row.statut} className="rounded border p-1 text-xs">
                      <option value="disponible">disponible</option>
                      <option value="en_mission">en_mission</option>
                      <option value="maintenance">maintenance</option>
                      <option value="hors_service">hors_service</option>
                    </select>
                    <input
                      name="kilometrage"
                      type="number"
                      defaultValue={Number(row.kilometrage ?? 0)}
                      className="w-24 rounded border p-1 text-xs"
                    />
                    <button type="submit" className="text-[var(--afd-blue)]">
                      Maj
                    </button>
                  </form>
                  <form action={archiveVehiculeAction} className="inline">
                    <input type="hidden" name="id" value={row.id} />
                    <button type="submit" className="text-red-700">
                      Archiver
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
