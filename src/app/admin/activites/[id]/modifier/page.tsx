import Link from "next/link";
import { notFound } from "next/navigation";
import { saveActivite } from "@/features/activites/actions/manage-activite";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { getProgrammeOptions } from "@/lib/queries/admin/programmes";
import { getProjetOptions } from "@/lib/queries/admin/projets";

export default async function ModifierActivitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("activites:write");
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
    status: string;
  };
  const [programmes, projets] = await Promise.all([getProgrammeOptions(), getProjetOptions()]);

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modifier l&apos;activité</h1>
        <Link href={`/admin/activites/${id}`} className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </div>
      <form action={saveActivite} className="space-y-4">
        <input type="hidden" name="id" value={id} />
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre</span>
          <input required name="title" defaultValue={a.title} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Type</span>
          <input required name="type" defaultValue={a.type} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            defaultValue={a.description ?? ""}
            className="min-h-24 w-full rounded border p-3"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Date</span>
            <input
              type="date"
              name="activity_date"
              defaultValue={a.activity_date ?? ""}
              className="w-full rounded border p-3"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Province</span>
            <input
              name="province"
              defaultValue={a.province ?? ""}
              className="w-full rounded border p-3"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Lieu</span>
          <input
            name="location"
            defaultValue={a.location ?? ""}
            className="w-full rounded border p-3"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Programme</span>
            <select
              name="programme_id"
              defaultValue={a.programme_id ?? ""}
              className="w-full rounded border p-3"
            >
              <option value="">—</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Projet</span>
            <select
              name="projet_id"
              defaultValue={a.projet_id ?? ""}
              className="w-full rounded border p-3"
            >
              <option value="">—</option>
              {projets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              ["femmes", a.femmes],
              ["hommes", a.hommes],
              ["enfants", a.enfants],
              ["jeunes", a.jeunes],
            ] as const
          ).map(([field, value]) => (
            <label key={field} className="block space-y-1">
              <span className="text-sm font-medium capitalize">{field}</span>
              <input
                type="number"
                min={0}
                name={field}
                defaultValue={value}
                className="w-full rounded border p-3"
              />
            </label>
          ))}
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Statut</span>
          <select name="status" defaultValue={a.status} className="w-full rounded border p-3">
            <option value="planifiee">Planifiée</option>
            <option value="realisee">Réalisée</option>
            <option value="annulee">Annulée</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
