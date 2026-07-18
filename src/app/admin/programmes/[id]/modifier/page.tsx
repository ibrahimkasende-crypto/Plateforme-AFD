import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveProgramme } from "@/features/programmes/actions/manage-programme";
import { getAdminProgramme } from "@/lib/queries/admin/programmes";

export default async function ModifierProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("programmes:write");
  const item = await getAdminProgramme((await params).id);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier le programme</h1>
      <form action={saveProgramme} className="space-y-4">
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
          <span className="text-sm font-medium">Description courte</span>
          <textarea required name="description" defaultValue={item.description} className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description détaillée</span>
          <textarea required name="long_description" defaultValue={item.long_description} className="min-h-40 w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Icône</span>
            <input name="icon" defaultValue={item.icon ?? "heart"} className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Couleur</span>
            <input name="color" defaultValue={item.color ?? "sky"} className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL image</span>
          <input name="image_url" defaultValue={item.image_url ?? ""} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Ordre</span>
          <input name="order" type="number" min={0} defaultValue={item.order ?? 0} className="w-full rounded border p-3" />
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
