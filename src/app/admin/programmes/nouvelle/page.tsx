import { requirePermission } from "@/lib/auth/require-permission";
import { saveProgramme } from "@/features/programmes/actions/manage-programme";

export default async function NouvelleProgrammePage() {
  await requirePermission("programmes:write");
  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouveau programme</h1>
      <form action={saveProgramme} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre</span>
          <input required name="title" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Slug</span>
          <input name="slug" placeholder="mon-programme" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description courte</span>
          <textarea required name="description" className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description détaillée</span>
          <textarea required name="long_description" className="min-h-40 w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Icône</span>
            <input name="icon" defaultValue="heart" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Couleur</span>
            <input name="color" defaultValue="sky" className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL image</span>
          <input name="image_url" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Ordre</span>
          <input name="order" type="number" min={0} defaultValue={0} className="w-full rounded border p-3" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked />
          Actif
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
