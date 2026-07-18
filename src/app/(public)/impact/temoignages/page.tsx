import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicPagination } from "@/components/public/PublicPagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { parsePage } from "@/lib/queries/public/client";
import { getPublishedTestimonials } from "@/lib/queries/public/impact";

export const metadata: Metadata = {
  title: "Témoignages",
  description:
    "Témoignages des bénéficiaires et partenaires de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/impact/temoignages` },
  openGraph: {
    title: "Témoignages | AFD",
    description: "Voix des personnes et communautés accompagnées par l’AFD.",
    url: `${siteConfig.url}/impact/temoignages`,
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TemoignagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getPublishedTestimonials(parsePage(params.page));

  return (
    <PublicPageShell
      eyebrow="Impact"
      title="Témoignages"
      description="Voix des personnes et communautés accompagnées par l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Impact", href: "/impact" },
        { label: "Témoignages" },
      ]}
    >
      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun contenu n’est actuellement publié dans cette section"
          description="Les prochaines informations seront affichées après validation par l’AFD. Les témoignages ne sont publiés qu’avec consentement explicite."
          action={
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-border)] px-4 text-sm font-semibold text-[var(--afd-ink)]"
            >
              Proposer un témoignage
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {result.items.map((item) => (
              <figure
                key={item.id}
                className="rounded-2xl border border-[var(--afd-border)] bg-white p-5"
              >
                {item.image_url ? (
                  <div className="relative mb-4 h-14 w-14 overflow-hidden rounded-full bg-[var(--afd-surface)]">
                    <Image
                      src={item.image_url}
                      alt={
                        item.anonymized
                          ? "Portrait anonymisé"
                          : item.display_name
                      }
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                ) : null}
                <blockquote className="text-base leading-relaxed text-[var(--afd-ink)]">
                  « {item.quote} »
                </blockquote>
                <figcaption className="mt-4 text-sm text-[var(--afd-muted)]">
                  <span className="font-semibold text-[var(--afd-ink)]">
                    {item.anonymized
                      ? "Personne anonymisée"
                      : item.display_name}
                  </span>
                  {item.role_or_profile ? ` — ${item.role_or_profile}` : null}
                  {item.province ? ` · ${item.province}` : null}
                </figcaption>
              </figure>
            ))}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/impact/temoignages"
          />
        </>
      )}
    </PublicPageShell>
  );
}
