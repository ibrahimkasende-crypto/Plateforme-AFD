import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminSauvegardesPage() {
  await requirePermission("parametres:manage");

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Sauvegardes"
        description="Politique de sauvegarde PostgreSQL et Storage Supabase."
      />
      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-medium">Recommandations</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--afd-muted)]">
          <li>Sauvegarde quotidienne automatique via Supabase (plan Pro).</li>
          <li>Export manuel avant chaque migration destructive.</li>
          <li>Test de restauration trimestriel sur environnement de staging.</li>
        </ul>
      </div>
    </main>
  );
}
