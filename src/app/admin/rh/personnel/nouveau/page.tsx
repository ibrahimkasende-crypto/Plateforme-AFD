import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { createEmployeeAction } from "@/features/hr/actions/manage-employee";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

type RefRow = { id: string; nom?: string; titre?: string };

export default async function AdminRhPersonnelNouveauPage() {
  await requirePermission("hr.manage_employees");
  const supabase = await createClientSafe();

  const [{ data: departements }, { data: postes }] = supabase
    ? await Promise.all([
        supabase
          .from("hr_departements" as never)
          .select("id, nom")
          .eq("actif", true)
          .order("nom"),
        supabase
          .from("hr_postes" as never)
          .select("id, titre")
          .eq("actif", true)
          .order("titre"),
      ])
    : [{ data: [] }, { data: [] }];

  const deptList = (departements ?? []) as RefRow[];
  const posteList = (postes ?? []) as RefRow[];

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Nouvel employé"
        description="Créer un dossier personnel."
        actions={
          <Link href="/admin/rh/personnel" className="rounded border px-4 py-2 text-sm">
            Retour
          </Link>
        }
      />

      <form action={createEmployeeAction} className="space-y-4 rounded border bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Prénom *</span>
            <input required name="prenom" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Nom *</span>
            <input required name="nom" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Postnom</span>
            <input name="postnom" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Matricule</span>
            <input name="matricule" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">E-mail</span>
            <input type="email" name="email" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Téléphone</span>
            <input name="telephone" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Département</span>
            <select name="departement_id" className={fieldClass} defaultValue="">
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
            <select name="poste_id" className={fieldClass} defaultValue="">
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
            <input type="date" name="date_embauche" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Type de contrat</span>
            <select name="type_contrat" className={fieldClass} defaultValue="cdd">
              <option value="cdd">CDD</option>
              <option value="cdi">CDI</option>
              <option value="stage">Stage</option>
              <option value="consultant">Consultant</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span className="font-medium">Province</span>
            <input name="province" className={fieldClass} />
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Créer l&apos;employé
        </button>
      </form>
    </main>
  );
}
