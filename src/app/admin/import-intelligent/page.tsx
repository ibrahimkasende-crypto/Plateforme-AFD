import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { getOcrDashboardStats } from "@/features/document-intelligence/services/document-dashboard.service";
import { DocumentStatusBadge } from "@/features/document-intelligence/components/DocumentStatusBadge";

export default async function ImportIntelligentPage() {
  await requirePermission("ocr.view");
  const supabase = await createClientSafe();
  const stats = supabase
    ? await getOcrDashboardStats(supabase)
    : {
        kpis: {
          imported: 0,
          processing: 0,
          toReview: 0,
          approved: 0,
          rejected: 0,
          applied: 0,
          openAnomalies: 0,
          avgProcessingSeconds: 0,
          avgConfidence: 0,
        },
        charts: { byMonth: {}, byType: {}, byModule: {} },
        recent: [],
        criticalAnomalies: [],
        jobs: [],
      };

  const kpiCards = [
    { label: "Documents importés", value: stats.kpis.imported, href: "/admin/import-intelligent" },
    { label: "En traitement", value: stats.kpis.processing, href: "/admin/import-intelligent/file-attente" },
    { label: "À réviser", value: stats.kpis.toReview, href: "/admin/import-intelligent?filter=needs_review" },
    { label: "Approuvés", value: stats.kpis.approved, href: "/admin/import-intelligent?filter=approved" },
    { label: "Rejetés", value: stats.kpis.rejected, href: "/admin/import-intelligent?filter=rejected" },
    { label: "Anomalies ouvertes", value: stats.kpis.openAnomalies, href: "/admin/import-intelligent?filter=anomalies" },
    { label: "Temps moyen (s)", value: stats.kpis.avgProcessingSeconds, href: "/admin/import-intelligent/file-attente" },
    { label: "Confiance moyenne", value: stats.kpis.avgConfidence, href: "/admin/import-intelligent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Import intelligent
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            OCR, extraction, contrôles et validation humaine — aucune donnée officielle
            avant approbation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/import-intelligent/nouveau"
            className="rounded-lg bg-[var(--afd-orange)] px-4 py-2 text-sm font-bold text-white"
          >
            Nouvel import
          </Link>
          <Link
            href="/admin/import-intelligent/modeles"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            Modèles
          </Link>
          <Link
            href="/admin/import-intelligent/regles"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            Règles
          </Link>
          <Link
            href="/admin/import-intelligent/file-attente"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            File d’attente
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[var(--admin-primary)]/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="font-display text-base font-bold">Traitements récents</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {stats.recent.length === 0 ? (
              <li className="py-6 text-sm text-slate-500">Aucun document importé.</li>
            ) : (
              stats.recent.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <Link
                      href={`/admin/import-intelligent/${doc.id}`}
                      className="text-sm font-semibold text-[var(--admin-primary)] hover:underline"
                    >
                      {doc.type_document}
                    </Link>
                    <p className="text-[11px] text-slate-500">
                      {doc.module_cible || "—"} · {new Date(doc.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <DocumentStatusBadge status={doc.status} />
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-display text-base font-bold">Anomalies critiques</h2>
          <ul className="mt-3 space-y-2">
            {stats.criticalAnomalies.length === 0 ? (
              <li className="text-sm text-slate-500">Aucune anomalie critique ouverte.</li>
            ) : (
              stats.criticalAnomalies.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/import-intelligent/${a.document_id}/anomalies`}
                    className="block rounded-lg border border-red-100 bg-red-50/60 px-3 py-2 text-xs text-red-900"
                  >
                    {a.message}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
