import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedDocuments } from "@/lib/queries/public/medias";

export const metadata: Metadata = {
  title: "Rapports",
  description:
    "Rapports et publications institutionnelles de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/rapports` },
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function RapportsPage() {
  const documents = await getPublishedDocuments();

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
          <ul className="mt-6 space-y-3">
            {documents.map((doc) => {
              const date = formatDate(doc.created_at);
              return (
                <li
                  key={doc.id}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--afd-border)] bg-white p-5"
                >
                  <FileText
                    className="mt-0.5 size-5 shrink-0 text-[var(--afd-accent)]"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[var(--afd-ink)]">
                      {doc.title}
                    </h3>
                    {doc.description ? (
                      <p className="mt-1 text-sm text-[var(--afd-muted)]">
                        {doc.description}
                      </p>
                    ) : null}
                    {date ? (
                      <p className="mt-1 text-xs text-[var(--afd-muted)]">
                        Publié le {date}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={doc.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-semibold text-[var(--afd-blue)] hover:underline"
                  >
                    Télécharger
                  </a>
                </li>
              );
            })}
          </ul>
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
