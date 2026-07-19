import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentDetailNav } from "@/features/document-intelligence/components/DocumentDetailNav";

type Params = Promise<{ id: string }>;

export default async function HistoriquePage({ params }: { params: Params }) {
  await requirePermission("ocr.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const [{ data: revisions }, { data: approvals }, { data: apps }, { data: versions }] =
    await Promise.all([
      supabase
        .from("ocr_revisions" as never)
        .select("*")
        .eq("document_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("ocr_approbations" as never)
        .select("*")
        .eq("document_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("ocr_applications" as never)
        .select("*")
        .eq("document_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("document_versions" as never)
        .select("*")
        .eq("document_id", id)
        .order("version_number", { ascending: true }),
    ]);

  return (
    <div className="space-y-4">
      <DocumentDetailNav documentId={id} current="/historique" />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-display font-bold">Révisions</h2>
          <pre className="mt-2 overflow-auto text-[11px]">
            {JSON.stringify(revisions ?? [], null, 2)}
          </pre>
        </section>
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-display font-bold">Approbations</h2>
          <pre className="mt-2 overflow-auto text-[11px]">
            {JSON.stringify(approvals ?? [], null, 2)}
          </pre>
        </section>
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-display font-bold">Applications</h2>
          <pre className="mt-2 overflow-auto text-[11px]">
            {JSON.stringify(apps ?? [], null, 2)}
          </pre>
        </section>
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-display font-bold">Versions fichier</h2>
          <pre className="mt-2 overflow-auto text-[11px]">
            {JSON.stringify(versions ?? [], null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
