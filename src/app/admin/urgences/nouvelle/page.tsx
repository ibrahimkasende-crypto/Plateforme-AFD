import Link from "next/link";
import { saveUrgence } from "@/features/urgences/actions/manage-urgence";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleUrgencePage() {
  await requirePermission("urgences:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nouvelle urgence</h1>
        <Link href="/admin/urgences" className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </div>
      <form action={saveUrgence} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre</span>
          <input required name="title" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Résumé</span>
          <textarea name="summary" className="min-h-24 w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Province</span>
          <input name="province" className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Date de début</span>
            <input type="date" name="started_at" className="w-full rounded border p-3" />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Date de fin</span>
            <input type="date" name="ended_at" className="w-full rounded border p-3" />
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
