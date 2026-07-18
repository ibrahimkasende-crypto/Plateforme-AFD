import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InterventionDomainDetail } from "@/components/public/interventions/intervention-domain-detail";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { siteConfig } from "@/config/site";
import {
  getInterventionDomainBySlug,
  getPublishedInterventionDomains,
} from "@/lib/queries/public/intervention-domains";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const domains = await getPublishedInterventionDomains();
  return domains.map((domain) => ({ slug: domain.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const domain = await getInterventionDomainBySlug(slug);

  if (!domain) {
    return { title: "Domaine introuvable" };
  }

  const url = `${siteConfig.url}/actions/domaines-intervention/${domain.slug}`;

  return {
    title: domain.seoTitle || domain.title,
    description: domain.seoDescription || domain.summary,
    alternates: { canonical: url },
    openGraph: {
      title: domain.title,
      description: domain.seoDescription || domain.summary,
      url,
      siteName: siteConfig.appName,
      locale: "fr_CD",
      type: "article",
      images: domain.imageSrc ? [{ url: domain.imageSrc }] : undefined,
    },
  };
}

export default async function DomaineInterventionDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const domain = await getInterventionDomainBySlug(slug);

  if (!domain) notFound();

  const all = await getPublishedInterventionDomains();
  const related = all.filter((item) => item.slug !== domain.slug).slice(0, 3);

  return (
    <Section className="bg-[var(--afd-background)] pt-6 sm:pt-8">
      <SiteContainer>
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Actions", href: "/actions" },
            {
              label: "Domaines d’intervention",
              href: "/actions/domaines-intervention",
            },
            { label: domain.title },
          ]}
        />
        <div className="mt-6">
          <InterventionDomainDetail domain={domain} related={related} />
        </div>
      </SiteContainer>
    </Section>
  );
}
