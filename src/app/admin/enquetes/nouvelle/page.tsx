import { saveEnquete } from "@/features/enquetes/actions/manage-enquete";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleEnquetePage() {
  await requirePermission("enquetes:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouvelle enquête</h1>
      <form action={saveEnquete} className="space-y-4 rounded-2xl border bg-white p-6">
        <input required name="titre" placeholder="Titre" className="w-full rounded-lg border p-3" />
        <input required name="slug" placeholder="slug-enquete" className="w-full rounded-lg border p-3" />
        <textarea name="description" placeholder="Description" className="min-h-28 w-full rounded-lg border p-3" />
        <input name="province" placeholder="Province (optionnel)" className="w-full rounded-lg border p-3" />
        <select name="statut" defaultValue="brouillon" className="w-full rounded-lg border p-3">
          <option value="brouillon">Brouillon</option>
          <option value="publiee">Publiée</option>
          <option value="cloturee">Clôturée</option>
        </select>
        <select name="visibilite" defaultValue="privee" className="w-full rounded-lg border p-3">
          <option value="privee">Privée</option>
          <option value="publique">Publique</option>
          <option value="agents">Agents</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input name="consentement_requis" type="checkbox" defaultChecked /> Consentement requis
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
