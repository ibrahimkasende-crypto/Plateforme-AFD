import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { siteConfig } from "@/config/site";
import { getTenderBySlug } from "@/lib/queries/public/appels-offres";

type PageProps = {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tender = await getTenderBySlug(slug);
  if (!tender) return { title: "Appel d’offres introuvable" };
  return {
    title: tender.seo_title || tender.titre,
    description: tender.seo_description || tender.resume || undefined,
    alternates: {
      canonical: `${siteConfig.url}/ressources/appels-offres/${tender.slug}`,
    },
    openGraph: {
      title: tender.seo_title || tender.titre,
      description: tender.seo_description || tender.resume || undefined,
      url: `${siteConfig.url}/ressources/appels-offres/${tender.slug}`,
    },
  };
}

export default async function AppelOffreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tender = await getTenderBySlug(slug);
  if (!tender) notFound();

  return (
    <PublicPageShell
      eyebrow="Appels d’offres"
      title={tender.titre}
      description={tender.resume ?? undefined}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Appels d’offres", href: "/ressources/appels-offres" },
        { label: tender.titre },
      ]}
    >
      <article className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-wrap gap-3 text-sm text-[var(--afd-muted)]">
          <span className="rounded-full bg-[var(--afd-surface)] px-3 py-1 font-medium text-[var(--afd-blue)]">
            {tender.statut === "ouvert" ? "Ouvert" : "Clôturé"}
          </span>
          {tender.localisation ? <span>{tender.localisation}</span> : null}
          {formatDate(tender.date_limite) ? (
            <span>Date limite : {formatDate(tender.date_limite)}</span>
          ) : null}
        </div>

        {tender.description ? (
          <div className="whitespace-pre-wrap text-base leading-relaxed text-[var(--afd-ink)]">
            {tender.description}
          </div>
        ) : null}

        {tender.procedure ? (
          <section className="rounded-2xl border border-[var(--afd-border)] p-5">
            <h2 className="mb-2 text-lg font-semibold">Procédure</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--afd-muted)]">
              {tender.procedure}
            </p>
          </section>
        ) : null}

        {tender.contact_email ? (
          <p className="text-sm text-[var(--afd-muted)]">
            Contact :{" "}
            <a
              href={`mailto:${tender.contact_email}`}
              className="font-semibold text-[var(--afd-blue)]"
            >
              {tender.contact_email}
            </a>
          </p>
        ) : null}

        {tender.documents.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Documents</h2>
            <ul className="space-y-2">
              {tender.documents.map((doc) => (
                <li key={doc.id}>
                  <span className="text-sm text-[var(--afd-ink)]">
                    {doc.titre}
                    {doc.filename ? ` (${doc.filename})` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--afd-muted)]">
              Les fichiers sont diffusés uniquement lorsqu’ils sont publiés dans
              Supabase Storage et associés à cet appel d’offres.
            </p>
          </section>
        ) : null}

        <Link
          href="/ressources/appels-offres"
          className="inline-flex text-sm font-semibold text-[var(--afd-blue)]"
        >
          ← Retour aux appels d’offres
        </Link>
      </article>
    </PublicPageShell>
  );
}
