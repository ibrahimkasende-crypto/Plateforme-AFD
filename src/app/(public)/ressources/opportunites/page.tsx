import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { OpportunityCard } from "@/components/public/opportunites/opportunity-card";
import { OpportunityFilters } from "@/components/public/opportunites/opportunity-filters";
import { PublicPagination } from "@/components/public/PublicPagination";
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
  const departement = parseQuery(params.departement);
  const localisation = parseQuery(params.localisation);
  const modeTravail = parseQuery(params.mode_travail);
  const statut = parseQuery(params.statut);
  const q = parseQuery(params.q);
  const sort = parseQuery(params.sort) === "date_limite" ? "date_limite" : "date_publication";
  const order = parseQuery(params.order) === "asc" ? "asc" : "desc";
  const result = await getPublishedOpportunities({ type, departement, localisation, mode_travail: modeTravail, statut, q, sort, order, page: parsePage(params.page) });
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
      <OpportunityFilters type={type} departement={departement} localisation={localisation} modeTravail={modeTravail} statut={statut} q={q} sort={sort} order={order} />
      {result.items.length === 0 ? <EmptyState
        title="Aucune opportunité publiée"
        description="Aucune opportunité n’est actuellement ouverte. Vous pouvez consulter régulièrement cette page ou vous inscrire à la newsletter."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/ressources/newsletter" className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white">S’inscrire à la newsletter</Link>
            <Link href="/rejoindre-equipe" className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-blue)] px-4 text-sm font-semibold text-[var(--afd-blue)]">Rejoindre l’équipe</Link>
          </div>
        }
      /> : <><div className="grid gap-5 md:grid-cols-2">{result.items.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div><PublicPagination page={result.page} totalPages={result.totalPages} basePath="/ressources/opportunites" searchParams={{ type, departement, localisation, mode_travail: modeTravail, statut, q, sort, order }} /></>}
    </PublicPageShell>
  );
}
