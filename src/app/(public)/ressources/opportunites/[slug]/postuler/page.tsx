import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationWizard } from "@/components/public/opportunites/application-wizard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getOpportunityBySlug } from "@/lib/queries/public/opportunites";
import { isOpportunityOpenForApplications } from "@/features/opportunites/utils/status";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const opportunity = await getOpportunityBySlug((await params).slug);
  if (!opportunity) return { title: "Postuler" };
  return {
    title: `Postuler — ${opportunity.titre}`,
    description: `Candidature pour ${opportunity.titre}`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteConfig.url}/ressources/opportunites/${opportunity.slug}/postuler`,
    },
  };
}

export default async function PostulerPage(props: PageProps) {
  const { slug } = await props.params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  const closed = !isOpportunityOpenForApplications(opportunity.statut);
  const deadline = opportunity.date_limite
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(opportunity.date_limite))
    : null;

  return (
    <PublicPageShell
      eyebrow="Candidature"
      title={`Postuler — ${opportunity.titre}`}
      description="Complétez le formulaire en plusieurs étapes. Les CV restent privés."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Opportunités", href: "/ressources/opportunites" },
        {
          label: opportunity.titre,
          href: `/ressources/opportunites/${opportunity.slug}`,
        },
        { label: "Postuler" },
      ]}
    >
      <div className="mb-6 rounded-xl border border-[var(--afd-border)] bg-white p-4 text-sm text-[var(--afd-muted)]">
        <p>
          <Link
            href={`/ressources/opportunites/${opportunity.slug}`}
            className="font-semibold text-[var(--afd-blue)]"
          >
            ← Retour à l’offre
          </Link>
        </p>
        <p className="mt-2">
          Les données sont traitées uniquement pour le recrutement AFD. Consultez
          la{" "}
          <Link
            href="/politique-confidentialite"
            className="font-semibold text-[var(--afd-blue)] underline"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </div>

      <ApplicationWizard
        opportunityId={opportunity.id}
        opportunitySlug={opportunity.slug}
        opportunityTitle={opportunity.titre}
        localisation={opportunity.localisation}
        dateLimite={deadline}
        closed={closed}
      />
    </PublicPageShell>
  );
}
