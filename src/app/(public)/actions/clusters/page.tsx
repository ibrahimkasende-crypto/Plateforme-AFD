import type { Metadata } from "next";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getActiveClusters } from "@/lib/queries/public/clusters";

export const metadata: Metadata = {
  title: "Clusters",
  description:
    "Clusters et coordination sectorielle de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/actions/clusters` },
};

export default async function ClustersPage() {
  const clusters = await getActiveClusters();

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Clusters"
      description="Coordination sectorielle et clusters humanitaires auxquels l’AFD contribue ou participe."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Clusters" },
      ]}
    >
      {clusters.length === 0 ? (
        <EmptyState
          title="Aucun cluster publié"
          description="Les clusters actifs apparaîtront ici dès leur publication dans l’administration."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {clusters.map((cluster) => (
            <li
              key={cluster.id}
              className="rounded-2xl border border-[var(--afd-border)] bg-white p-6"
            >
              {cluster.type ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--afd-accent)]">
                  {cluster.type}
                </p>
              ) : null}
              <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
                {cluster.name}
              </h2>
              {cluster.description ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
                  {cluster.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </PublicPageShell>
  );
}
