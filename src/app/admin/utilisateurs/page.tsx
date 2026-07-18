import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { roleLabels } from "@/config/roles";
import { deactivateAdminUser } from "@/features/utilisateurs/actions/manage-utilisateur";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminUsers } from "@/lib/queries/admin/utilisateurs";

export default async function AdminUtilisateursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("utilisateurs:read");
  const { q } = await searchParams;
  const items = await getAdminUsers({ q });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs administrateurs</h1>
          <p className="text-sm text-[var(--afd-muted)]">
            Profils administrateurs et rôles associés.
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="rounded border px-4 py-2" href="/admin/roles">
            Gérer les rôles
          </Link>
          <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/utilisateurs/nouveau">
            Nouvel utilisateur
          </Link>
        </div>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher par e-mail ou nom" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun utilisateur administrateur"
          description="Les profils visibles dépendent des politiques RLS Supabase (super administrateur requis pour la liste complète)."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/utilisateurs/nouveau">
              Inviter un utilisateur
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Nom</th>
                <th>E-mail</th>
                <th>Rôles</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.nom_complet ?? "—"}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.roles.length
                      ? item.roles.map((r) => roleLabels[r as keyof typeof roleLabels] ?? r).join(", ")
                      : "—"}
                  </td>
                  <td>{item.actif ? "Actif" : "Désactivé"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/utilisateurs/${item.id}`}>
                      Voir
                    </Link>
                    {item.actif ? (
                      <form action={deactivateAdminUser.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : null}
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
