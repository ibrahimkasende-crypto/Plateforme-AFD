import { saveAgent } from "@/features/agents/actions/manage-agent";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelAgentPage() {
  await requirePermission("agents:write");

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Nouvel agent terrain</h1>
      <form action={saveAgent} className="space-y-4 rounded-2xl border bg-white p-6">
        <input required name="full_name" placeholder="Nom complet" className="w-full rounded-lg border p-3" />
        <input name="matricule" placeholder="Matricule (optionnel)" className="w-full rounded-lg border p-3" />
        <input name="fonction" placeholder="Fonction" className="w-full rounded-lg border p-3" />
        <input name="telephone" placeholder="Téléphone" className="w-full rounded-lg border p-3" />
        <input name="province" placeholder="Province" className="w-full rounded-lg border p-3" />
        <input name="territoire" placeholder="Territoire / ville" className="w-full rounded-lg border p-3" />
        <input name="disponibilite" placeholder="Disponibilité" className="w-full rounded-lg border p-3" />
        <input name="date_affectation" type="date" className="w-full rounded-lg border p-3" />
        <label className="flex items-center gap-2 text-sm">
          <input name="actif" type="checkbox" defaultChecked /> Actif
        </label>
        <button type="submit" className="rounded-lg bg-[var(--afd-blue)] px-4 py-2 font-semibold text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
