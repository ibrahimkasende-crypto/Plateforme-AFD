import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityDetail } from "@/components/public/opportunites/opportunity-detail";
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
  if (!opportunity) return { title: "Opportunité introuvable" };

  const description = opportunity.description.slice(0, 160);
  const open = isOpportunityOpenForApplications(opportunity.statut);

  return {
    title: opportunity.titre,
    description,
    alternates: {
      canonical: `${siteConfig.url}/ressources/opportunites/${opportunity.slug}`,
    },
    openGraph: {
      title: opportunity.titre,
      description,
      url: `${siteConfig.url}/ressources/opportunites/${opportunity.slug}`,
      siteName: siteConfig.appName,
      locale: "fr_CD",
      type: "website",
    },
    robots: open
      ? { index: true, follow: true }
      : { index: true, follow: true },
  };
}

export default async function OpportuniteDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  const open = isOpportunityOpenForApplications(opportunity.statut);

  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opportunity.titre,
    description: opportunity.description,
    datePosted: opportunity.date_publication ?? undefined,
    validThrough: opportunity.date_limite ?? undefined,
    employmentType: opportunity.type_contrat || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    jobLocation: opportunity.localisation
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: opportunity.localisation,
            addressCountry: "CD",
          },
        }
      : undefined,
    ...(open ? {} : { jobPostingStatus: "https://schema.org/Closed" }),
  };

  return (
    <PublicPageShell
      eyebrow="Opportunités"
      title={opportunity.titre}
      description={
        opportunity.localisation
          ? `Localisation : ${opportunity.localisation}`
          : opportunity.description.slice(0, 120)
      }
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Opportunités", href: "/ressources/opportunites" },
        { label: opportunity.titre },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
      />
      <OpportunityDetail opportunity={opportunity} />
    </PublicPageShell>
  );
}
