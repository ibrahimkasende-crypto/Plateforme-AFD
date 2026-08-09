import Image from "next/image";
import Link from "next/link";
import { Archive, CalendarDays, MapPin } from "lucide-react";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { softDeleteEventArchive } from "@/features/event-archives/actions/manage-event-archive";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminEventArchives } from "@/lib/queries/admin/event-archives";
import { getPublishedInterventionDomains } from "@/lib/queries/public/intervention-domains";

function cover(item: Awaited<ReturnType<typeof getAdminEventArchives>>[number]) {
  const src =
    item.cover_image_url ??
    item.bibliotheque_images?.find((image) => image.is_cover)?.local_asset_path ??
    item.bibliotheque_images?.[0]?.local_asset_path ??
    item.bibliotheque_images?.[0]?.public_url ??
    null;
  return src?.startsWith("/assets/") ? encodeURI(src) : src;
}

export default async function AdminArchivesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; domain?: string }>;
}) {
  await requirePermission("archives:read");
  const { q, status, domain } = await searchParams;
  const [items, domains] = await Promise.all([
    getAdminEventArchives({ q, status, domain }),
    getPublishedInterventionDomains(),
  ]);
  const domainBySlug = new Map(domains.map((item) => [item.slug, item.title]));

  return (
    <PublicationModuleShell
      title="Archives terrain"
      description="Bibliothèque numérique des événements, images, lieux et preuves classés par domaine d’intervention."
      createHref="/admin/publications/archives/nouvelle"
      createLabel="Nouvelle archive"
    >
      <form className="grid gap-3 rounded-2xl border border-[var(--admin-border)] bg-white p-4 sm:grid-cols-[1fr_180px_220px_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher une archive"
          className="min-h-10 rounded-lg border border-[var(--admin-border)] px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="min-h-10 rounded-lg border border-[var(--admin-border)] px-3 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="en_revision">En révision</option>
          <option value="publie">Publié</option>
          <option value="archive">Archivé</option>
        </select>
        <select
          name="domain"
          defaultValue={domain ?? ""}
          className="min-h-10 rounded-lg border border-[var(--admin-border)] px-3 text-sm"
        >
          <option value="">Tous les domaines</option>
          {domains.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="min-h-10 rounded-lg border border-[var(--admin-border)] px-4 text-sm font-semibold"
        >
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--admin-border)] bg-white p-8 text-sm leading-relaxed text-[var(--admin-muted)]">
          Aucune archive en base pour le moment. Appliquez la migration Supabase,
          puis ajoutez les preuves terrain depuis ce module.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((item) => {
            const src = cover(item);
            return (
              <article
                key={item.id}
                className="grid gap-4 rounded-2xl border border-[var(--admin-border)] bg-white p-4 sm:grid-cols-[180px_1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--afd-light-blue)] sm:aspect-auto sm:min-h-[150px]">
                  {src ? (
                    <Image
                      src={src}
                      alt={item.titre}
                      fill
                      sizes="(max-width:768px) 92vw, 180px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[var(--admin-muted)]">
                      Image
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[var(--admin-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Archive className="size-3.5" aria-hidden />
                      {domainBySlug.get(item.domaine_slug) ?? item.domaine_slug}
                    </span>
                    {item.date_evenement ? (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden />
                        {item.date_evenement}
                      </span>
                    ) : null}
                    {item.lieu_nom ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" aria-hidden />
                        {item.lieu_nom}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-[var(--admin-text)]">
                    {item.titre}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-muted)]">
                    {item.resume ?? "Sans résumé"}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-[var(--admin-text)]">
                      {item.publie ? "Publié" : item.statut}
                    </span>
                    <span className="text-[var(--admin-muted)]">
                      {item.bibliotheque_images?.length ?? 0} image(s)
                    </span>
                    <Link
                      href={`/admin/publications/archives/${item.id}/modifier`}
                      className="font-bold text-[var(--admin-primary)]"
                    >
                      Modifier
                    </Link>
                    <form action={softDeleteEventArchive}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="font-bold text-red-600">
                        Archiver
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PublicationModuleShell>
  );
}
