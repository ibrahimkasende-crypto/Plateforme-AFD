import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { getAdminUser } from "@/lib/queries/admin/utilisateurs";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type AuditLog = {
  id: string;
  action: string;
  module: string;
  entity_type: string | null;
  entity_id: string | null;
  result: string;
  created_at: string;
  new_values: Record<string, unknown> | null;
};

export default async function AdminUtilisateurActivitePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("users.view_audit");
  const { id } = await params;
  const { q } = (await searchParams) ?? {};
  const user = await getAdminUser(id);
  if (!user) notFound();

  const supabase = await createClientSafe();
  let items: AuditLog[] = [];

  if (supabase) {
    let query = supabase
      .from("audit_logs" as never)
      .select("id, action, module, entity_type, entity_id, result, created_at, new_values")
      .eq("actor_id", id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (q?.trim()) query = query.ilike("action", `%${q.trim()}%`);
    const { data } = await query;
    items = (data ?? []) as AuditLog[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={`Activité — ${user.nom_complet ?? user.email}`}
        description="Journal d'audit des actions effectuées par cet utilisateur."
        actions={
          <Link href={`/admin/utilisateurs/${id}`} className="rounded border px-4 py-2 text-sm">
            Retour au profil
          </Link>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par action" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune activité" description="Aucune entrée d'audit pour cet utilisateur." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th>Action</th>
                <th>Module</th>
                <th>Entité</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3 whitespace-nowrap">
                    {item.created_at.slice(0, 19).replace("T", " ")}
                  </td>
                  <td>{item.action}</td>
                  <td>{item.module}</td>
                  <td>
                    {item.entity_type ?? "—"}
                    {item.entity_id ? ` · ${item.entity_id.slice(0, 8)}…` : ""}
                  </td>
                  <td>{item.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
