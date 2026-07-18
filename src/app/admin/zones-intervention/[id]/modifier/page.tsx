import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveZone } from "@/features/zones/actions/manage-zone";
import { getAdminZone } from "@/lib/queries/admin/zones-intervention";

export default async function ModifierZonePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("programmes:write");
  const item = await getAdminZone((await params).id);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier la zone</h1>
      <form action={saveZone} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <label className="block space-y-1">
          <span className="text-sm font-medium">Province</span>
          <input required name="province" defaultValue={item.province} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Localité principale</span>
          <input name="main_locality" defaultValue={item.main_locality ?? ""} className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">ID SVG carte</span>
            <input name="svg_id" defaultValue={item.svg_id ?? ""} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Couleur</span>
            <input name="color" defaultValue={item.color ?? ""} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Résumé</span>
          <textarea name="summary" defaultValue={item.summary ?? ""} className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Secteurs (séparés par des virgules)</span>
          <input name="sectors" defaultValue={item.sectors.join(", ")} className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Projets</span>
            <input name="projects_count" type="number" min={0} defaultValue={item.projects_count ?? ""} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Activités</span>
            <input name="activities_count" type="number" min={0} defaultValue={item.activities_count ?? ""} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Bénéficiaires</span>
            <input name="beneficiaries_count" type="number" min={0} defaultValue={item.beneficiaries_count ?? ""} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Statut</span>
          <select name="status" defaultValue={item.status} className="w-full rounded border p-3">
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked={item.active} />
          Active
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
