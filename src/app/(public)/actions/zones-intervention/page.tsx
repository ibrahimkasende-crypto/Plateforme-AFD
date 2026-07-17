import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getInterventionZones } from "@/lib/queries/home";

export const metadata: Metadata = {
  title: "Zones d’intervention",
  description:
    "Provinces et localités couvertes par les projets publiés de l’Alliance des Femmes pour le Développement en RDC.",
  alternates: { canonical: `${siteConfig.url}/actions/zones-intervention` },
};

export default async function ZonesInterventionPage() {
  const zones = await getInterventionZones();

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Zones d’intervention"
      description="Liste accessible des localités où l’AFD mène ou a mené des projets publiés. Les données proviennent des fiches projets actives."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Zones d’intervention" },
      ]}
    >
      {zones.length === 0 ? (
        <EmptyState
          title="Aucune zone renseignée"
          description="Aucune localisation de projet publiée pour le moment. Les zones apparaîtront dès que des projets actifs seront renseignés."
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-[var(--afd-muted)]">
            {zones.length} zone{zones.length > 1 ? "s" : ""} identifiée
            {zones.length > 1 ? "s" : ""} à partir des projets publiés.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <li
                key={zone.label}
                className="rounded-2xl border border-[var(--afd-border)] bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <MapPinned
                    className="mt-0.5 size-5 shrink-0 text-[var(--afd-accent)]"
                    aria-hidden
                  />
                  <div>
                    <h2 className="font-semibold text-[var(--afd-ink)]">
                      {zone.label}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--afd-muted)]">
                      {zone.projectCount} projet
                      {zone.projectCount > 1 ? "s" : ""}
                      {zone.beneficiaries != null && zone.beneficiaries > 0
                        ? ` · ${new Intl.NumberFormat("fr-FR").format(zone.beneficiaries)} bénéficiaires recensés`
                        : ""}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-[var(--afd-muted)]">
            Carte interactive : non disponible — cette liste remplace toute
            représentation cartographique non fiable.
          </p>
        </>
      )}
    </PublicPageShell>
  );
}
