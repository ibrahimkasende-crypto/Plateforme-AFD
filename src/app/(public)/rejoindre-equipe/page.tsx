import { PublicPageShell } from "@/components/public/PublicPageShell";
import { ApplicationForm } from "@/components/public/opportunites/application-form";
import { OpportunityCard } from "@/components/public/opportunites/opportunity-card";
import { siteConfig } from "@/config/site";
import { homeContent } from "@/config/home-content";
import { getPublishedOpportunities } from "@/lib/queries/public/opportunites";

export default async function RejoindreEquipePage() {
  const opportunities = await getPublishedOpportunities({ statut: "ouverte", pageSize: 6 });
  return (
    <PublicPageShell eyebrow="Carrières" title="Rejoindre l’équipe AFD" description="Consultez les opportunités publiées ou, lorsque cette option est ouverte, envoyez une candidature spontanée." breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Rejoindre l’équipe" }]}>
      <div className="space-y-10">
        <section className="space-y-3 text-[var(--afd-muted)]"><h2 className="text-2xl font-semibold text-[var(--afd-ink)]">Travailler avec l’AFD</h2><p>L’Alliance des Femmes pour le Développement est une ONG nationale congolaise engagée aux côtés des communautés vulnérables, à travers des actions humanitaires et des programmes de développement inclusifs.</p></section>
        <section><h2 className="text-2xl font-semibold text-[var(--afd-ink)]">Nos valeurs au travail</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{homeContent.values.map((value) => <li key={value.id} className="rounded-xl border border-[var(--afd-border)] bg-white p-4"><h3 className="font-semibold">{value.title}</h3><p className="mt-1 text-sm text-[var(--afd-muted)]">{value.description}</p></li>)}</ul></section>
        <section className="text-[var(--afd-muted)]"><h2 className="text-2xl font-semibold text-[var(--afd-ink)]">Profils et collaborations</h2><p className="mt-3">Nous recherchons, selon les besoins institutionnels publiés, des personnes partageant notre engagement pour les droits, la participation des femmes et le renforcement des communautés.</p><ul className="mt-3 list-disc space-y-1 pl-5"><li>Emploi et missions salariées</li><li>Stages et apprentissage professionnel</li><li>Volontariat et expertise bénévole</li><li>Consultances et collaborations techniques</li></ul></section>
        <section><h2 className="text-2xl font-semibold text-[var(--afd-ink)]">Opportunités ouvertes</h2>{opportunities.items.length ? <div className="mt-4 grid gap-5 md:grid-cols-2">{opportunities.items.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div> : <p className="mt-3 text-[var(--afd-muted)]">Aucune opportunité n’est ouverte actuellement.</p>}</section>
        {siteConfig.features.spontaneousApplications ? <section><h2 className="mb-4 text-2xl font-semibold text-[var(--afd-ink)]">Candidature spontanée</h2><ApplicationForm spontaneous /></section> : <p className="rounded-xl border border-[var(--afd-border)] bg-white p-5 text-[var(--afd-muted)]">Les candidatures spontanées ne sont pas ouvertes actuellement. Consultez les opportunités publiées.</p>}
      </div>
    </PublicPageShell>
  );
}
