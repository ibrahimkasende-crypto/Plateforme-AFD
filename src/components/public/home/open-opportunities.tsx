import Link from "next/link";
import { getPublishedOpportunities } from "@/lib/queries/public/opportunites";

export async function OpenOpportunities() {
  const result = await getPublishedOpportunities({ statut: "ouverte", pageSize: 3 });
  if (!result.items.length) return null;
  return (
    <section className="bg-[var(--afd-surface)] py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-[var(--afd-blue)]">Carrières</p><h2 className="font-display text-3xl font-semibold text-[var(--afd-ink)]">Opportunités ouvertes</h2></div>
          <Link href="/ressources/opportunites" className="font-semibold text-[var(--afd-blue)]">Voir toutes les opportunités</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{result.items.map((opportunity) => <Link key={opportunity.id} href={`/ressources/opportunites/${opportunity.slug}`} className="rounded-xl border border-[var(--afd-border)] bg-white p-5 transition hover:border-[var(--afd-blue)]"><h3 className="font-semibold text-[var(--afd-ink)]">{opportunity.titre}</h3><p className="mt-2 text-sm text-[var(--afd-muted)]">{[opportunity.type, opportunity.localisation].filter(Boolean).join(" · ")}</p>{opportunity.date_limite ? <p className="mt-3 text-sm text-[var(--afd-muted)]">Date limite : {opportunity.date_limite}</p> : null}</Link>)}</div>
      </div>
    </section>
  );
}
