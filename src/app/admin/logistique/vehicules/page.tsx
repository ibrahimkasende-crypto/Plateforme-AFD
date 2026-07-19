import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { createVehiculeAction } from "@/features/logistique/actions/manage-logistique";
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
  const rows = (data ?? []) as Array<Record<string, unknown>>;

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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={String(row.id)}>
                <td className="p-3">{String(row.immatriculation)}</td>
                <td>{String(row.type)}</td>
                <td>{String(row.statut)}</td>
                <td>{String(row.kilometrage ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
