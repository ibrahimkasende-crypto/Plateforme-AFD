import Link from "next/link";
import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { CmsPageShell } from "@/components/public/CmsPageShell";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import {
  institutionalContent,
  type OrganigrammeNode,
} from "@/config/institutional-content";
import { siteConfig } from "@/config/site";
import { getPublishedPageByRoute } from "@/lib/queries/public/pages";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPublishedPageByRoute("/qui-sommes-nous/organigramme");
  return {
    title: cms?.titre || "Organigramme",
    description:
      cms?.description_seo ||
      "Structure organisationnelle de l’Alliance des Femmes pour le Développement.",
    alternates: {
      canonical: `${siteConfig.url}/qui-sommes-nous/organigramme`,
    },
  };
}

function OrganigrammeBranch({
  node,
  depth = 0,
}: {
  node: OrganigrammeNode;
  depth?: number;
}) {
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren) {
    return (
      <li className="rounded-lg border border-[var(--afd-border)] bg-[var(--afd-background)] px-4 py-3 text-sm font-medium text-[var(--afd-ink)]">
        {node.title}
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-xl border border-[var(--afd-border)]">
      <details className="group" open={depth < 2}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-[var(--afd-surface)] px-4 py-3 font-semibold text-[var(--afd-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span>{node.title}</span>
          <ChevronDown
            className="size-4 shrink-0 text-[var(--afd-muted)] transition group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <ul className="space-y-2 border-t border-[var(--afd-border)] p-4 pl-6">
          {node.children?.map((child) => (
            <OrganigrammeBranch key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export default async function OrganigrammePage() {
  const cms = await getPublishedPageByRoute("/qui-sommes-nous/organigramme");
  if (cms) {
    return (
      <CmsPageShell
        cms={cms}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
          { label: cms.titre },
        ]}
      />
    );
  }

  const { organigramme } = institutionalContent;

  return (
    <PublicPageShell
      title="Organigramme"
      eyebrow="Qui sommes-nous"
      description={organigramme.intro}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
        { label: "Organigramme" },
      ]}
    >
      <div className="hidden md:block">
        <ul className="space-y-3">
          {organigramme.hierarchy.map((node) => (
            <OrganigrammeBranch key={node.id} node={node} />
          ))}
        </ul>
      </div>

      <div className="md:hidden">
        <ul className="space-y-3">
          {organigramme.hierarchy.map((node) => (
            <OrganigrammeBranch key={node.id} node={node} depth={0} />
          ))}
        </ul>
      </div>

      <p className="mt-8 text-sm text-[var(--afd-muted)]">
        {institutionalContent.contactPlaceholder}
      </p>

      <Link
        href="/qui-sommes-nous/gouvernance"
        className="mt-6 inline-flex min-h-12 items-center rounded-lg border border-[var(--afd-border)] px-5 text-base font-semibold text-[var(--afd-ink)] transition hover:border-[var(--afd-blue)]"
      >
        Retour à la gouvernance
      </Link>
    </PublicPageShell>
  );
}
