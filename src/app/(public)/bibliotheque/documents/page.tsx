import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedDocuments } from "@/lib/queries/public/documents";

export const metadata: Metadata = {
  title: "Documents institutionnels",
  description:
    "Publications, politiques, manuels et documents publics de l’AFD.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque/documents` },
};

export default async function BibliothequeDocumentsPage() {
  const docs = await getPublishedDocuments();

  return (
    <PublicPageShell
      eyebrow="Bibliothèque institutionnelle"
      title="Documents"
      description="Documents publics uniquement — les fichiers confidentiels ne sont jamais exposés."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: "Documents" },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque/documents" />

        {docs.length === 0 ? (
          <EmptyState
            title="Aucun document public"
            description="Les documents publiés avec le niveau de confidentialité public apparaîtront ici."
            action={
              <Link
                href="/ressources/documents"
                className="text-[var(--afd-blue)] underline"
              >
                Centre documentaire
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-[var(--afd-border)] overflow-hidden rounded-2xl border border-[var(--afd-border)] bg-white">
            {docs.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                    {doc.type ?? "Document"}
                    {doc.taille_octets
                      ? ` · ${Math.round(doc.taille_octets / 1024)} Ko`
                      : ""}
                  </p>
                  <h2 className="mt-1 font-semibold text-[var(--afd-ink)]">
                    {doc.titre}
                  </h2>
                  {doc.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--afd-muted)]">
                      {doc.description}
                    </p>
                  ) : null}
                </div>
                {doc.slug ? (
                  <Link
                    href={`/ressources/documents/${doc.slug}`}
                    className="shrink-0 rounded-lg border border-[var(--afd-border)] px-3 py-1.5 text-sm font-semibold hover:border-[var(--afd-blue)]"
                  >
                    Consulter
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PublicPageShell>
  );
}
