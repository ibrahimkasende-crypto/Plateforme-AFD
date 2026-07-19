import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { listEmployees } from "@/features/hr/services/employees.service";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type EmployeeRow = {
  id: string;
  matricule: string | null;
  nom_affichage: string | null;
  email: string | null;
  telephone: string | null;
  statut: string;
  date_embauche: string | null;
  province: string | null;
};

export default async function AdminRhPersonnelPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  await requirePermission("hr.view");
  const { q } = (await searchParams) ?? {};
  const supabase = await createClientSafe();
  const items = supabase
    ? ((await listEmployees(supabase, q)) as EmployeeRow[])
    : [];

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Personnel"
        description="Liste des employés actifs et archivés."
        createHref="/admin/rh/personnel/nouveau"
        createLabel="Nouvel employé"
      />

      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom, matricule ou e-mail"
          className="rounded border p-2 text-sm"
        />
        <button type="submit" className="rounded border px-4 py-2 text-sm">
          Filtrer
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          title="Aucun employé"
          description="Commencez par créer un dossier employé."
          action={
            <Link
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
              href="/admin/rh/personnel/nouveau"
            >
              Nouvel employé
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Matricule</th>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Statut</th>
                <th>Embauche</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{item.matricule ?? "—"}</td>
                  <td>{item.nom_affichage ?? "—"}</td>
                  <td>{item.email ?? "—"}</td>
                  <td>{item.statut}</td>
                  <td>{item.date_embauche ?? "—"}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link className="text-[var(--afd-blue)]" href={`/admin/rh/personnel/${item.id}`}>
                      Voir
                    </Link>
                    <Link
                      className="text-[var(--afd-muted)]"
                      href={`/admin/rh/personnel/${item.id}/modifier`}
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
    </main>
  );
}
