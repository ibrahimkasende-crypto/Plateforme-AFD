import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function ReglesPage() {
  await requirePermission("ocr.manage_rules");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("ocr_regles_validation" as never)
        .select("*")
        .order("module_cible")
    : { data: [] };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Règles de cohérence</h1>
      <p className="text-sm text-slate-600">
        Contrôles arithmétiques, stocks, activités, finances et documents.
      </p>
      <ul className="space-y-2">
        {(data as Array<Record<string, unknown>> | null)?.map((r) => (
          <li key={String(r.id)} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{String(r.nom)}</span>
              <span className="text-[11px] uppercase text-slate-500">{String(r.severity)}</span>
              <span className="text-[11px] text-slate-400">{String(r.module_cible)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{String(r.description ?? "")}</p>
            <pre className="mt-2 overflow-auto text-[11px] text-slate-500">
              {JSON.stringify(r.expression, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
