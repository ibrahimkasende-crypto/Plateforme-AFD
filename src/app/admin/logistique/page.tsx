import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminLogistiquePage() {
  await requirePermission("ocr.view");

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Logistique"
        description="Import de bons de livraison, rapports véhicules et carburant."
        actions={
          <ImportRapportButton moduleCible="logistique" typeDocument="rapport_logistique" />
        }
      />
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Module logistique relié à l’import intelligent — aucune donnée appliquée sans approbation.
      </p>
    </main>
  );
}
