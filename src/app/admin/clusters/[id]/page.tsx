import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  addClusterMembreAction,
  addClusterReunionAction,
  toggleClusterActive,
} from "@/features/clusters/actions/manage-cluster";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminClusterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("clusters:read");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data: cluster } = await supabase
    .from("clusters" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!cluster) notFound();
  const c = cluster as {
    id: string;
    name: string;
    description: string | null;
    type: string | null;
    active: boolean;
  };

  const [{ data: membres }, { data: reunions }] = await Promise.all([
    supabase
      .from("cluster_membres" as never)
      .select("id, nom, role, email, organisation, actif")
      .eq("cluster_id", id)
      .order("nom")
      .limit(100),
    supabase
      .from("cluster_reunions" as never)
      .select("id, titre, date_reunion, decisions, actions")
      .eq("cluster_id", id)
      .order("date_reunion", { ascending: false })
      .limit(50),
  ]);

  const membreRows = (membres ?? []) as Array<Record<string, unknown>>;
  const reunionRows = (reunions ?? []) as Array<Record<string, unknown>>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={c.name}
        description={c.description ?? c.type ?? "Cluster"}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/clusters" className="rounded border px-3 py-2 text-sm">
              Liste
            </Link>
            <form action={toggleClusterActive.bind(null, id, !c.active)}>
              <button type="submit" className="rounded border px-3 py-2 text-sm">
                {c.active ? "Désactiver" : "Activer"}
              </button>
            </form>
          </div>
        }
      />

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">Ajouter un membre</h2>
        <form action={addClusterMembreAction} className="grid gap-3 sm:grid-cols-4">
          <input type="hidden" name="cluster_id" value={id} />
          <input name="nom" required placeholder="Nom" className="rounded border p-2 text-sm" />
          <input name="role" placeholder="Rôle" className="rounded border p-2 text-sm" />
          <input name="organisation" placeholder="Organisation" className="rounded border p-2 text-sm" />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Ajouter
          </button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {membreRows.map((m) => (
            <li key={String(m.id)} className="border-t pt-2">
              <strong>{String(m.nom)}</strong>
              {m.role ? ` — ${String(m.role)}` : ""}
              {m.organisation ? ` (${String(m.organisation)})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">Nouvelle réunion</h2>
        <form action={addClusterReunionAction} className="grid gap-3">
          <input type="hidden" name="cluster_id" value={id} />
          <input name="titre" required placeholder="Titre" className="rounded border p-2 text-sm" />
          <input name="date_reunion" type="date" className="rounded border p-2 text-sm" />
          <textarea name="decisions" placeholder="Décisions" className="min-h-16 rounded border p-2 text-sm" />
          <textarea name="actions" placeholder="Actions" className="min-h-16 rounded border p-2 text-sm" />
          <button type="submit" className="w-fit rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Enregistrer
          </button>
        </form>
        <ul className="mt-4 space-y-3 text-sm">
          {reunionRows.map((r) => (
            <li key={String(r.id)} className="border-t pt-2">
              <strong>{String(r.titre)}</strong> · {String(r.date_reunion)}
              {r.decisions ? <p className="text-slate-600">{String(r.decisions)}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
