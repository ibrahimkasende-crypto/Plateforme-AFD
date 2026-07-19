import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  addUrgenceSitrepAction,
  closeUrgence,
} from "@/features/urgences/actions/manage-urgence";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminUrgenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("urgences:read");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data: urgenceRaw } = await supabase
    .from("urgences" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!urgenceRaw) notFound();
  const urgence = urgenceRaw as {
    id: string;
    title: string;
    summary: string | null;
    province: string | null;
    started_at: string | null;
    status: string;
  };

  const { data: sitreps } = await supabase
    .from("urgence_sitreps" as never)
    .select("id, titre, contenu, population_affectee, besoins, created_at")
    .eq("urgence_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const sitrepRows = (sitreps ?? []) as Array<Record<string, unknown>>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={urgence.title}
        description={urgence.summary ?? "Situation d'urgence"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/urgences" className="rounded border px-3 py-2 text-sm">
              Liste
            </Link>
            <Link
              href={`/admin/urgences/${id}/modifier`}
              className="rounded border px-3 py-2 text-sm"
            >
              Modifier
            </Link>
            {urgence.status === "active" ? (
              <form action={closeUrgence.bind(null, id)}>
                <button type="submit" className="rounded bg-red-700 px-3 py-2 text-sm text-white">
                  Clôturer
                </button>
              </form>
            ) : null}
          </div>
        }
      />

      <dl className="grid gap-3 rounded border bg-white p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Province</dt>
          <dd>{urgence.province ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Début</dt>
          <dd>{urgence.started_at ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Statut</dt>
          <dd>{urgence.status}</dd>
        </div>
      </dl>

      <section className="rounded border bg-white p-4">
        <h2 className="mb-3 font-semibold">Nouveau sitrep</h2>
        <form action={addUrgenceSitrepAction} className="grid gap-3">
          <input type="hidden" name="urgence_id" value={id} />
          <input name="titre" required placeholder="Titre" className="rounded border p-2 text-sm" />
          <textarea
            name="contenu"
            required
            placeholder="Situation"
            className="min-h-24 rounded border p-2 text-sm"
          />
          <input
            name="population_affectee"
            type="number"
            placeholder="Population affectée"
            className="rounded border p-2 text-sm"
          />
          <textarea name="besoins" placeholder="Besoins" className="min-h-16 rounded border p-2 text-sm" />
          <button type="submit" className="w-fit rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Enregistrer le sitrep
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Situation reports</h2>
        {sitrepRows.length === 0 ? (
          <p className="text-sm text-slate-600">Aucun sitrep pour le moment.</p>
        ) : (
          sitrepRows.map((s) => (
            <article key={String(s.id)} className="rounded border bg-white p-4 text-sm">
              <h3 className="font-medium">{String(s.titre)}</h3>
              <p className="mt-1 text-slate-600">{String(s.contenu)}</p>
              <p className="mt-2 text-xs text-slate-500">
                {String(s.created_at ?? "").slice(0, 16)}
                {s.population_affectee != null
                  ? ` · Population : ${String(s.population_affectee)}`
                  : ""}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
