import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { DocumentCard } from "@/components/public/documents/document-card";
import { DocumentFilters } from "@/components/public/documents/document-filters";
import { getPublishedDocuments } from "@/lib/queries/public/documents";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Documents institutionnels et ressources téléchargeables de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/documents` },
};

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ type?: string; q?: string }> }) {
  const { type, q } = await searchParams;
  const documents = await getPublishedDocuments({ type, q });

  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Documents"
      description="Documents institutionnels publiés par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Documents" },
      ]}
    >
      <DocumentFilters type={type} q={q} />
      {documents.length === 0 ? (
        <EmptyState
          title="Aucun document publié"
          description="Les documents institutionnels seront disponibles ici dès leur publication. Contactez-nous pour toute demande documentaire."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Nous contacter
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">{documents.map((document) => <li key={document.id}><DocumentCard document={document} /></li>)}</ul>
      )}
    </PublicPageShell>
  );
}
