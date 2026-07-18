import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminJournal } from "@/lib/queries/admin/journal";

export default async function AdminJournalActivitePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("journal:read");
  const { q } = await searchParams;
  const items = await getAdminJournal({ q });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Journal d'activité"
        description="Historique des actions administratives."
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par action" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Journal vide"
          description="Les actions admin seront enregistrées automatiquement."
          createHref="/admin"
          createLabel="Retour au tableau de bord"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Action</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 19).replace("T", " ") ?? "—"}</td>
                  <td>{item.action}</td>
                  <td className="max-w-md truncate text-[var(--afd-muted)]">
                    {JSON.stringify(item.details)}
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
