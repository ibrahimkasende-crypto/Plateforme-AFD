import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Recrutement = {
  id: string;
  titre: string;
  statut: string;
  date_limite: string | null;
  created_at: string;
};

export default async function AdminRhRecrutementPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.manage_recruitment");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: Recrutement[] = [];
  if (supabase) {
    let query = supabase
      .from("hr_recrutements" as never)
      .select("id, titre, statut, date_limite, created_at")
      .order("created_at", { ascending: false });
    if (q?.trim()) query = query.ilike("titre", `%${q.trim()}%`);
    const { data } = await query;
    items = (data ?? []) as Recrutement[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Recrutement"
        description="Offres d'emploi et campagnes de recrutement."
        createHref="/admin/rh/recrutement/nouveau"
        createLabel="Nouvelle offre"
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par titre" className="rounded border p-2 text-sm" />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucune offre"
          description="Publiez une première offre de recrutement."
          action={
            <Link href="/admin/rh/recrutement/nouveau" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
              Nouvelle offre
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Titre</th>
                <th>Statut</th>
                <th>Date limite</th>
                <th>Créée le</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.titre}</td>
                  <td>{item.statut}</td>
                  <td>{item.date_limite ?? "—"}</td>
                  <td>{item.created_at.slice(0, 10)}</td>
                  <td className="p-3 text-right">
                    <Link href="/admin/rh/candidatures" className="text-[var(--afd-blue)]">
                      Candidatures
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
