import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";

/**
 * Interface de suivi — aucune sauvegarde n'est annoncée réussie sans preuve runtime.
 */
export default async function AdminSauvegardesPage() {
  await requirePermission("parametres:manage");

  const provider = process.env.BACKUP_STATUS_PROVIDER?.trim() || null;
  const lastKnown = process.env.BACKUP_LAST_KNOWN_AT?.trim() || null;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Sauvegardes"
        description="Statuts connus uniquement. Aucune réussite fictive."
      />
      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">
        {!provider ? (
          <p>
            <strong>Configuration requise.</strong> Reliez un fournisseur de statut
            (Supabase Pro backups, snapshot infra) via{" "}
            <code>BACKUP_STATUS_PROVIDER</code> et{" "}
            <code>BACKUP_LAST_KNOWN_AT</code>. Sans preuve, le statut reste « inconnu ».
          </p>
        ) : (
          <ul className="list-inside list-disc space-y-1">
            <li>Fournisseur : {provider}</li>
            <li>Dernière sauvegarde connue : {lastKnown ?? "non renseignée"}</li>
          </ul>
        )}
      </div>
      <p className="text-sm text-[var(--afd-muted)]">
        Recommandation AFD : sauvegarde quotidienne PostgreSQL + Storage, test de
        restauration trimestriel sur staging.
      </p>
    </main>
  );
}
