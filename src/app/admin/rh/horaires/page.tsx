import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

type ContratHoraire = {
  id: string;
  horaire: string | null;
  type_contrat: string;
  statut: string;
  employe_id: string;
};

export default async function AdminRhHorairesPage() {
  await requirePermission("hr.manage_attendance");
  const supabase = await createClientSafe();

  let items: ContratHoraire[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: contrats }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_contrats" as never)
        .select("id, horaire, type_contrat, statut, employe_id")
        .eq("statut", "actif")
        .order("created_at", { ascending: false }),
      supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage")
        .is("archived_at", null),
    ]);
    items = (contrats ?? []) as ContratHoraire[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Horaires"
        description="Horaires de travail définis dans les contrats actifs."
        actions={
          <Link href="/admin/rh/contrats" className="rounded border px-4 py-2 text-sm">
            Gérer les contrats
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="Aucun horaire"
          description="Les horaires sont renseignés lors de la création d'un contrat."
          action={
            <Link href="/admin/rh/contrats" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
              Créer un contrat
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Type contrat</th>
                <th>Horaire</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.type_contrat}</td>
                  <td>{item.horaire ?? "Non renseigné"}</td>
                  <td>{item.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
