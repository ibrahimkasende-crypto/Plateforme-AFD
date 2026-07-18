import Link from "next/link";
import { saveBeneficiaireAgregat } from "@/features/beneficiaires/actions/manage-beneficiaire";
import { requirePermission } from "@/lib/auth/require-permission";
import { getProgrammeOptions } from "@/lib/queries/admin/programmes";
import { getProjetOptions } from "@/lib/queries/admin/projets";

export default async function NouveauBeneficiairePage() {
  await requirePermission("beneficiaires:write");
  const [programmes, projets] = await Promise.all([getProgrammeOptions(), getProjetOptions()]);

  return (
    <main className="max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nouvel agrégat bénéficiaires</h1>
        <Link href="/admin/beneficiaires" className="text-sm text-[var(--afd-blue)]">
          Retour
        </Link>
      </div>
      <form action={saveBeneficiaireAgregat} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Période</span>
          <input required type="date" name="periode" className="w-full rounded border p-3" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Province</span>
          <input name="province" className="w-full rounded border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Programme</span>
            <select name="programme_id" className="w-full rounded border p-3">
              <option value="">—</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Projet</span>
            <select name="projet_id" className="w-full rounded border p-3">
              <option value="">—</option>
              {projets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["femmes", "hommes", "enfants", "jeunes"] as const).map((field) => (
            <label key={field} className="block space-y-1">
              <span className="text-sm font-medium capitalize">{field}</span>
              <input type="number" min={0} name={field} defaultValue={0} className="w-full rounded border p-3" />
            </label>
          ))}
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
