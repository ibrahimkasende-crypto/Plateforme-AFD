import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type SecurityEvent = {
  id: string;
  event_type: string;
  severity: string;
  details: Record<string, unknown>;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  user_id: string | null;
};

export default async function AdminSecuriteSessionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string }>;
}) {
  await requirePermission("users.view_security");
  const { type } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: SecurityEvent[] = [];
  if (supabase) {
    let query = supabase
      .from("security_events" as never)
      .select("id, event_type, severity, details, ip, user_agent, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(100);
    if (type?.trim()) query = query.eq("event_type", type.trim());
    const { data } = await query;
    items = ((data ?? []) as SecurityEvent[]).map((row) => ({
      ...row,
      details: row.details ?? {},
    }));
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Sessions et sécurité"
        description="Événements d'authentification et activité sensible."
        actions={
          <>
            <Link href="/admin/securite" className="rounded border px-4 py-2 text-sm">
              Sécurité
            </Link>
            <Link href="/admin/acces" className="rounded border px-4 py-2 text-sm">
              Accès
            </Link>
          </>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input
          name="type"
          defaultValue={type}
          placeholder="Filtrer par type (login, logout…)"
          className="rounded border p-2 text-sm"
        />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun événement"
          description="Les connexions et événements de sécurité seront enregistrés ici."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Type</th>
                <th>Sévérité</th>
                <th>IP</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3 whitespace-nowrap">
                    {item.created_at.slice(0, 19).replace("T", " ")}
                  </td>
                  <td>{item.event_type}</td>
                  <td>{item.severity}</td>
                  <td>{item.ip ?? "—"}</td>
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
