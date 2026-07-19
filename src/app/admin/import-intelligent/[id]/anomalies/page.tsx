import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentDetailNav } from "@/features/document-intelligence/components/DocumentDetailNav";

type Params = Promise<{ id: string }>;

export default async function AnomaliesPage({ params }: { params: Params }) {
  await requirePermission("ocr.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data } = await supabase
    .from("ocr_anomalies" as never)
    .select("*")
    .eq("document_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <DocumentDetailNav documentId={id} current="/anomalies" />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="font-display text-xl font-bold">Anomalies</h1>
        <p className="mt-1 text-xs text-slate-500">
          Présentées comme informations, avertissements ou risques — jamais comme preuve de fraude.
        </p>
        <ul className="mt-4 space-y-2">
          {(data as Array<Record<string, unknown>> | null)?.length ? (
            (data as Array<Record<string, unknown>>).map((a) => (
              <li key={String(a.id)} className="rounded-lg border px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    {String(a.severity)}
                  </span>
                  <span className="text-[11px] text-slate-400">{String(a.status)}</span>
                </div>
                <p className="mt-1">{String(a.message)}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-500">Aucune anomalie.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
