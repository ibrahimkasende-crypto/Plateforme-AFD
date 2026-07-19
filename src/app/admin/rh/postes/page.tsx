import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createPosteAction } from "@/features/hr/actions/manage-hr-modules";
import { hasPermission } from "@/lib/auth/has-permission";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Poste = {
  id: string;
  code: string | null;
  titre: string;
  niveau: string | null;
  categorie: string | null;
  salaire_indicatif: number | null;
  devise: string | null;
  actif: boolean;
};

export default async function AdminRhPostesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.view");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();
  const user = await getCurrentUser();
  const canViewSalary = user
    ? await hasPermission(user.id, "payroll.view_salary")
    : false;

  let items: Poste[] = [];
  let departements: Array<{ id: string; nom: string }> = [];
  if (supabase) {
    let query = supabase
      .from("hr_postes" as never)
      .select("id, code, titre, niveau, categorie, salaire_indicatif, devise, actif")
      .order("titre");
    if (q?.trim()) query = query.ilike("titre", `%${q.trim()}%`);
    const [{ data: postes }, { data: depts }] = await Promise.all([
      query,
      supabase.from("hr_departements" as never).select("id, nom").eq("actif", true).order("nom"),
    ]);
    items = (postes ?? []) as Poste[];
    departements = (depts ?? []) as Array<{ id: string; nom: string }>;
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Postes"
        description="Fiches de poste et catégories professionnelles."
        actions={
          <Link href="/admin/rh/departements" className="rounded border px-4 py-2 text-sm">
            Départements
          </Link>
        }
      />

      <form className="flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Filtrer par titre" className={fieldClass} />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      <form action={createPosteAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="code" placeholder="Code" className={fieldClass} />
        <input required name="titre" placeholder="Titre du poste *" className={fieldClass} />
        <select name="departement_id" className={fieldClass} defaultValue="">
          <option value="">Département</option>
          {departements.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nom}
            </option>
          ))}
        </select>
        <input name="niveau" placeholder="Niveau" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Ajouter
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucun poste" description="Créez un poste ci-dessus." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Code</th>
                <th>Titre</th>
                <th>Niveau</th>
                <th>Catégorie</th>
                {canViewSalary ? <th>Salaire indicatif</th> : null}
                <th>Actif</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.code ?? "—"}</td>
                  <td>{item.titre}</td>
                  <td>{item.niveau ?? "—"}</td>
                  <td>{item.categorie ?? "—"}</td>
                  {canViewSalary ? (
                    <td>
                      {item.salaire_indicatif != null
                        ? `${item.salaire_indicatif.toLocaleString("fr-FR")} ${item.devise ?? "USD"}`
                        : "—"}
                    </td>
                  ) : null}
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
