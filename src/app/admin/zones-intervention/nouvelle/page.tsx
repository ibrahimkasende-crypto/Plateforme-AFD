import { requirePermission } from "@/lib/auth/require-permission";
import { saveZone } from "@/features/zones/actions/manage-zone";

export default async function NouvelleZonePage() {
  await requirePermission("programmes:write");
  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouvelle zone d&apos;intervention</h1>
      <form action={saveZone} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Province</span>
          <input required name="province" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Localité principale</span>
          <input name="main_locality" className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">ID SVG carte</span>
            <input name="svg_id" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Couleur</span>
            <input name="color" className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Résumé</span>
          <textarea name="summary" className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Secteurs (séparés par des virgules)</span>
          <input name="sectors" placeholder="Santé, WASH, Éducation" className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Projets</span>
            <input name="projects_count" type="number" min={0} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Activités</span>
            <input name="activities_count" type="number" min={0} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Bénéficiaires</span>
            <input name="beneficiaries_count" type="number" min={0} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Statut</span>
          <select name="status" defaultValue="brouillon" className="w-full rounded border p-3">
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked />
          Active
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
