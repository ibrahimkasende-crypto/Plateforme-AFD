import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminPartners } from "@/lib/queries/partenaires";
import {
  archivePartner,
  togglePartnerPublish,
} from "@/features/partenaires/actions/manage-partner";

export default async function AdminPartenairesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("partenaires:read");
  const { q } = await searchParams;
  const items = await getAdminPartners({ q });

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Partenaires</h1>
          <p className="text-sm text-[var(--afd-muted)]">
            Gestion des organisations partenaires publiées sur le site.
          </p>
        </div>
        <Link
          className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
          href="/admin/partenaires/nouveau"
        >
          Nouveau partenaire
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher"
          className="rounded border p-2"
        />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>

      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-3">Ordre</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="border-t" key={item.id}>
                <td className="p-3">{item.order ?? 0}</td>
                <td>
                  <div className="flex items-center gap-3">
                    {item.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logo_url}
                        alt=""
                        className="h-8 w-12 object-contain"
                      />
                    ) : (
                      <span className="inline-flex h-8 w-12 items-center justify-center bg-black/5 text-[10px]">
                        N/A
                      </span>
                    )}
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.category ?? "—"}</td>
                <td>
                  {item.deleted_at
                    ? "Archivé"
                    : item.publie
                      ? "Publié"
                      : item.active
                        ? "Actif"
                        : "Inactif"}
                </td>
                <td className="space-x-2 p-3 text-right">
                  <Link
                    className="text-[var(--afd-blue)]"
                    href={`/admin/partenaires/${item.id}`}
                  >
                    Voir
                  </Link>
                  <Link
                    className="text-[var(--afd-blue)]"
                    href={`/admin/partenaires/${item.id}/modifier`}
                  >
                    Modifier
                  </Link>
                  <form
                    action={togglePartnerPublish.bind(
                      null,
                      item.id,
                      Boolean(item.publie),
                    )}
                    className="inline"
                  >
                    <button type="submit" className="text-[var(--afd-blue)]">
                      {item.publie ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                  <form
                    action={archivePartner.bind(null, item.id)}
                    className="inline"
                  >
                    <button type="submit" className="text-red-700">
                      Archiver
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
