import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";
import { getOcrDashboardStats } from "@/features/document-intelligence/services/document-dashboard.service";
import { DocumentStatusBadge } from "@/features/document-intelligence/components/DocumentStatusBadge";

const IMPORT_TYPES: {
  title: string;
  description: string;
  href: string;
  badge: string;
}[] = [
  {
    title: "Rapport de mission",
    description: "PDF, Word, scan ou ZIP — mission, activités, photos, dépenses proposées.",
    href: "/admin/import-intelligent/missions",
    badge: "A",
  },
  {
    title: "Rapport financier Excel",
    description: "Budgets, dépenses, soldes — jamais appliqué sans validation humaine.",
    href: "/admin/import-intelligent/finances",
    badge: "B",
  },
  {
    title: "Dossier photos",
    description: "Images ou ZIP — album, tags, photothèque, site public après validation.",
    href: "/admin/import-intelligent/photos",
    badge: "C",
  },
  {
    title: "Communication Word",
    description: "Actualité, histoire d’impact, communiqué — brouillon + SEO.",
    href: "/admin/import-intelligent/communications",
    badge: "D",
  },
  {
    title: "Liste de bénéficiaires",
    description: "Excel/CSV — normalisation, doublons, rattachement projet/activité.",
    href: "/admin/import-intelligent/beneficiaires",
    badge: "E",
  },
  {
    title: "Projet / programme / activité",
    description: "Import générique de contenu éditorial opérationnel.",
    href: "/admin/projets/nouvelle/import",
    badge: "+",
  },
];

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
    { label: "Documents importés", value: stats.kpis.imported, href: "/admin/import-intelligent/historique" },
    { label: "En traitement", value: stats.kpis.processing, href: "/admin/import-intelligent/file-attente" },
    { label: "À réviser", value: stats.kpis.toReview, href: "/admin/import-intelligent?filter=needs_review" },
    { label: "Approuvés", value: stats.kpis.approved, href: "/admin/import-intelligent?filter=approved" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Centre d’import intelligent
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Transformez vos documents, rapports, tableaux et photos en données
            structurées. Aucune publication sans validation humaine.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/import-intelligent/nouveau"
            className="rounded-lg bg-[var(--afd-orange)] px-4 py-2 text-sm font-bold text-white"
          >
            Nouvel import OCR
          </Link>
          <Link
            href="/admin/import-intelligent/historique"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            Historique
          </Link>
          <Link
            href="/admin/import-intelligent/modeles"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            Modèles
          </Link>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {IMPORT_TYPES.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[var(--afd-blue)] hover:shadow-md"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#eaf5fd] text-xs font-bold text-[var(--afd-blue)]">
              {item.badge}
            </span>
            <h2 className="mt-3 text-base font-semibold text-slate-900 group-hover:text-[var(--afd-blue)]">
              {item.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {item.description}
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-[var(--afd-blue)]">
              Commencer →
            </span>
          </Link>
        ))}
      </section>

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

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-display text-base font-bold">Traitements récents</h2>
        <ul className="mt-3 divide-y divide-slate-100">
          {stats.recent.length === 0 ? (
            <li className="py-6 text-sm text-slate-500">
              Aucun document importé. Lancez un import recommandé ci-dessus.
            </li>
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
                    {doc.module_cible || "—"} ·{" "}
                    {new Date(doc.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <DocumentStatusBadge status={doc.status} />
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
