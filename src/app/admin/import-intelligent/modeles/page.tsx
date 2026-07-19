import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function ModelesPage() {
  await requirePermission("ocr.manage_models");
  const supabase = await createClientSafe();
  const { data } = supabase
    ? await supabase
        .from("ocr_modeles_extraction" as never)
        .select("id, code, nom, module_cible, version, actif, description, definition")
        .order("code")
    : { data: [] };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Modèles d’extraction</h1>
      <p className="text-sm text-slate-600">
        Champs attendus, mappings cibles et règles associées. Aucun champ OCR ne choisit librement une table SQL.
      </p>
      <div className="grid gap-3">
        {(data as Array<Record<string, unknown>> | null)?.map((m) => (
          <article key={String(m.id)} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">{String(m.nom)}</h2>
              <span className="text-xs font-semibold text-slate-500">
                {String(m.code)} · v{String(m.version)} · {String(m.module_cible)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{String(m.description ?? "")}</p>
            <pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-[11px]">
              {JSON.stringify(m.definition, null, 2)}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
