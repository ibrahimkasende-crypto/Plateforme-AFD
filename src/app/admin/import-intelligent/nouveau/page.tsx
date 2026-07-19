import { requirePermission } from "@/lib/auth/require-permission";
import { OcrUploadForm } from "@/features/document-intelligence/components/OcrUploadForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NouveauImportPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("ocr.upload");
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Nouvel import intelligent
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Téléversement sécurisé, empreinte SHA-256, file OCR asynchrone.
        </p>
      </div>
      <OcrUploadForm
        prefill={{
          module_cible: get("module_cible"),
          type_document: get("type_document"),
          programme_id: get("programme_id"),
          projet_id: get("projet_id"),
          periode_debut: get("periode_debut"),
          periode_fin: get("periode_fin"),
          province_id: get("province_id"),
          devise: get("devise"),
        }}
      />
    </div>
  );
}
