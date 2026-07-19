import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requestExportJobAction } from "@/features/exports/actions/request-export";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminExportsPage() {
  await requirePermission("rapports:export");
  const supabase = await createClientSafe();
  let jobs: Array<Record<string, unknown>> = [];
  if (supabase) {
    const { data } = await supabase
      .from("background_jobs" as never)
      .select("id, type, statut, progression, created_at, erreur")
      .eq("type", "export.generate")
      .order("created_at", { ascending: false })
      .limit(50);
    jobs = (data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Exports"
        description="Exports asynchrones via file persistante. Aucun faux succès."
      />
      <form action={requestExportJobAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3">
        <select name="module" className="rounded border p-2 text-sm" defaultValue="beneficiaires">
          <option value="beneficiaires">Bénéficiaires</option>
          <option value="activites">Activités</option>
          <option value="dons">Dons</option>
          <option value="finances">Finances</option>
        </select>
        <select name="format" className="rounded border p-2 text-sm" defaultValue="csv">
          <option value="csv">CSV</option>
          <option value="xlsx">Excel</option>
          <option value="pdf">PDF</option>
        </select>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Mettre en file
        </button>
      </form>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Date</th>
              <th>Statut</th>
              <th>Progression</th>
              <th>Erreur</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr className="border-t" key={String(job.id)}>
                <td className="p-3">
                  {String(job.created_at ?? "").slice(0, 19).replace("T", " ")}
                </td>
                <td>{String(job.statut)}</td>
                <td>{String(job.progression ?? 0)}%</td>
                <td className="text-red-700">{String(job.erreur ?? "—")}</td>
              </tr>
            ))}
            {jobs.length === 0 ? (
              <tr>
                <td className="p-3 text-[var(--afd-muted)]" colSpan={4}>
                  Aucun job d&apos;export. Les fichiers apparaîtront après traitement worker.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
