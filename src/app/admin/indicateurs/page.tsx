import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import {
  activateChiffreImpact,
  deactivateChiffreImpact,
} from "@/features/indicateurs/actions/manage-chiffre-impact";
import {
  saveIndicateurValeurAction,
  validateIndicateurValeurAction,
} from "@/features/indicateurs/actions/manage-indicateur-valeurs";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminChiffresImpact } from "@/lib/queries/admin/chiffres-impact";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminIndicateursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("indicateurs:read");
  const { q } = await searchParams;
  const items = await getAdminChiffresImpact({ q });
  const supabase = await createClientSafe();
  const { data: valeursRaw } = supabase
    ? await supabase
        .from("indicateur_valeurs" as never)
        .select("id, periode, valeur, baseline, cible, statut, chiffre_impact_id")
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };
  const valeurs = (valeursRaw ?? []) as Array<{
    id: string;
    periode: string;
    valeur: number;
    baseline: number | null;
    cible: number | null;
    statut: string;
    chiffre_impact_id: string | null;
  }>;

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Indicateurs d&apos;impact</h1>
          <p className="text-sm text-[var(--afd-muted)]">
            Chiffres clés affichés sur le site — seuls les indicateurs validés sont publics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportRapportButton moduleCible="indicateurs" typeDocument="rapport_indicateurs" />
          <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/indicateurs/nouveau">
            Nouvel indicateur
          </Link>
        </div>
      </div>

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun indicateur chiffré"
          description="Ajoutez des chiffres d'impact validés pour la page Notre impact."
          action={
            <Link className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white" href="/admin/indicateurs/nouveau">
              Nouvel indicateur
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Ordre</th>
                <th>Libellé</th>
                <th>Valeur</th>
                <th>Validé</th>
                <th>Actif</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.order_index}</td>
                  <td>{item.label}</td>
                  <td>
                    {item.value ?? "—"}
                    {item.suffix ? ` ${item.suffix}` : item.unit ? ` ${item.unit}` : ""}
                  </td>
                  <td>{item.validated ? "Oui" : "Non"}</td>
                  <td>{item.active ? "Oui" : "Non"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/indicateurs/${item.id}/modifier`}>
                      Modifier
                    </Link>
                    {item.active ? (
                      <form action={deactivateChiffreImpact.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-red-700">
                          Désactiver
                        </button>
                      </form>
                    ) : (
                      <form action={activateChiffreImpact.bind(null, item.id)} className="inline">
                        <button type="submit" className="text-[var(--afd-blue)]">
                          Activer
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="space-y-3 rounded border bg-white p-4">
        <h2 className="font-semibold">Valeurs périodiques</h2>
        <form action={saveIndicateurValeurAction} className="grid gap-3 sm:grid-cols-4">
          <select name="chiffre_impact_id" className="rounded border p-2 text-sm" defaultValue="">
            <option value="">Indicateur (optionnel)</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <input name="periode" type="date" required className="rounded border p-2 text-sm" />
          <input name="valeur" type="number" step="0.01" required placeholder="Valeur" className="rounded border p-2 text-sm" />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Enregistrer valeur
          </button>
          <input name="baseline" type="number" step="0.01" placeholder="Baseline" className="rounded border p-2 text-sm" />
          <input name="cible" type="number" step="0.01" placeholder="Cible" className="rounded border p-2 text-sm" />
          <input name="source" placeholder="Source" className="rounded border p-2 text-sm sm:col-span-2" />
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-2">Période</th>
                <th>Valeur</th>
                <th>Baseline</th>
                <th>Cible</th>
                <th>Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {valeurs.map((v) => (
                <tr className="border-t" key={v.id}>
                  <td className="p-2">{v.periode}</td>
                  <td>{v.valeur}</td>
                  <td>{v.baseline ?? "—"}</td>
                  <td>{v.cible ?? "—"}</td>
                  <td>{v.statut}</td>
                  <td className="space-x-2 p-2">
                    {v.statut === "soumis" ? (
                      <>
                        <form action={validateIndicateurValeurAction} className="inline">
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="statut" value="valide" />
                          <button type="submit" className="text-emerald-700">
                            Valider
                          </button>
                        </form>
                        <form action={validateIndicateurValeurAction} className="inline">
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="statut" value="rejete" />
                          <button type="submit" className="text-red-700">
                            Rejeter
                          </button>
                        </form>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
