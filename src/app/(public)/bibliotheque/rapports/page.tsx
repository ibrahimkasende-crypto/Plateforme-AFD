import type { Metadata } from "next";
import Link from "next/link";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedDocuments } from "@/lib/queries/public/documents";

export const metadata: Metadata = {
  title: "Rapports institutionnels",
  description:
    "Rapports d’activité, rapports de projet et publications officielles de l’AFD.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque/rapports` },
};

export default async function BibliothequeRapportsPage() {
  const docs = await getPublishedDocuments();
  const reports = docs.filter(
    (d) =>
      (d.type ?? "").toLowerCase().includes("rapport") ||
      (d.slug ?? "").toLowerCase().includes("rapport"),
  );

  return (
    <PublicPageShell
      eyebrow="Bibliothèque institutionnelle"
      title="Rapports"
      description="Consultez et téléchargez les rapports publics de l’Alliance des Femmes pour le Développement."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: "Rapports" },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque/rapports" />

        {reports.length === 0 ? (
          <EmptyState
            title="Aucun rapport public"
            description="Les rapports publiés depuis le centre documentaire apparaîtront ici. Vous pouvez aussi consulter la médiathèque documents."
            action={
              <Link
                href="/ressources/documents"
                className="text-[var(--afd-blue)] underline"
              >
                Voir les documents
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col rounded-2xl border border-[var(--afd-border)] bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-muted)]">
                  {doc.type ?? "Rapport"}
                  {doc.date_publication
                    ? ` · ${new Date(doc.date_publication).getFullYear()}`
                    : ""}
                </p>
                <h2 className="mt-2 font-display text-lg font-bold text-[var(--afd-ink)]">
                  {doc.titre}
                </h2>
                {doc.description ? (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--afd-muted)]">
                    {doc.description}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {doc.slug ? (
                    <Link
                      href={`/ressources/documents/${doc.slug}`}
                      className="rounded-lg bg-[var(--afd-blue)] px-3 py-1.5 text-sm font-semibold text-white"
                    >
                      Consulter
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PublicPageShell>
  );
}
