import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { createMissionAction } from "@/features/logistique/actions/manage-logistique";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function LogistiqueMissionsPage() {
  await requirePermission("logistique:read");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("logistique_missions" as never)
        .select("id, reference, titre, statut, province")
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] };
  const rows = (data ?? []) as Array<Record<string, unknown>>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Missions logistiques"
        description="Missions terrain et déplacements."
        createHref={"/admin/logistique"}
        createLabel={"Retour"}
      />
      <form action={createMissionAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <input name="titre" required placeholder="Titre" className="rounded border p-2 text-sm" />
        <input name="province" placeholder="Province" className="rounded border p-2 text-sm" />
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-t" key={String(row.id)}>
                <td className="p-3 font-mono text-xs">{String(row.reference)}</td>
                <td>{String(row.titre)}</td>
                <td>{String(row.province ?? "—")}</td>
                <td>{String(row.statut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
