import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsletterGoogleReturn } from "@/components/newsletter/newsletter-google-return";
import { HomeHero } from "@/components/public/home/home-hero";
import { HomeSectionSkeleton } from "@/components/public/home/home-section-skeleton";
import { ImpactAndNews } from "@/components/public/home/impact-and-news";
import { ImpactStatistics } from "@/components/public/home/impact-statistics";
import { InterventionPillars } from "@/components/public/home/intervention-pillars";
import { InterventionZones } from "@/components/public/home/intervention-zones";
import { NewsletterSection } from "@/components/public/home/newsletter-section";
import { OrganizationIntroduction } from "@/components/public/home/organization-introduction";
import { OpenOpportunitiesSection } from "@/components/public/home/open-opportunities-section";
import { PartnersSection } from "@/components/public/home/partners-section";
import { SectionDivider } from "@/components/public/section-divider";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import {
  getActivePartners,
  getFeaturedImpactStory,
  getLatestPublishedNews,
  getPublicImpactStats,
} from "@/lib/queries/home";
import { getPublicInterventionZones } from "@/lib/queries/intervention-zones";
import { getResolvedPublicSiteSettings } from "@/lib/queries/public/site-settings";

export const metadata: Metadata = {
  title: {
    absolute: "Alliance des Femmes pour le Développement | AFD ASBL",
  },
  description:
    "Découvrez les actions humanitaires et de développement de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Alliance des Femmes pour le Développement | AFD ASBL",
    description:
      "Découvrez les actions humanitaires et de développement de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
    url: siteConfig.url,
    siteName: siteConfig.appName,
    locale: "fr_CD",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.logo.src}`,
        width: 512,
        height: 512,
        alt: siteConfig.logo.alt,
      },
    ],
  },
};

async function StatsBlock() {
  const stats = await getPublicImpactStats();
  return <ImpactStatistics stats={stats} />;
}

async function ZonesBlock() {
  const bundle = await getPublicInterventionZones();
  return <InterventionZones bundle={bundle} />;
}

async function ImpactNewsBlock() {
  const [story, news] = await Promise.all([
    getFeaturedImpactStory(),
    getLatestPublishedNews(),
  ]);
  return <ImpactAndNews story={story} news={news} />;
}

async function PartnersBlock() {
  const partners = await getActivePartners();
  return <PartnersSection partners={partners} />;
}

export default async function HomePage() {
  const settings = await getResolvedPublicSiteSettings();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: settings.orgName,
    alternateName: settings.shortName,
    url: siteConfig.url,
    logo: settings.logoUrl.startsWith("http")
      ? settings.logoUrl
      : `${siteConfig.url}${settings.logoUrl}`,
    foundingDate: homeContent.organization.foundedDate,
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
    email: settings.contact.email,
    description: settings.slogan || siteConfig.description,
    disclaimer:
      "AFD ASBL (Alliance des Femmes pour le Développement) ne doit pas être confondue avec l’Agence Française de Développement.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      <Suspense fallback={null}>
        <NewsletterGoogleReturn />
      </Suspense>

      <HomeHero />

      <Suspense
        fallback={
          <div className="-mt-6 pb-2 sm:-mt-8 md:-mt-14">
            <HomeSectionSkeleton cards={6} />
          </div>
        }
      >
        <StatsBlock />
      </Suspense>

      <SectionDivider variant="curve" from="var(--afd-background)" to="var(--afd-surface)" />

      <OrganizationIntroduction />

      <SectionDivider variant="line" className="my-2" />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={6} className="bg-white" />
        }
      >
        <InterventionPillars />
      </Suspense>

      <SectionDivider variant="wave-soft" from="#ffffff" to="var(--afd-surface)" />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={4} className="bg-[var(--afd-surface)]" />
        }
      >
        <ZonesBlock />
      </Suspense>

      <SectionDivider variant="diagonal" from="var(--afd-surface)" to="var(--afd-background)" />

      <Suspense fallback={<HomeSectionSkeleton cards={4} />}>
        <ImpactNewsBlock />
      </Suspense>

      <SectionDivider variant="line" className="my-2" />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={2} className="bg-[var(--afd-surface)]" />
        }
      >
        <OpenOpportunitiesSection />
      </Suspense>

      <SectionDivider variant="curve" from="var(--afd-surface)" to="#e8f3fc" />

      <NewsletterSection />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={5} className="bg-[var(--afd-background)]" />
        }
      >
        <PartnersBlock />
      </Suspense>
    </>
  );
}
