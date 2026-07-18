import { requirePermission } from "@/lib/auth/require-permission";
import { saveChiffreImpact } from "@/features/indicateurs/actions/manage-chiffre-impact";

export default async function NouvelIndicateurPage() {
  await requirePermission("indicateurs:write");
  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouvel indicateur</h1>
      <form action={saveChiffreImpact} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Clé technique</span>
          <input required name="key" placeholder="beneficiaires_total" pattern="[a-z0-9_]+" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Libellé</span>
          <input required name="label" className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Valeur</span>
            <input name="value" type="number" step="any" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Unité</span>
            <input name="unit" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Suffixe</span>
            <input name="suffix" placeholder="+" className="w-full rounded border p-3" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea name="description" className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Période de référence</span>
          <input name="reference_period" placeholder="2024-2025" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Source de validation</span>
          <input name="validation_source" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Ordre</span>
          <input name="order_index" type="number" min={0} defaultValue={0} className="w-full rounded border p-3" />
        </label>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked />
            Actif
          </label>
          <label className="inline-flex items-center gap-2">
            <input name="validated" type="checkbox" />
            Validé (affichable publiquement)
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
