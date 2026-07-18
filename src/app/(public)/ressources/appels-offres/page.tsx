import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicPagination } from "@/components/public/PublicPagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import { parsePage, parseQuery } from "@/lib/queries/public/client";
import { getPublishedTenders } from "@/lib/queries/public/appels-offres";

export const metadata: Metadata = {
  title: "Appels d’offres",
  description:
    "Appels d’offres et consultations publiées par l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/ressources/appels-offres` },
  openGraph: {
    title: "Appels d’offres | AFD",
    description: "Consultations et appels d’offres de l’AFD.",
    url: `${siteConfig.url}/ressources/appels-offres`,
  },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function AppelsOffresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const statut = parseQuery(params.statut);
  const result = await getPublishedTenders({
    q,
    statut,
    page: parsePage(params.page),
  });

  return (
    <PublicPageShell
      eyebrow="Ressources"
      title="Appels d’offres"
      description="Consultations et appels d’offres de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Ressources", href: "/ressources" },
        { label: "Appels d’offres" },
      ]}
    >
      <form className="mb-8 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher un appel d’offres"
          className="afd-field min-w-0 w-full flex-1 sm:min-w-[12rem]"
        />
        <select name="statut" defaultValue={statut} className="afd-field">
          <option value="">Tous les statuts</option>
          <option value="ouvert">Ouvert</option>
          <option value="cloture">Clôturé</option>
        </select>
        <button
          type="submit"
          className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
        >
          Filtrer
        </button>
      </form>

      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun contenu n’est actuellement publié dans cette section"
          description="Les prochaines informations seront affichées après validation par l’AFD. Pour toute consultation, contactez l’équipe institutionnelle."
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
        <>
          <ul className="space-y-4">
            {result.items.map((tender) => (
              <li
                key={tender.id}
                className="rounded-2xl border border-[var(--afd-border)] bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--afd-blue)]">
                      {tender.statut === "ouvert" ? "Ouvert" : "Clôturé"}
                    </p>
                    <h2 className="text-xl font-semibold text-[var(--afd-ink)]">
                      <Link
                        href={`/ressources/appels-offres/${tender.slug}`}
                        className="hover:text-[var(--afd-blue)]"
                      >
                        {tender.titre}
                      </Link>
                    </h2>
                    {tender.resume ? (
                      <p className="max-w-3xl text-sm leading-relaxed text-[var(--afd-muted)]">
                        {tender.resume}
                      </p>
                    ) : null}
                    <p className="text-sm text-[var(--afd-muted)]">
                      {[
                        tender.localisation,
                        formatDate(tender.date_limite)
                          ? `Limite : ${formatDate(tender.date_limite)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <Link
                    href={`/ressources/appels-offres/${tender.slug}`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-[var(--afd-blue)] px-4 text-sm font-semibold text-[var(--afd-blue)]"
                  >
                    Voir le détail
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/ressources/appels-offres"
            searchParams={{ q, statut }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
