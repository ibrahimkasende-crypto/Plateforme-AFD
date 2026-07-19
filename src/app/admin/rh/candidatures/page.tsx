import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createCandidatureAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Candidature = {
  id: string;
  nom: string;
  email: string | null;
  statut: string;
  created_at: string;
  recrutement_id: string;
};

export default async function AdminRhCandidaturesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.manage_recruitment");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: Candidature[] = [];
  let recrutements: Array<{ id: string; titre: string }> = [];

  if (supabase) {
    let query = supabase
      .from("hr_candidatures_rh" as never)
      .select("id, nom, email, statut, created_at, recrutement_id")
      .order("created_at", { ascending: false });
    if (q?.trim()) query = query.ilike("nom", `%${q.trim()}%`);
    const [{ data: candidatures }, { data: recs }] = await Promise.all([
      query,
      supabase.from("hr_recrutements" as never).select("id, titre").order("titre"),
    ]);
    items = (candidatures ?? []) as Candidature[];
    recrutements = (recs ?? []) as Array<{ id: string; titre: string }>;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Candidatures RH"
        description="Suivi des candidats pour les offres internes."
        createHref="/admin/rh/recrutement/nouveau"
        createLabel="Nouvelle offre"
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par nom" className={fieldClass} />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {recrutements.length > 0 ? (
        <form action={createCandidatureAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
          <select required name="recrutement_id" className={fieldClass} defaultValue="">
            <option value="">Offre *</option>
            {recrutements.map((r) => (
              <option key={r.id} value={r.id}>
                {r.titre}
              </option>
            ))}
          </select>
          <input required name="nom" placeholder="Nom *" className={fieldClass} />
          <input type="email" name="email" placeholder="E-mail" className={fieldClass} />
          <input name="telephone" placeholder="Téléphone" className={fieldClass} />
          <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
            Ajouter
          </button>
        </form>
      ) : null}

      {items.length === 0 ? (
        <EmptyState title="Aucune candidature" description="Les candidatures apparaîtront ici." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Nom</th>
                <th>E-mail</th>
                <th>Statut</th>
                <th>Reçue le</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.nom}</td>
                  <td>{item.email ?? "—"}</td>
                  <td>{item.statut}</td>
                  <td>{item.created_at.slice(0, 10)}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/rh/candidatures/${item.id}`} className="text-[var(--afd-blue)]">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
