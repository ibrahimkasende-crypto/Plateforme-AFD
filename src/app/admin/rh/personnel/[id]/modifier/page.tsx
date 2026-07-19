import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { updateEmployeeAction } from "@/features/hr/actions/update-employee";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type RefRow = { id: string; nom?: string; titre?: string };

type Employee = {
  id: string;
  matricule: string | null;
  prenom: string;
  nom: string;
  postnom: string | null;
  email: string | null;
  telephone: string | null;
  statut: string;
  genre: string | null;
  date_embauche: string | null;
  type_contrat: string | null;
  province: string | null;
  departement_id: string | null;
  poste_id: string | null;
};

export default async function AdminRhPersonnelModifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("hr.manage_employees");
  const { id } = await params;
  const supabase = await createClientSafe();
  if (!supabase) notFound();

  const { data: employe } = await supabase
    .from("hr_employes" as never)
    .select(
      "id, matricule, prenom, nom, postnom, email, telephone, statut, genre, date_embauche, type_contrat, province, departement_id, poste_id",
    )
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (!employe) notFound();
  const employee = employe as Employee;

  const [{ data: departements }, { data: postes }] = await Promise.all([
    supabase.from("hr_departements" as never).select("id, nom").eq("actif", true).order("nom"),
    supabase.from("hr_postes" as never).select("id, titre").eq("actif", true).order("titre"),
  ]);

  const deptList = (departements ?? []) as RefRow[];
  const posteList = (postes ?? []) as RefRow[];

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Modifier l'employé"
        description={`${employee.prenom} ${employee.nom}`}
        actions={
          <Link href={`/admin/rh/personnel/${id}`} className="rounded border px-4 py-2 text-sm">
            Annuler
          </Link>
        }
      />

      <form action={updateEmployeeAction} className="space-y-4 rounded border bg-white p-4">
        <input type="hidden" name="id" value={employee.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Prénom *</span>
            <input required name="prenom" defaultValue={employee.prenom} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Nom *</span>
            <input required name="nom" defaultValue={employee.nom} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Postnom</span>
            <input name="postnom" defaultValue={employee.postnom ?? ""} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Matricule</span>
            <input name="matricule" defaultValue={employee.matricule ?? ""} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">E-mail</span>
            <input type="email" name="email" defaultValue={employee.email ?? ""} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Téléphone</span>
            <input name="telephone" defaultValue={employee.telephone ?? ""} className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Genre</span>
            <select name="genre" defaultValue={employee.genre ?? ""} className={fieldClass}>
              <option value="">—</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Statut</span>
            <select name="statut" defaultValue={employee.statut} className={fieldClass}>
              <option value="actif">Actif</option>
              <option value="essai">Essai</option>
              <option value="suspendu">Suspendu</option>
              <option value="inactif">Inactif</option>
              <option value="parti">Parti</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Département</span>
            <select
              name="departement_id"
              defaultValue={employee.departement_id ?? ""}
              className={fieldClass}
            >
              <option value="">—</option>
              {deptList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nom}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Poste</span>
            <select name="poste_id" defaultValue={employee.poste_id ?? ""} className={fieldClass}>
              <option value="">—</option>
              {posteList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titre}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date d&apos;embauche</span>
            <input
              type="date"
              name="date_embauche"
              defaultValue={employee.date_embauche ?? ""}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Type de contrat</span>
            <input
              name="type_contrat"
              defaultValue={employee.type_contrat ?? ""}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Province</span>
            <input name="province" defaultValue={employee.province ?? ""} className={fieldClass} />
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
