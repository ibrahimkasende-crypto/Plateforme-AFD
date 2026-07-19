import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentDetailNav } from "@/features/document-intelligence/components/DocumentDetailNav";
import { ReviewWorkspace } from "@/features/document-intelligence/components/ReviewWorkspace";
import { OCR_BUCKET } from "@/features/document-intelligence/config";

type Params = Promise<{ id: string }>;

export default async function RevisionPage({ params }: { params: Params }) {
  await requirePermission("ocr.review");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data: doc } = await supabase
    .from("documents_importes" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!doc) notFound();

  const document = doc as {
    id: string;
    titre: string;
    status: string;
    type_document: string;
    integrity_status: string | null;
    storage_path: string;
    mime_type: string | null;
  };

  const [{ data: fields }, { data: anomalies }, { data: tables }, signed] =
    await Promise.all([
      supabase
        .from("ocr_champs_extraits" as never)
        .select(
          "id, field_key, field_label, raw_value, corrected_value, confidence, review_status, page_number",
        )
        .eq("document_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("ocr_anomalies" as never)
        .select("id, message, severity, status")
        .eq("document_id", id)
        .eq("status", "open"),
      supabase
        .from("ocr_tables" as never)
        .select("id, headers, cells, confidence")
        .eq("document_id", id),
      supabase.storage.from(OCR_BUCKET).createSignedUrl(document.storage_path, 180),
    ]);

  return (
    <div className="space-y-4">
      <DocumentDetailNav documentId={id} current="/revision" />
      <ReviewWorkspace
        documentId={id}
        titre={document.titre}
        status={document.status}
        typeDocument={document.type_document}
        integrityStatus={document.integrity_status}
        previewUrl={signed.data?.signedUrl ?? null}
        mimeType={document.mime_type}
        fields={(fields ?? []) as never}
        anomalies={(anomalies ?? []) as never}
        tables={(tables ?? []) as never}
      />
    </div>
  );
}
