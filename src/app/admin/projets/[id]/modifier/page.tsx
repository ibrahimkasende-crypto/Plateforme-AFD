import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveProjet } from "@/features/projets/actions/manage-projet";
import { getAdminProjet } from "@/lib/queries/admin/projets";
import { getProgrammeOptions } from "@/lib/queries/admin/programmes";

export default async function ModifierProjetPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("projets:write");
  const id = (await params).id;
  const [item, programmes] = await Promise.all([getAdminProjet(id), getProgrammeOptions()]);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier le projet</h1>
      <form action={saveProjet} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre</span>
          <input required name="title" defaultValue={item.title} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Slug</span>
          <input required name="slug" defaultValue={item.slug} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Programme</span>
          <select name="program_id" defaultValue={item.program_id ?? ""} className="w-full rounded border p-3">
            <option value="">— Aucun —</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea required name="description" defaultValue={item.description} className="min-h-32 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Localisation</span>
          <input required name="location" defaultValue={item.location} className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Statut</span>
            <select name="status" defaultValue={item.status ?? "en_cours"} className="w-full rounded border p-3">
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="futur">Futur</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Date de début</span>
            <input required name="start_date" type="date" defaultValue={item.start_date} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Date de fin</span>
          <input name="end_date" type="date" defaultValue={item.end_date ?? ""} className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Budget</span>
            <input name="budget" type="number" min={0} step="0.01" defaultValue={item.budget ?? ""} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Bénéficiaires</span>
            <input name="beneficiaries" type="number" min={0} defaultValue={item.beneficiaries ?? ""} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Résultats</span>
          <textarea name="results" defaultValue={item.results ?? ""} className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL image</span>
          <input name="image_url" defaultValue={item.image_url ?? ""} className="w-full rounded border p-3" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked={item.active ?? true} />
          Actif
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
