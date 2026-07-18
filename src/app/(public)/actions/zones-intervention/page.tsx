import type { Metadata } from "next";
import { DrcInteractiveMap } from "@/components/maps/drc-interactive-map";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getPublicInterventionZones } from "@/lib/queries/intervention-zones";

export const metadata: Metadata = {
  title: "Zones d’intervention",
  description:
    "Carte interactive des provinces couvertes par les projets publiés de l’Alliance des Femmes pour le Développement en RDC.",
  alternates: { canonical: `${siteConfig.url}/actions/zones-intervention` },
};

type SearchParams = Promise<{ province?: string | string[] }>;

export default async function ZonesInterventionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const provinceParam = Array.isArray(params.province)
    ? params.province[0]
    : params.province;
  const bundle = await getPublicInterventionZones();
  const initialProvinceId =
    provinceParam &&
    bundle.provinces.some((province) => province.id === provinceParam)
      ? provinceParam
      : null;

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Zones d’intervention"
      description="Carte interactive des 26 provinces de la RDC. Les données affichées proviennent exclusivement des projets publiés."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Zones d’intervention" },
      ]}
    >
      <DrcInteractiveMap
        key={initialProvinceId ?? "all"}
        bundle={bundle}
        variant="page"
        initialProvinceId={initialProvinceId}
      />

      {bundle.hasPublishedLocations ? (
        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-[var(--afd-navy)]">
            Provinces avec interventions publiées
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bundle.provinces
              .filter((province) => province.active)
              .map((province) => (
                <li
                  key={province.id}
                  className="rounded-2xl border border-[var(--afd-border)] bg-white p-4"
                >
                  <h3 className="font-semibold text-[var(--afd-ink)]">
                    {province.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--afd-muted)]">
                    {province.projectCount} projet
                    {province.projectCount > 1 ? "s" : ""}
                    {province.beneficiaries != null && province.beneficiaries > 0
                      ? ` · ${new Intl.NumberFormat("fr-FR").format(province.beneficiaries)} bénéficiaires`
                      : ""}
                  </p>
                  {province.programmes.length > 0 ? (
                    <p className="mt-2 text-xs text-[var(--afd-muted)]">
                      Programmes :{" "}
                      {province.programmes.map((p) => p.title).join(", ")}
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </PublicPageShell>
  );
}
