import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { ApplicationForm } from "@/components/public/opportunites/application-form";
import { getOpportunityBySlug } from "@/lib/queries/public/opportunites";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpportuniteDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();
  return (
    <PublicPageShell eyebrow="Opportunités" title={opportunity.titre} description={opportunity.description} breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Opportunités", href: "/ressources/opportunites" }, { label: opportunity.titre }]}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 text-[var(--afd-muted)]">
          <p>{[opportunity.departement, opportunity.localisation, opportunity.type_contrat].filter(Boolean).join(" · ")}</p>
          {opportunity.responsabilites ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Responsabilités</h2><p className="mt-2 whitespace-pre-line">{opportunity.responsabilites}</p></section> : null}
          {opportunity.profil_recherche ? <section><h2 className="font-semibold text-[var(--afd-ink)]">Profil recherché</h2><p className="mt-2 whitespace-pre-line">{opportunity.profil_recherche}</p></section> : null}
        </div>
        {opportunity.statut === "ouverte" && opportunity.methode_candidature === "formulaire" ? <ApplicationForm opportunityId={opportunity.id} /> : null}
      </div>
    </PublicPageShell>
  );
}
