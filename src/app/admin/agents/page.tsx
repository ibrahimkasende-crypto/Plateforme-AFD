import Link from "next/link";
import { softDeleteAgent } from "@/features/agents/actions/manage-agent";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminAgents } from "@/lib/queries/admin/agents";

export default async function AdminAgentsPage() {
  await requirePermission("agents:read");
  const items = await getAdminAgents();

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Agents terrain</h1>
          <p className="mt-1 text-sm text-[var(--afd-muted)]">
            Affectations provinciales et opérationnelles.
          </p>
        </div>
        <Link
          href="/admin/agents/nouveau"
          className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white"
        >
          Nouvel agent
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-sm text-[var(--afd-muted)]">
          Aucun agent enregistré.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[var(--afd-muted)]">
                <th className="p-3">Nom</th>
                <th className="p-3">Fonction</th>
                <th className="p-3">Province</th>
                <th className="p-3">Actif</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 font-medium">{item.full_name}</td>
                  <td className="p-3">{item.fonction ?? "—"}</td>
                  <td className="p-3">{item.province ?? "—"}</td>
                  <td className="p-3">{item.actif ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link
                      href={`/admin/agents/${item.id}`}
                      className="font-semibold text-[var(--afd-blue)]"
                    >
                      Voir
                    </Link>
                    <form action={softDeleteAgent} className="inline">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="font-semibold text-red-600">
                        Archiver
                      </button>
                    </form>
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
