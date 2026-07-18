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
import { SupportActions } from "@/components/public/home/support-actions";
import { homeContent } from "@/config/home-content";
import { siteConfig } from "@/config/site";
import {
  getActivePartners,
  getFeaturedImpactStory,
  getLatestPublishedNews,
  getPublicImpactStats,
} from "@/lib/queries/home";
import { getPublicInterventionZones } from "@/lib/queries/intervention-zones";

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

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo.src}`,
    foundingDate: String(homeContent.organization.foundedYear),
    areaServed: {
      "@type": "Country",
      name: siteConfig.country,
    },
    email: siteConfig.contact.email,
    description: siteConfig.description,
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

      <OrganizationIntroduction />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={6} className="bg-white" />
        }
      >
        <InterventionPillars />
      </Suspense>

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={4} className="bg-[var(--afd-surface)]" />
        }
      >
        <ZonesBlock />
      </Suspense>

      <Suspense fallback={<HomeSectionSkeleton cards={4} />}>
        <ImpactNewsBlock />
      </Suspense>

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={2} className="bg-[var(--afd-surface)]" />
        }
      >
        <OpenOpportunitiesSection />
      </Suspense>

      <NewsletterSection />

      <Suspense
        fallback={
          <HomeSectionSkeleton cards={5} className="bg-[var(--afd-background)]" />
        }
      >
        <PartnersBlock />
      </Suspense>

      <SupportActions />
    </>
  );
}
