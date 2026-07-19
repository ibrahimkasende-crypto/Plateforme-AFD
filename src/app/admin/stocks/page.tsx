import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { ImportRapportButton } from "@/features/document-intelligence/components/ImportRapportButton";
import { requirePermission } from "@/lib/auth/require-permission";

/** Module stocks (socle OCR) — inventaire métier complet à étendre. */
export default async function AdminStocksPage() {
  await requirePermission("ocr.view");

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Stocks"
        description="Point d’entrée pour l’import intelligent des rapports de stock et inventaires."
        actions={
          <ImportRapportButton moduleCible="stocks" typeDocument="inventaire" />
        }
      />
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        Les mouvements de stock officiels ne sont mis à jour qu’après validation humaine
        d’un import OCR.
      </p>
    </main>
  );
}
