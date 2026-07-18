import Link from "next/link";
import type { Opportunity } from "@/features/opportunites/types";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="rounded-2xl border border-[var(--afd-border)] bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-[var(--afd-accent)]">{opportunity.type}</p>
      <h2 className="mt-2 text-xl font-semibold text-[var(--afd-ink)]">
        <Link href={`/ressources/opportunites/${opportunity.slug}`} className="hover:underline">
          {opportunity.titre}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-[var(--afd-muted)]">
        {[opportunity.departement, opportunity.localisation, opportunity.type_contrat]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <p className="mt-4 line-clamp-3 text-sm text-[var(--afd-muted)]">{opportunity.description}</p>
      <Link href={`/ressources/opportunites/${opportunity.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[var(--afd-blue)] hover:underline">
        Consulter l’opportunité
      </Link>
    </article>
  );
}
