import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateActiviteStatus } from "@/features/activites/actions/manage-activite";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminActiviteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("activites:read");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("activites" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const a = data as {
    id: string;
    title: string;
    type: string;
    description: string | null;
    activity_date: string | null;
    province: string | null;
    location: string | null;
    programme_id: string | null;
    projet_id: string | null;
    femmes: number;
    hommes: number;
    enfants: number;
    jeunes: number;
    total: number;
    status: string;
  };

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title={a.title}
        description={`${a.type} · ${a.status}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/activites" className="rounded border px-3 py-2 text-sm">
              Liste
            </Link>
            <Link
              href={`/admin/activites/${id}/modifier`}
              className="rounded border px-3 py-2 text-sm"
            >
              Modifier
            </Link>
            {a.status !== "realisee" ? (
              <form action={updateActiviteStatus.bind(null, id, "realisee")}>
                <button type="submit" className="rounded bg-[var(--afd-blue)] px-3 py-2 text-sm text-white">
                  Marquer réalisée
                </button>
              </form>
            ) : null}
          </div>
        }
      />

      <dl className="grid gap-3 rounded border bg-white p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Date</dt>
          <dd>{a.activity_date ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Province</dt>
          <dd>{a.province ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Lieu</dt>
          <dd>{a.location ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Programme</dt>
          <dd className="font-mono text-xs">{a.programme_id ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Projet</dt>
          <dd className="font-mono text-xs">{a.projet_id ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Participants</dt>
          <dd>
            {a.total} (F{a.femmes} / H{a.hommes} / E{a.enfants} / J{a.jeunes})
          </dd>
        </div>
      </dl>

      {a.description ? (
        <section className="rounded border bg-white p-4 text-sm">
          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="whitespace-pre-wrap text-slate-700">{a.description}</p>
        </section>
      ) : null}
    </main>
  );
}
