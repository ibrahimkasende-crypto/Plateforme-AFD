import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { getPublishedDocuments } from "@/lib/queries/public/medias";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Documents institutionnels et ressources téléchargeables de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/documents` },
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

export default async function DocumentsPage() {
  const documents = await getPublishedDocuments();

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
        <ul className="space-y-3">
          {documents.map((doc) => {
            const date = formatDate(doc.created_at);
            return (
              <li
                key={doc.id}
                className="flex items-start gap-4 rounded-2xl border border-[var(--afd-border)] bg-[var(--afd-surface)] p-5"
              >
                <FileText
                  className="mt-0.5 size-5 shrink-0 text-[var(--afd-accent)]"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-[var(--afd-ink)]">{doc.title}</h2>
                  {doc.description ? (
                    <p className="mt-1 text-sm text-[var(--afd-muted)]">{doc.description}</p>
                  ) : null}
                  {date ? (
                    <p className="mt-1 text-xs text-[var(--afd-muted)]">Publié le {date}</p>
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
      )}
    </PublicPageShell>
  );
}
