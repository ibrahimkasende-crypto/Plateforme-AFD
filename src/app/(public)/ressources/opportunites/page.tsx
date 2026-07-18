import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { OpportunityCard } from "@/components/public/opportunites/opportunity-card";
import { OpportunityFilters } from "@/components/public/opportunites/opportunity-filters";
import { getPublishedOpportunities } from "@/lib/queries/public/opportunites";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Opportunités",
  description:
    "Opportunités de collaboration, stages et engagements auprès de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/opportunites` },
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function OpportunitesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = parseQuery(params.type);
  const localisation = parseQuery(params.localisation);
  const q = parseQuery(params.q);
  const result = await getPublishedOpportunities({ type, localisation, q, page: parsePage(params.page) });
  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Opportunités"
      description="Offres de collaboration et opportunités d’engagement."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Opportunités" },
      ]}
    >
      <OpportunityFilters type={type} localisation={localisation} q={q} />
      {result.items.length === 0 ? <EmptyState
        title="Aucune opportunité publiée"
        description="Il n’y a pas d’offre de stage, de mission ou de collaboration publiée actuellement. Pour exprimer votre intérêt ou proposer votre candidature spontanée, contactez l’équipe AFD."
        action={
          <Link
            href="/contact"
            className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
          >
            Nous contacter
          </Link>
        }
      /> : <div className="grid gap-5 md:grid-cols-2">{result.items.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div>}
    </PublicPageShell>
  );
}
