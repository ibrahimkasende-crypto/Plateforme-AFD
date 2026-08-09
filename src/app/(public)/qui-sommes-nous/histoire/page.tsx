import type { Metadata } from "next";
import { CmsSections } from "@/components/public/CmsSections";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { institutionalContent } from "@/config/institutional-content";
import { siteConfig } from "@/config/site";
import { getPublishedPageByRoute } from "@/lib/queries/public/pages";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedPageByRoute("/qui-sommes-nous/histoire");
  return {
    title: cms?.titre || "Notre histoire",
    description:
      cms?.description_seo ||
      "Histoire de l’Alliance des Femmes pour le Développement depuis le 24 janvier 2020.",
    alternates: { canonical: `${siteConfig.url}/qui-sommes-nous/histoire` },
  };
}

export default async function HistoireInstitutionnellePage() {
  const cms = await getPublishedPageByRoute("/qui-sommes-nous/histoire");

  if (cms) {
    return (
      <PublicPageShell
        eyebrow={cms.surtitre || "Qui sommes-nous"}
        title={cms.titre}
        description={cms.resume || undefined}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
          { label: cms.titre },
        ]}
      >
        <CmsSections sections={cms.sections} />
      </PublicPageShell>
    );
  }

  const { timeline } = institutionalContent;

  return (
    <PublicPageShell
      eyebrow="Qui sommes-nous"
      title="Notre histoire"
      description="Repères institutionnels de l’AFD. Ce contenu de référence peut être remplacé depuis le studio de publication."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Notre histoire" },
      ]}
    >
      <ol className="space-y-6">
        {timeline.map((item) => (
          <li
            key={`${item.year}-${item.title}`}
            className="rounded-2xl border border-[var(--afd-border)] bg-white p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-blue)]">
              {item.year}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--afd-ink)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--afd-muted)]">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </PublicPageShell>
  );
}
