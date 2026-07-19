import Link from "next/link";
import { AnalyticsPageView } from "@/components/admin/analytics/analytics-page-view";
import { AdminProvincePanel } from "@/components/admin/admin-province-panel";
import { getProvinceAnalytics } from "@/features/admin-analytics/services/admin-analytics.service";
import { parseAnalyticsContext } from "@/features/admin-analytics/utils/analytics-search-params";

export default async function AdminProvinceAnalysePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const context = parseAnalyticsContext(query);
  const data = await getProvinceAnalytics(context, slug);

  const mapData = data.byProvince.map((row) => ({
    name: row.name,
    value: row.value,
    percent: row.percent,
    slug: row.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_1fr] md:px-6 md:pt-6">
        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-bold">Carte RDC</h2>
            <Link
              href="/admin/analyse/provinces"
              className="text-xs font-semibold text-[var(--admin-primary)] hover:underline"
            >
              Toutes les provinces
            </Link>
          </div>
          <div className="h-[280px]">
            <AdminProvincePanel
              data={
                mapData.length > 0
                  ? mapData
                  : [
                      {
                        name: slug.replace(/-/g, " "),
                        value: data.primaryKpi.value ?? 1,
                        slug,
                      },
                    ]
              }
            />
          </div>
        </section>
        <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-4">
          <h2 className="font-display text-lg font-extrabold capitalize">
            {slug.replace(/-/g, " ")}
          </h2>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            Cliquez une autre province sur la carte pour changer de contexte.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/admin/projets/nouvelle?province=${encodeURIComponent(slug)}`}
              className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-sm font-semibold text-white"
            >
              Ajouter un projet
            </Link>
            <Link
              href={`/admin/activites/nouvelle?province=${encodeURIComponent(slug)}`}
              className="rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm font-semibold"
            >
              Ajouter une activité
            </Link>
            <Link
              href={`/admin/beneficiaires/nouveau?province=${encodeURIComponent(slug)}`}
              className="rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm font-semibold"
            >
              Ajouter des bénéficiaires
            </Link>
            <Link
              href={`/admin/rapports/nouveau?province=${encodeURIComponent(slug)}`}
              className="rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm font-semibold"
            >
              Rapport provincial
            </Link>
          </div>
        </section>
      </div>
      <AnalyticsPageView data={data} />
    </div>
  );
}
