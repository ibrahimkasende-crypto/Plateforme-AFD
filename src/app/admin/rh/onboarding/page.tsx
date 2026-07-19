import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { EmptyState } from "@/components/shared/EmptyState";
import { createOnboardingTacheAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type Tache = {
  id: string;
  titre: string;
  statut: string;
  date_limite: string | null;
  employe_id: string;
};

export default async function AdminRhOnboardingPage() {
  await requirePermission("hr.manage_employees");
  const supabase = await createClientSafe();

  let items: Tache[] = [];
  let employes: Array<{ id: string; nom_affichage: string | null }> = [];

  if (supabase) {
    const [{ data: taches }, { data: emps }] = await Promise.all([
      supabase
        .from("hr_onboarding_taches" as never)
        .select("id, titre, statut, date_limite, employe_id")
        .order("date_limite", { ascending: true }),
      supabase
        .from("hr_employes" as never)
        .select("id, nom_affichage")
        .is("archived_at", null)
        .in("statut", ["actif", "essai"])
        .order("nom_affichage"),
    ]);
    items = (taches ?? []) as Tache[];
    employes = (emps ?? []) as Array<{ id: string; nom_affichage: string | null }>;
  }

  const employeMap = new Map(employes.map((e) => [e.id, e.nom_affichage ?? "—"]));

  return (
    <main className="space-y-6 p-6">
      <AdminPageHeader
        title="Onboarding"
        description="Checklist d'intégration des nouveaux employés."
      />

      <form action={createOnboardingTacheAction} className="grid gap-3 rounded border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <select required name="employe_id" className={fieldClass} defaultValue="">
          <option value="">Employé *</option>
          {employes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_affichage}
            </option>
          ))}
        </select>
        <input required name="titre" placeholder="Titre de la tâche *" className={fieldClass} />
        <input type="date" name="date_limite" className={fieldClass} />
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-sm text-white">
          Ajouter
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Aucune tâche d'onboarding" description="Créez des tâches pour les nouveaux arrivants." />
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Employé</th>
                <th>Tâche</th>
                <th>Échéance</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-t" key={item.id}>
                  <td className="p-3">{employeMap.get(item.employe_id) ?? "—"}</td>
                  <td>{item.titre}</td>
                  <td>{item.date_limite ?? "—"}</td>
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
