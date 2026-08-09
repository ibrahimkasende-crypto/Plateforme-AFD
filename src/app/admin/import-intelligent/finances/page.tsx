import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function ImportFinancesPage() {
  await requirePermission("ocr.upload");
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Import — rapport financier
      </h1>
      <p className="text-sm text-slate-600">
        Utilisez le pipeline OCR finance (Excel / CSV / PDF). Aucune transaction
        n’est écrite sans révision et approbation humaines.
      </p>
      <Link
        href="/admin/import-intelligent/nouveau?module_cible=finances&type_document=etat_depenses"
        className="inline-flex rounded-lg bg-[var(--afd-blue)] px-4 py-2.5 text-sm font-semibold text-white"
      >
        Ouvrir l’import OCR financier
      </Link>
      <Link
        href="/admin/import-intelligent"
        className="ml-3 text-sm text-slate-600 underline"
      >
        Retour au centre
      </Link>
    </main>
  );
}
