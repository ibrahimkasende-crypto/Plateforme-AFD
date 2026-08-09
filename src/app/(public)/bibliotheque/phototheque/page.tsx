import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LibraryMasonryGallery } from "@/components/public/bibliotheque/library-masonry-gallery";
import { LibrarySectionNav } from "@/components/public/bibliotheque/library-section-nav";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { siteConfig } from "@/config/site";
import {
  getLibraryCategories,
  listLibraryActivities,
  listLibraryPhotos,
} from "@/lib/queries/public/bibliotheque";

export const metadata: Metadata = {
  title: "Photothèque institutionnelle",
  description:
    "Toutes les photographies des activités de l’Alliance des Femmes pour le Développement.",
  alternates: { canonical: `${siteConfig.url}/bibliotheque/phototheque` },
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    categorie?: string;
    activite?: string;
    projet?: string;
    province?: string;
    annee?: string;
    partenaire?: string;
    tri?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 48;

export default async function PhotothequePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const [photos, categories, activities] = await Promise.all([
    listLibraryPhotos({
      q: params.q,
      category: params.categorie,
      activity: params.activite,
      project: params.projet,
      province: params.province,
      year: params.annee,
      partner: params.partenaire,
      sort: params.tri === "ancien" ? "oldest" : "recent",
    }),
    getLibraryCategories({ withContentOnly: true }),
    listLibraryActivities(),
  ]);

  const total = photos.length;
  const slice = photos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const galleryImages = slice.map((photo) => ({
    id: photo.id,
    src: photo.src,
    alt: photo.alt,
    title: photo.title,
    caption: photo.caption,
    isCover: photo.isCover,
    orderIndex: photo.orderIndex,
  }));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PublicPageShell
      eyebrow="Bibliothèque institutionnelle"
      title="Photothèque"
      description="Explorez l’ensemble des photographies documentant les activités de l’AFD."
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Bibliothèque", href: "/bibliotheque" },
        { label: "Photothèque" },
      ]}
    >
      <div className="space-y-8">
        <LibrarySectionNav current="/bibliotheque/phototheque" />

        <Suspense fallback={null}>
          <form
            className="grid gap-3 rounded-2xl border border-[var(--afd-border)] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
            method="get"
          >
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[var(--afd-ink)]">
                Recherche
              </span>
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Titre, légende…"
                className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[var(--afd-ink)]">
                Domaine
              </span>
              <select
                name="categorie"
                defaultValue={params.categorie ?? ""}
                className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
              >
                <option value="">Tous</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[var(--afd-ink)]">
                Activité
              </span>
              <select
                name="activite"
                defaultValue={params.activite ?? ""}
                className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
              >
                <option value="">Toutes</option>
                {activities.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-[var(--afd-ink)]">
                Tri
              </span>
              <select
                name="tri"
                defaultValue={params.tri ?? "recent"}
                className="w-full rounded-xl border border-[var(--afd-border)] px-3 py-2"
              >
                <option value="recent">Plus récent</option>
                <option value="ancien">Plus ancien</option>
              </select>
            </label>
            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="rounded-xl bg-[var(--afd-blue)] px-4 py-2 text-sm font-semibold text-white"
              >
                Filtrer ({total} photo{total > 1 ? "s" : ""})
              </button>
            </div>
          </form>
        </Suspense>

        {slice.length === 0 ? (
          <EmptyState
            title="Aucune photographie"
            description="Aucune image ne correspond à ces filtres."
          />
        ) : (
          <div className="space-y-6">
            <LibraryMasonryGallery
              images={galleryImages}
              activityTitle="Photothèque AFD"
            />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slice.map((photo) => (
                <li
                  key={`${photo.activitySlug}-${photo.id}`}
                  className="rounded-xl border border-[var(--afd-border)] bg-white p-3 text-sm"
                >
                  <div className="relative mb-2 aspect-video overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="font-semibold text-[var(--afd-ink)]">
                    {photo.caption || photo.title}
                  </p>
                  <p className="mt-1 text-[var(--afd-muted)]">
                    {photo.categoryLabel}
                    {photo.province ? ` · ${photo.province}` : ""}
                  </p>
                  <Link
                    href={`/bibliotheque/${photo.activitySlug}`}
                    className="mt-2 inline-block font-semibold text-[var(--afd-blue)] hover:underline"
                  >
                    Voir l’activité →
                  </Link>
                </li>
              ))}
            </ul>
            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={{
                        pathname: "/bibliotheque/phototheque",
                        query: { ...params, page: String(p) },
                      }}
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        p === page
                          ? "bg-[var(--afd-blue)] text-white"
                          : "border border-[var(--afd-border)] bg-white"
                      }`}
                    >
                      {p}
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
