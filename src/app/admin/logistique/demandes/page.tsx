import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  createLogistiqueDemandeAction,
  transitionDemandeStatutAction,
} from "@/features/logistique/actions/manage-logistique";
import {
  canTransitionDemande,
  type DemandeStatut,
} from "@/features/logistique/lib/transitions";
import { listDemandes } from "@/features/logistique/services/logistique.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const NEXT_ACTIONS: Array<{ to: DemandeStatut; label: string }> = [
  { to: "approuve", label: "Approuver" },
  { to: "rejete", label: "Rejeter" },
  { to: "commande", label: "Commander" },
  { to: "recu", label: "Réceptionner" },
  { to: "annule", label: "Annuler" },
];

export default async function LogistiqueDemandesPage() {
  await requirePermission("logistique:read");
  const supabase = await createClientSafe();
  const rows = supabase ? await listDemandes(supabase) : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Demandes logistiques"
        description="Demandes d'achat et d'approvisionnement avec workflow de statut."
        createHref={"/admin/logistique"}
        createLabel={"Retour"}
      />
      <form
        action={createLogistiqueDemandeAction}
        className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-3"
      >
        <input name="titre" required placeholder="Titre" className="rounded border p-2 text-sm" />
        <input name="note" placeholder="Note" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Créer la demande
        </button>
      </form>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Référence</th>
              <th>Titre</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statut = row.statut as DemandeStatut;
              const actions = NEXT_ACTIONS.filter((a) => canTransitionDemande(statut, a.to));
              return (
                <tr className="border-t" key={row.id}>
                  <td className="p-3 font-mono text-xs">{row.reference}</td>
                  <td>{row.titre}</td>
                  <td>{row.statut}</td>
                  <td>{String(row.created_at ?? "").slice(0, 10)}</td>
                  <td className="space-x-2 p-3">
                    {actions.map((a) => (
                      <form
                        key={a.to}
                        action={transitionDemandeStatutAction}
                        className="inline"
                      >
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="statut" value={a.to} />
                        <button type="submit" className="text-[var(--afd-blue)]">
                          {a.label}
                        </button>
                      </form>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
