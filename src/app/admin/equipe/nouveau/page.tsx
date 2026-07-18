import { requirePermission } from "@/lib/auth/require-permission";
import { saveMembreEquipe } from "@/features/equipe/actions/manage-membre";

export default async function NouveauMembrePage() {
  await requirePermission("equipe:write");
  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouveau membre d&apos;équipe</h1>
      <form action={saveMembreEquipe} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nom complet</span>
          <input required name="name" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Fonction</span>
          <input required name="role" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea required name="description" className="min-h-32 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Genre</span>
          <select name="gender" defaultValue="femme" className="w-full rounded border p-3">
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">URL photo</span>
          <input name="photo_url" className="w-full rounded border p-3" />
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
