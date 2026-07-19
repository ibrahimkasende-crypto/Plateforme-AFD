import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { collectSystemHealth } from "@/features/system/services/health.service";
import { requirePermission } from "@/lib/auth/require-permission";

function Status({ ok, label }: { ok: boolean | null; label: string }) {
  const text =
    ok === null ? "Inconnu" : ok ? "OK" : "Dégradé";
  const color =
    ok === null ? "text-amber-700" : ok ? "text-emerald-700" : "text-red-700";
  return (
    <div className="rounded border bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{text}</p>
    </div>
  );
}

export default async function AdminSystemePage() {
  await requirePermission("parametres:manage");
  const health = await collectSystemHealth();

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Santé du système"
        description="Statuts mesurés uniquement — aucun succès inventé."
      />
      <p className="text-sm text-slate-600">
        Contrôle : {health.checkedAt.replace("T", " ").slice(0, 19)} · Version{" "}
        {health.appVersion}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Status ok={health.databaseOk} label="Base de données" />
        <Status ok={health.storageOk} label="Storage" />
        <Status ok={health.emailConfigured} label="Email / newsletter" />
        <Status ok={health.serdipayConfigured} label="SerdiPay" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-slate-500">Jobs en file</p>
          <p className="mt-1 text-2xl font-semibold">{health.jobsPending}</p>
        </div>
        <div className="rounded border bg-white p-4">
          <p className="text-sm text-slate-500">Jobs en échec</p>
          <p className="mt-1 text-2xl font-semibold text-red-700">{health.jobsFailed}</p>
        </div>
      </div>
      {health.notes.length > 0 ? (
        <ul className="list-disc space-y-1 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {health.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
