import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { markMessagePending, markMessageRead } from "@/features/messages/actions/manage-message";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminMessages } from "@/lib/queries/admin/messages";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requirePermission("messages:read");
  const { q, status } = await searchParams;
  const items = await getAdminMessages({ q, status });

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Messages"
        description="Messages reçus via le formulaire de contact."
        backFallbackHref="/admin"
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <select name="status" defaultValue={status ?? ""} className="rounded border p-2">
          <option value="">Tous</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
          <option value="pending">En attente</option>
          <option value="nouveau">Nouveau</option>
        </select>
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun message"
          description="Les messages du formulaire de contact apparaîtront ici."
          createHref="/contact"
          createLabel="Voir le site public"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Expéditeur</th>
                <th>Sujet</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.created_at?.slice(0, 10) ?? "—"}</td>
                  <td>
                    <div>{item.name}</div>
                    <div className="text-[var(--afd-muted)]">{item.email}</div>
                  </td>
                  <td>
                    <Link
                      href={`/admin/messages/${item.id}`}
                      className="font-medium text-[var(--afd-blue)] hover:underline"
                    >
                      {item.subject}
                    </Link>
                  </td>
                  <td>{item.status ?? "unread"}</td>
                  <td className="space-x-2 p-3 text-right">
                    <Link
                      href={`/admin/messages/${item.id}`}
                      className="text-[var(--afd-blue)]"
                    >
                      Ouvrir
                    </Link>
                    {item.status !== "read" ? (
                      <form action={markMessageRead.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Lu
                        </button>
                      </form>
                    ) : null}
                    <form action={markMessagePending.bind(null, item.id)} className="inline">
                      <button type="submit" className="text-[var(--afd-muted)]">
                        En attente
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
