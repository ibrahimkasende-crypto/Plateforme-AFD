import Link from "next/link";
import { AdminEmptyCreate } from "@/components/admin/module/admin-empty-create";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import {
  saveTemoignageConsentementAction,
  withdrawTemoignageConsentementAction,
} from "@/features/temoignages/actions/manage-consentement";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminTemoignages } from "@/lib/queries/admin/temoignages";
import { createClientSafe } from "@/lib/supabase/safe";

export default async function AdminTemoignagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("histoires:read");
  const { q } = await searchParams;
  const items = await getAdminTemoignages({ q });
  const supabase = await createClientSafe();
  const { data: consentsRaw } = supabase
    ? await supabase
        .from("temoignage_consentements" as never)
        .select("id, titre, province, consentement_accorde, anonymise, retire_at")
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };
  const consents = (consentsRaw ?? []) as Array<{
    id: string;
    titre: string;
    province: string | null;
    consentement_accorde: boolean;
    anonymise: boolean;
    retire_at: string | null;
  }>;

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Témoignages"
        description="Témoignages publiés ou en cours de révision."
        createHref="/admin/publications/temoignages/nouveau"
        createLabel="Nouveau témoignage"
      />
      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Rechercher" className="rounded border p-2" />
        <button className="rounded border px-4 py-2">Filtrer</button>
      </form>
      {items.length === 0 ? (
        <AdminEmptyCreate
          title="Aucun témoignage"
          description="Collectez et publiez des témoignages avec consentement."
          createHref="/admin/publications/temoignages/nouveau"
          createLabel="Nouveau témoignage"
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Nom</th>
                <th>Citation</th>
                <th>Publié</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.display_name}</td>
                  <td className="max-w-md truncate">{item.quote}</td>
                  <td>{item.publie ? "Oui" : "Non"}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/publications/temoignages/${item.id}/modifier`}
                      className="text-[var(--afd-blue)]"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="space-y-3 rounded border bg-white p-4">
        <h2 className="font-semibold">Registre des consentements</h2>
        <form action={saveTemoignageConsentementAction} className="grid gap-3 sm:grid-cols-3">
          <input name="titre" required placeholder="Titre / référence" className="rounded border p-2 text-sm" />
          <input name="province" placeholder="Province" className="rounded border p-2 text-sm" />
          <label className="inline-flex items-center gap-2 text-sm">
            <input name="consentement_accorde" type="checkbox" defaultChecked />
            Consentement accordé
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input name="anonymise" type="checkbox" />
            Anonymiser
          </label>
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Enregistrer
          </button>
        </form>
        <ul className="space-y-2 text-sm">
          {consents.map((c) => (
            <li key={c.id} className="flex items-center justify-between border-t pt-2">
              <span>
                {c.titre}
                {c.province ? ` · ${c.province}` : ""} ·{" "}
                {c.consentement_accorde ? "Accordé" : "Retiré"}
                {c.anonymise ? " · Anonyme" : ""}
              </span>
              {c.consentement_accorde && !c.retire_at ? (
                <form action={withdrawTemoignageConsentementAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="text-red-700">
                    Retirer le consentement
                  </button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
