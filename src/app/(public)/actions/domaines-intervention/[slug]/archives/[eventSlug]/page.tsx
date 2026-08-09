import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventArchiveDetail } from "@/components/public/interventions/event-archive-detail";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Section } from "@/components/shared/Section";
import { SiteContainer } from "@/components/shared/SiteContainer";
import { FALLBACK_EVENT_ARCHIVES } from "@/config/event-archives";
import { siteConfig } from "@/config/site";
import { getPublishedEventArchiveBySlug } from "@/lib/queries/public/event-archives";
import { getInterventionDomainBySlug } from "@/lib/queries/public/intervention-domains";

type PageProps = {
  params: Promise<{ slug: string; eventSlug: string }>;
};

export async function generateStaticParams() {
  return FALLBACK_EVENT_ARCHIVES.map((event) => ({
    slug: event.domainSlug,
    eventSlug: event.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, eventSlug } = await params;
  const [domain, event] = await Promise.all([
    getInterventionDomainBySlug(slug),
    getPublishedEventArchiveBySlug(slug, eventSlug),
  ]);

  if (!domain || !event) {
    return { title: "Archive introuvable" };
  }

  const url = `${siteConfig.url}/actions/domaines-intervention/${domain.slug}/archives/${event.slug}`;

  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: url },
    openGraph: {
      title: event.title,
      description: event.summary,
      url,
      siteName: siteConfig.appName,
      locale: "fr_CD",
      type: "article",
      images: event.coverImageUrl ? [{ url: event.coverImageUrl }] : undefined,
    },
  };
}

export default async function EventArchiveDetailPage({ params }: PageProps) {
  const { slug, eventSlug } = await params;
  const [domain, event] = await Promise.all([
    getInterventionDomainBySlug(slug),
    getPublishedEventArchiveBySlug(slug, eventSlug),
  ]);

  if (!domain || !event) notFound();

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
            {
              label: domain.title,
              href: `/actions/domaines-intervention/${domain.slug}`,
            },
            { label: "Archive" },
          ]}
        />
        <div className="mt-6">
          <EventArchiveDetail event={event} domain={domain} />
        </div>
      </SiteContainer>
    </Section>
  );
}
