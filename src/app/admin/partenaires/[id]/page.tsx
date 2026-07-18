import Link from "next/link";
import { notFound } from "next/navigation";
import {
  activatePartner,
  archivePartner,
  deactivatePartner,
  publishPartner,
  restorePartner,
  unpublishPartner,
} from "@/features/partenaires/actions/manage-partner";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPartnerById } from "@/lib/queries/partenaires";

export default async function AdminPartenaireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("partenaires:read");
  const { id } = await params;
  const partner = await getAdminPartnerById(id);
  if (!partner) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--afd-muted)]">Prévisualisation</p>
          <h1 className="text-2xl font-bold">{partner.name}</h1>
        </div>
        <Link
          href={`/admin/partenaires/${partner.id}/modifier`}
          className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
        >
          Modifier
        </Link>
      </div>

      <div className="rounded border bg-white p-6">
        {partner.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logo_url}
            alt={`Logo ${partner.name}`}
            className="mx-auto max-h-40 w-auto object-contain"
          />
        ) : (
          <p className="text-center text-sm text-[var(--afd-muted)]">
            Aucun logo — placeholder typographique : {partner.name}
          </p>
        )}
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--afd-muted)]">Acronyme</dt>
            <dd>{partner.acronyme ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Slug</dt>
            <dd>{partner.slug ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Catégorie</dt>
            <dd>{partner.category ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Ordre</dt>
            <dd>{partner.order ?? 0}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Site web</dt>
            <dd>{partner.website_url ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[var(--afd-muted)]">Statut</dt>
            <dd>
              {partner.deleted_at
                ? "Archivé"
                : `actif=${String(partner.active)} / publié=${String(partner.publie)}`}
            </dd>
          </div>
        </dl>
        {partner.description ? (
          <p className="mt-4 text-sm">{partner.description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <form action={publishPartner.bind(null, partner.id)}>
          <button className="rounded border px-3 py-2 text-sm">Publier</button>
        </form>
        <form action={unpublishPartner.bind(null, partner.id)}>
          <button className="rounded border px-3 py-2 text-sm">Dépublier</button>
        </form>
        <form action={activatePartner.bind(null, partner.id)}>
          <button className="rounded border px-3 py-2 text-sm">Activer</button>
        </form>
        <form action={deactivatePartner.bind(null, partner.id)}>
          <button className="rounded border px-3 py-2 text-sm">Désactiver</button>
        </form>
        {partner.deleted_at ? (
          <form action={restorePartner.bind(null, partner.id)}>
            <button className="rounded border px-3 py-2 text-sm">Restaurer</button>
          </form>
        ) : (
          <form action={archivePartner.bind(null, partner.id)}>
            <button className="rounded border border-red-300 px-3 py-2 text-sm text-red-700">
              Archiver
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
