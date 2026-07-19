import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { DocumentDetailNav } from "@/features/document-intelligence/components/DocumentDetailNav";
import { getApplicationPlanAction } from "@/features/document-intelligence/actions/apply-document";

type Params = Promise<{ id: string }>;

export default async function DonneesPage({ params }: { params: Params }) {
  await requirePermission("ocr.view");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data: champs } = await supabase
    .from("ocr_champs_extraits" as never)
    .select("id, field_key, raw_value, corrected_value, confidence, review_status")
    .eq("document_id", id);

  let plan = null as Awaited<ReturnType<typeof getApplicationPlanAction>> | null;
  try {
    plan = await getApplicationPlanAction(id);
  } catch {
    plan = null;
  }

  return (
    <div className="space-y-4">
      <DocumentDetailNav documentId={id} current="/donnees" />
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 className="font-display text-xl font-bold">Données extraites</h1>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-slate-500">
                <th className="px-2 py-2">Champ</th>
                <th className="px-2 py-2">Brut</th>
                <th className="px-2 py-2">Corrigé</th>
                <th className="px-2 py-2">Confiance</th>
                <th className="px-2 py-2">Révision</th>
              </tr>
            </thead>
            <tbody>
              {(champs as Array<Record<string, unknown>> | null)?.map((c) => (
                <tr key={String(c.id)} className="border-b border-slate-50">
                  <td className="px-2 py-2 font-semibold">{String(c.field_key)}</td>
                  <td className="px-2 py-2">{String(c.raw_value ?? "—")}</td>
                  <td className="px-2 py-2">{String(c.corrected_value ?? "—")}</td>
                  <td className="px-2 py-2">
                    {c.confidence != null
                      ? `${Math.round(Number(c.confidence) * 100)} %`
                      : "—"}
                  </td>
                  <td className="px-2 py-2">{String(c.review_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {plan ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-display text-lg font-bold">Plan d’application</h2>
          {plan.blocked ? (
            <p className="mt-2 text-sm text-amber-800">
              {plan.warnings.join(" ") || "Plan bloqué"}
            </p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {plan.lines.map((line, i) => (
              <li key={i} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <span className="font-semibold">{line.action}</span> → {line.targetTable}
                {line.conflict ? (
                  <span className="ml-2 text-red-600">{line.conflict}</span>
                ) : null}
                <pre className="mt-1 overflow-auto text-[11px] text-slate-600">
                  {JSON.stringify(line.payload, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
