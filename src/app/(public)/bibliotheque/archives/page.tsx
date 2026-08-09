import type { Metadata } from "next";
import Link from "next/link";
import { LibraryActivityCard } from "@/components/public/bibliotheque/library-activity-card";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  getArchiveTimeline,
  getLibraryCategories,
  listLibraryProvinces,
  searchLibraryActivities,
} from "@/lib/queries/public/bibliotheque";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Archives historiques",
  description:
    "Consultez les activités archivées de l’AFD — documentation multi-années pour bailleurs et partenaires.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque/archives` },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    categorie?: string;
    annee?: string;
    mois?: string;
    province?: string;
    territoire?: string;
    projet?: string;
    partenaire?: string;
    type?: string;
    statut?: string;
  }>;
};

export default async function BibliothequeArchivesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const statusFilter =
    params.statut === "archivee" || params.statut === "terminee"
      ? params.statut
      : undefined;

  const [archived, terminated, timeline, categories, provinces] =
    await Promise.all([
      searchLibraryActivities({
        q: params.q,
        category: params.categorie,
        province: params.province,
        year: params.annee,
        partner: params.partenaire,
        status: "archivee",
      }),
      searchLibraryActivities({
        q: params.q,
        category: params.categorie,
        province: params.province,
        year: params.annee,
        partner: params.partenaire,
        status: "terminee",
      }),
      getArchiveTimeline(),
      getLibraryCategories({ withContentOnly: true }),
      listLibraryProvinces(),
    ]);

  let items =
    statusFilter === "archivee"
      ? archived
      : statusFilter === "terminee"
        ? terminated
        : [...archived, ...terminated];

  if (params.territoire) {
    const t = params.territoire.toLowerCase();
    items = items.filter((a) => (a.territory ?? "").toLowerCase().includes(t));
  }
  if (params.projet) {
    const p = params.projet.toLowerCase();
    items = items.filter((a) => (a.project ?? "").toLowerCase().includes(p));
  }
  if (params.mois && params.annee) {
    const prefix = `${params.annee}-${params.mois.padStart(2, "0")}`;
    items = items.filter((a) =>
      (a.eventDate ?? a.publishedAt ?? "").startsWith(prefix),
    );
  }

  return (
    <PublicPageShell
      eyebrow="Bibliothèque"
      title="Archives historiques"
      description="Les activités passées restent consultables. Aucune archive institutionnelle n’est effacée."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: "Archives" },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque/archives" />

        {timeline.length > 0 ? (
          <section aria-label="Chronologie" className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[var(--afd-ink)]">
              Chronologie
            </h2>
            <ol className="flex flex-wrap gap-2">
              {timeline.map((entry) => (
                <li key={entry.year}>
                  <Link
                    href={`/bibliotheque/archives?annee=${entry.year}`}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      params.annee === entry.year
                        ? "border-[var(--afd-blue)] bg-[var(--afd-blue)] text-white"
                        : "border-[var(--afd-border)] bg-white"
                    }`}
                  >
                    {entry.year} ({entry.activityCount})
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <form
          method="get"
          className="grid gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Recherche…"
            className="rounded-xl border border-[var(--afd-border)] px-3 py-2 text-sm"
          />
          <select
            name="categorie"
            defaultValue={params.categorie ?? ""}
            className="rounded-xl border border-[var(--afd-border)] px-3 py-2 text-sm"
          >
            <option value="">Tous les domaines</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            name="province"
            defaultValue={params.province ?? ""}
            className="rounded-xl border border-[var(--afd-border)] px-3 py-2 text-sm"
          >
            <option value="">Toutes les provinces</option>
            {provinces.map((p) => (
              <option key={p.slug} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            name="statut"
            defaultValue={params.statut ?? ""}
            className="rounded-xl border border-[var(--afd-border)] px-3 py-2 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="archivee">Archivées</option>
            <option value="terminee">Terminées</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white sm:col-span-2 lg:col-span-4 lg:w-fit"
          >
            Filtrer les archives
          </button>
        </form>

        {items.length === 0 ? (
          <EmptyState
            title="Aucune archive pour ces filtres"
            description="Les activités terminées et archivées apparaîtront ici."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((activity) => (
              <LibraryActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
