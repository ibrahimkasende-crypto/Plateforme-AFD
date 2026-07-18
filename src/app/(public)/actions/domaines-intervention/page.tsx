import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InterventionDomainsSection } from "@/components/public/interventions/intervention-domains-section";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getPublishedInterventionDomains } from "@/lib/queries/public/intervention-domains";

export const metadata: Metadata = {
  title: "Domaines d’intervention",
  description:
    "Les six domaines d’intervention de l’Alliance des Femmes pour le Développement : autonomisation économique, protection et VBG, santé maternelle, WASH, leadership et gouvernance communautaire, femmes dans la réponse humanitaire et d’urgence.",
  alternates: { canonical: `${siteConfig.url}/actions/domaines-intervention` },
  openGraph: {
    title: "Domaines d’intervention | AFD ASBL",
    description:
      "Six axes d’action de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
    url: `${siteConfig.url}/actions/domaines-intervention`,
    siteName: siteConfig.appName,
    locale: "fr_CD",
    type: "website",
  },
};

export default async function DomainesInterventionPage() {
  const domains = await getPublishedInterventionDomains();
  const allTopics = domains.flatMap((domain) => [...domain.topics]);

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Domaines d’intervention"
      description="L’AFD structure ses actions autour de six domaines complémentaires, au service des femmes, des filles et des communautés."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Domaines d’intervention" },
      ]}
    >
      <InterventionDomainsSection
        domains={domains}
        showPageLink={false}
        hideHeader
        bare
      />

      <section className="mt-10 rounded-[20px] border border-[var(--afd-blue)]/15 bg-white p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-[#062653] sm:text-xl">
          Vue d’ensemble des secteurs couverts
        </h2>
        <p className="mt-2 max-w-[65ch] text-[15px] leading-[1.7] text-[#5F6F83]">
          Les secteurs ci-dessous orientent la conception et le suivi des
          programmes. Les textes détaillés peuvent être complétés depuis le
          Studio de publication.
        </p>
        <ul className="mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {allTopics.map((topic) => (
            <li key={topic} className="mb-2 text-sm text-[var(--afd-text)]">
              {topic}
            </li>
          ))}
        </ul>
        <Link
          href="/actions/programmes"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--afd-blue)]"
        >
          Voir les programmes associés
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </PublicPageShell>
  );
}
