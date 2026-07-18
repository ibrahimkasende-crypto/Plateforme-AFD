import Link from "next/link";
import { saveCampagne } from "@/features/newsletter/actions/manage-newsletter";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleCampagnePage() {
  await requirePermission("newsletter:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nouvelle campagne</h1>
        <Link href="/admin/newsletter/campagnes" className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </div>
      <form action={saveCampagne} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Titre interne</span>
          <input required name="title" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Objet de l&apos;e-mail</span>
          <input required name="subject" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Programmation</span>
          <input type="datetime-local" name="scheduled_at" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Statut</span>
          <select name="status" defaultValue="brouillon" className="w-full rounded border p-3">
            <option value="brouillon">Brouillon</option>
            <option value="programmee">Programmée</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
