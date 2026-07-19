import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentStatusBadge } from "@/features/document-intelligence/components/DocumentStatusBadge";

export default async function FileAttentePage() {
  await requirePermission("ocr.process");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("ocr_jobs" as never)
        .select("id, document_id, status, provider, progress, attempts, error_message, queued_at, started_at, finished_at")
        .order("queued_at", { ascending: false })
        .limit(100)
    : { data: [] };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">File d’attente OCR</h1>
      <p className="text-sm text-slate-600">
        Traitement asynchrone via `ocr_jobs`, worker `scripts/ocr-worker.ts` ou `POST /api/ocr/process`.
      </p>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-slate-500">
              <th className="px-3 py-2">Job</th>
              <th className="px-3 py-2">Document</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Progression</th>
              <th className="px-3 py-2">Tentatives</th>
            </tr>
          </thead>
          <tbody>
            {(data as Array<Record<string, unknown>> | null)?.map((j) => (
              <tr key={String(j.id)} className="border-b border-slate-50">
                <td className="px-3 py-2 font-mono text-[11px]">{String(j.id).slice(0, 8)}</td>
                <td className="px-3 py-2 font-mono text-[11px]">
                  {String(j.document_id).slice(0, 8)}
                </td>
                <td className="px-3 py-2">
                  <DocumentStatusBadge status={String(j.status)} />
                </td>
                <td className="px-3 py-2">{String(j.provider ?? "—")}</td>
                <td className="px-3 py-2">{String(j.progress)} %</td>
                <td className="px-3 py-2">{String(j.attempts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
