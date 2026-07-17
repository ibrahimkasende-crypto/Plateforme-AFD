import type { Metadata } from "next";
import Link from "next/link";
import { PublicEntityCard } from "@/components/public/PublicEntityCard";
import {
  PublicPagination,
  PublicSearchForm,
} from "@/components/public/PublicPagination";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import {
  getProjectStatusOptions,
  getPublishedProjects,
} from "@/lib/queries/public/projets";
import { parsePage, parseQuery } from "@/lib/queries/public/client";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Découvrez les projets de l’Alliance des Femmes pour le Développement en République démocratique du Congo.",
  alternates: { canonical: `${siteConfig.url}/actions/projets` },
};

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function ProjetsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = parseQuery(params.q);
  const status = parseQuery(params.status);
  const page = parsePage(params.page);

  const [result, statusOptions] = await Promise.all([
    getPublishedProjects({ q, status, page }),
    getProjectStatusOptions(),
  ]);

  return (
    <PublicPageShell
      eyebrow="Actions"
      title="Nos projets"
      description="Projets publiés sur le terrain : localisation, statut et bénéficiaires lorsque disponibles."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Actions", href: "/actions" },
        { label: "Projets" },
      ]}
    >
      <PublicSearchForm
        action="/actions/projets"
        defaultQuery={q}
        placeholder="Rechercher un projet…"
        extraFields={
          statusOptions.length > 0 ? (
            <label className="flex min-w-[160px] flex-col gap-1 text-xs font-medium text-[var(--afd-muted)]">
              Statut
              <select
                name="status"
                defaultValue={status}
                className="rounded-lg border border-[var(--afd-border)] px-3 py-2 text-sm text-[var(--afd-ink)]"
              >
                <option value="">Tous les statuts</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null
        }
      />

      {result.items.length === 0 ? (
        <EmptyState
          title="Aucun projet publié"
          description={
            q || status
              ? "Aucun résultat ne correspond à vos filtres."
              : "Les projets actifs apparaîtront ici dès leur publication."
          }
          action={
            <Link
              href="/actions/programmes"
              className="inline-flex min-h-10 items-center rounded-lg bg-[var(--afd-blue)] px-4 text-sm font-semibold text-white"
            >
              Voir les programmes
            </Link>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-[var(--afd-muted)]">
            {result.total} projet{result.total > 1 ? "s" : ""} trouvé
            {result.total > 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((project) => {
              const metaParts = [
                project.location,
                project.status,
                project.programmeTitle,
              ].filter(Boolean);

              return (
                <PublicEntityCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  href={`/actions/projets/${project.slug}`}
                  imageUrl={project.image_url}
                  meta={metaParts.join(" · ")}
                />
              );
            })}
          </div>
          <PublicPagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/actions/projets"
            searchParams={{
              q: q || undefined,
              status: status || undefined,
            }}
          />
        </>
      )}
    </PublicPageShell>
  );
}
