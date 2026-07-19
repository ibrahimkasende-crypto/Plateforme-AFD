import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentDetailNav } from "@/features/document-intelligence/components/DocumentDetailNav";
import { DocumentStatusBadge } from "@/features/document-intelligence/components/DocumentStatusBadge";
import { IntegrityStatusBadge } from "@/features/document-intelligence/components/IntegrityStatusBadge";
import { approveOcrDocumentAction, rejectOcrDocumentAction } from "@/features/document-intelligence/actions/approve-document";
import { applyOcrDocumentAction, rollbackOcrDocumentAction } from "@/features/document-intelligence/actions/apply-document";
import { submitOcrForApprovalAction } from "@/features/document-intelligence/actions/review-document";
import { OCR_BUCKET } from "@/features/document-intelligence/config";

type Params = Promise<{ id: string }>;

export default async function ImportDocumentDetailPage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("ocr.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("documents_importes" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const doc = data as {
    id: string;
    titre: string;
    status: string;
    type_document: string;
    module_cible: string | null;
    hash_sha256: string | null;
    integrity_status: string | null;
    duplicate_of_id: string | null;
    ocr_provider: string | null;
    processing_progress: number;
    original_filename: string;
    storage_path: string;
    provenance_source: string | null;
    classification_sensibilite: string;
    error_message: string | null;
  };

  const { data: signed } = await supabase.storage
    .from(OCR_BUCKET)
    .createSignedUrl(doc.storage_path, 120);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {doc.titre}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{doc.original_filename}</p>
        </div>
        <DocumentStatusBadge status={doc.status} />
      </div>

      <DocumentDetailNav documentId={id} current="" />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="font-display text-base font-bold">Informations</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-500">Type</dt>
              <dd className="font-semibold">{doc.type_document}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Module cible</dt>
              <dd className="font-semibold">{doc.module_cible || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Fournisseur OCR</dt>
              <dd className="font-semibold">{doc.ocr_provider || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Progression</dt>
              <dd className="font-semibold">{doc.processing_progress} %</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-slate-500">Empreinte SHA-256</dt>
              <dd className="break-all font-mono text-xs">{doc.hash_sha256 || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Provenance déclarée</dt>
              <dd className="font-semibold">{doc.provenance_source || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Classification</dt>
              <dd className="font-semibold">{doc.classification_sensibilite}</dd>
            </div>
          </dl>
          <IntegrityStatusBadge status={doc.integrity_status} />
          {doc.duplicate_of_id ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              Doublon exact de{" "}
              <Link className="underline" href={`/admin/import-intelligent/${doc.duplicate_of_id}`}>
                {doc.duplicate_of_id}
              </Link>
            </p>
          ) : null}
          {doc.error_message ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {doc.error_message}
            </p>
          ) : null}
          {signed?.signedUrl ? (
            <a
              href={signed.signedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-semibold text-[var(--admin-primary)] underline"
            >
              Ouvrir l’original (URL signée courte)
            </a>
          ) : null}
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-display text-base font-bold">Actions</h2>
          <Link
            href={`/admin/import-intelligent/${id}/revision`}
            className="block rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-center text-sm font-bold text-white"
          >
            Ouvrir la révision
          </Link>
          <form action={submitOcrForApprovalAction}>
            <input type="hidden" name="documentId" value={id} />
            <button className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-white">
              Soumettre pour validation
            </button>
          </form>
          <form action={approveOcrDocumentAction} className="space-y-2">
            <input type="hidden" name="documentId" value={id} />
            <input
              name="comment"
              placeholder="Commentaire approbation"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <button className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white">
              Approuver
            </button>
          </form>
          <form action={rejectOcrDocumentAction} className="space-y-2">
            <input type="hidden" name="documentId" value={id} />
            <input
              name="comment"
              required
              placeholder="Motif de rejet"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            <button className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white">
              Rejeter
            </button>
          </form>
          <form action={applyOcrDocumentAction}>
            <input type="hidden" name="documentId" value={id} />
            <input type="hidden" name="confirm" value="1" />
            <button className="w-full rounded-lg bg-[var(--afd-orange)] px-3 py-2 text-sm font-bold text-white">
              Appliquer le plan confirmé
            </button>
          </form>
          <form action={rollbackOcrDocumentAction}>
            <input type="hidden" name="documentId" value={id} />
            <button className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              Rollback logique
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
