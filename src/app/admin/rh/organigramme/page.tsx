import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type Departement = {
  id: string;
  nom: string;
  parent_id: string | null;
  responsable_employe_id: string | null;
};

type EmployeRef = { id: string; nom_affichage: string | null };

export default async function AdminRhOrganigrammePage() {
  await requirePermission("hr.view");
  const supabase = await createClientSafe();

  let departements: Departement[] = [];
  let employes: EmployeRef[] = [];

  if (supabase) {
    const [{ data: depts }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_departements" as never)
        .select("id, nom, parent_id, responsable_employe_id")
        .eq("actif", true)
        .order("nom"),
      supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage")
        .is("archived_at", null)
        .in("statut", ["actif", "essai"]),
    ]);
    departements = (depts ?? []) as Departement[];
    employes = (emps ?? []) as EmployeRef[];
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));
  const roots = departements.filter((d) => !d.parent_id);
  const childrenOf = (parentId: string) =>
    departements.filter((d) => d.parent_id === parentId);

  function renderNode(dept: Departement, depth = 0): ReactNode {
    const responsable = dept.responsable_employe_id
      ? employeMap.get(dept.responsable_employe_id)
      : null;
    const children = childrenOf(dept.id);

    return (
      <li key={dept.id} className="mt-2">
        <div
          className="rounded border bg-white p-3"
          style={{ marginLeft: depth * 24 }}
        >
          <p className="font-medium">{dept.nom}</p>
          {responsable ? (
            <p className="text-sm text-[var(--afd-muted)]">Responsable : {responsable}</p>
          ) : null}
        </div>
        {children.length > 0 ? (
          <ul>{children.map((child) => renderNode(child, depth + 1))}</ul>
        ) : null}
      </li>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Organigramme"
        description="Hiérarchie des départements et responsables."
        actions={
          <Link href="/admin/rh/departements" className="rounded border px-4 py-2 text-sm">
            Gérer les départements
          </Link>
        }
      />

      {departements.length === 0 ? (
        <EmptyState
          title="Organigramme vide"
          description="Ajoutez des départements pour visualiser la structure."
          action={
            <Link
              href="/admin/rh/departements"
              className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white"
            >
              Créer un département
            </Link>
          }
        />
      ) : (
        <ul className="space-y-1">
          {roots.map((root) => renderNode(root))}
          {departements.filter((d) => d.parent_id && !departements.some((p) => p.id === d.parent_id)).map(
            (orphan) => renderNode(orphan),
          )}
        </ul>
      )}
    </main>
  );
}
