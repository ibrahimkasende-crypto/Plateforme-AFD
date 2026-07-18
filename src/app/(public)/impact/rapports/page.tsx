import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { DocumentCard } from "@/components/public/documents/document-card";
import { getPublishedDocuments } from "@/lib/queries/public/documents";

export const metadata: Metadata = {
  title: "Rapports",
  description:
    "Rapports et publications institutionnelles de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/rapports` },
};

export default async function RapportsPage() {
  const documents = await getPublishedDocuments({ type: "rapport" });

  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Rapports et publications"
      description="Documents institutionnels et rapports publiés par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Rapports" },
      ]}
    >
      {documents.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-[var(--afd-ink)]">
            Documents disponibles
          </h2>
          <ul className="mt-6 space-y-3">{documents.map((document) => <li key={document.id}><DocumentCard document={document} /></li>)}</ul>
        </section>
      ) : (
        <EmptyState
          title="Aucun rapport publié"
          description="Les rapports institutionnels seront disponibles ici dès leur publication. Contactez-nous pour toute demande documentaire."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Nous contacter
            </Link>
          }
        />
      )}
    </PublicPageShell>
  );
}
