import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  createMissionAction,
  transitionMissionStatutAction,
} from "@/features/logistique/actions/manage-logistique";
import {
  canTransitionMission,
  type MissionStatut,
} from "@/features/logistique/lib/transitions";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const NEXT_ACTIONS: Array<{ to: MissionStatut; label: string }> = [
  { to: "en_cours", label: "Démarrer" },
  { to: "terminee", label: "Terminer" },
  { to: "annulee", label: "Annuler" },
];

export default async function LogistiqueMissionsPage() {
  await requirePermission("logistique:read");
  const supabase = await createClientSafe();
  const [{ data: rowsRaw }, { data: vehiculesRaw }] = supabase
    ? await Promise.all([
        supabase
          .from("logistique_missions" as never)
          .select("id, reference, titre, statut, province, vehicule_id, date_debut, date_fin")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("logistique_vehicules" as never)
          .select("id, immatriculation")
          .eq("actif", true)
          .limit(100),
      ])
    : [{ data: [] }, { data: [] }];

  const rows = (rowsRaw ?? []) as Array<{
    id: string;
    reference: string;
    titre: string;
    statut: string;
    province: string | null;
  }>;
  const vehicules = (vehiculesRaw ?? []) as Array<{ id: string; immatriculation: string }>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Missions logistiques"
        description="Missions terrain et déplacements."
        createHref={"/admin/logistique"}
        createLabel={"Retour"}
      />
      <form action={createMissionAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-5">
        <input name="titre" required placeholder="Titre" className="rounded border p-2 text-sm" />
        <select name="vehicule_id" className="rounded border p-2 text-sm" defaultValue="">
          <option value="">Sans véhicule</option>
          {vehicules.map((v) => (
            <option key={v.id} value={v.id}>
              {v.immatriculation}
            </option>
          ))}
        </select>
        <input name="province" placeholder="Province" className="rounded border p-2 text-sm" />
        <input name="date_debut" type="date" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer mission
        </button>
      </form>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Référence</th>
              <th>Titre</th>
              <th>Province</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statut = row.statut as MissionStatut;
              const actions = NEXT_ACTIONS.filter((a) => canTransitionMission(statut, a.to));
              return (
                <tr className="border-t" key={row.id}>
                  <td className="p-3 font-mono text-xs">{row.reference}</td>
                  <td>{row.titre}</td>
                  <td>{row.province ?? "—"}</td>
                  <td>{row.statut}</td>
                  <td className="space-x-2 p-3">
                    {actions.map((a) => (
                      <form
                        key={a.to}
                        action={transitionMissionStatutAction}
                        className="inline"
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="statut" value={a.to} />
                        <button type="submit" className="text-[var(--afd-blue)]">
                          {a.label}
                        </button>
                      </form>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
