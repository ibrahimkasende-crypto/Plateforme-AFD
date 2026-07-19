import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createDepartementAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Departement = {
  id: string;
  code: string | null;
  nom: string;
  centre_cout: string | null;
  actif: boolean;
};

export default async function AdminRhDepartementsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.view");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();

  let items: Departement[] = [];
  if (supabase) {
    let query = supabase
      .from("hr_departements" as never)
      .select("id, code, nom, centre_cout, actif")
      .order("nom");
    if (q?.trim()) {
      query = query.ilike("nom", `%${q.trim()}%`);
    }
    const { data } = await query;
    items = (data ?? []) as Departement[];
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Départements"
        description="Structure organisationnelle et centres de coût."
        actions={
          <Link href="/admin/rh/postes" className="rounded border px-4 py-2 text-sm">
            Postes
          </Link>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par nom" className={fieldClass} />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      <form action={createDepartementAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-4">
        <input name="code" placeholder="Code" className={fieldClass} />
        <input required name="nom" placeholder="Nom du département *" className={fieldClass} />
        <input name="centre_cout" placeholder="Centre de coût" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Ajouter
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun département"
          description="Créez votre premier département ci-dessus."
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Nom</th>
                <th>Centre de coût</th>
                <th>Actif</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.code ?? "—"}</td>
                  <td>{item.nom}</td>
                  <td>{item.centre_cout ?? "—"}</td>
                  <td>{item.actif ? "Oui" : "Non"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
