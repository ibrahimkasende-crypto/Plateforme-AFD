import Link from "next/link";
import { saveRapport } from "@/features/rapports/actions/manage-rapport";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminRapportsNouveauPage() {
  await requirePermission("rapports:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nouveau rapport</h1>
        <Link href="/admin/rapports/historique" className="text-sm text-[var(--afd-blue)]">
          Historique
        </Link>
      </div>
      <form action={saveRapport} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre</span>
          <input required name="title" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Type</span>
          <select name="type" className="w-full rounded border p-3">
            <option value="activite">Activité</option>
            <option value="financier">Financier</option>
            <option value="impact">Impact</option>
            <option value="partenaire">Partenaire</option>
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Début période</span>
            <input type="date" name="period_start" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Fin période</span>
            <input type="date" name="period_end" className="w-full rounded border p-3" />
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Générer le rapport
        </button>
      </form>
    </main>
  );
}
