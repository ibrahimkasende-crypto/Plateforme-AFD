import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { saveMembreEquipe } from "@/features/equipe/actions/manage-membre";
import { getAdminMembreEquipe } from "@/lib/queries/admin/equipe";

export default async function ModifierMembrePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("equipe:write");
  const item = await getAdminMembreEquipe((await params).id);
  if (!item) notFound();

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Modifier le membre</h1>
      <form action={saveMembreEquipe} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nom complet</span>
          <input required name="name" defaultValue={item.name} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Fonction</span>
          <input required name="role" defaultValue={item.role} className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea required name="description" defaultValue={item.description} className="min-h-32 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Genre</span>
          <select name="gender" defaultValue={item.gender ?? "femme"} className="w-full rounded border p-3">
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL photo</span>
          <input name="photo_url" defaultValue={item.photo_url ?? ""} className="w-full rounded border p-3" />
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
