import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/module/admin-page-header";
import { createRecrutementAction } from "@/features/hr/actions/manage-hr-modules";
import { requirePermission } from "@/lib/auth/require-permission";
import { createClientSafe } from "@/lib/supabase/safe";

const fieldClass = "w-full rounded border p-2 text-sm";

export default async function AdminRhRecrutementNouveauPage() {
  await requirePermission("hr.manage_recruitment");
  const supabase = await createClientSafe();

  const [{ data: departements }, { data: postes }] = supabase
    ? await Promise.all([
        supabase.from("hr_departements" as never).select("id, nom").eq("actif", true).order("nom"),
        supabase.from("hr_postes" as never).select("id, titre").eq("actif", true).order("titre"),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <AdminPageHeader
        title="Nouvelle offre"
        description="Créer une campagne de recrutement."
        actions={
          <Link href="/admin/rh/recrutement" className="rounded border px-4 py-2 text-sm">
            Retour
          </Link>
        }
      />

      <form action={createRecrutementAction} className="space-y-4 rounded border bg-white p-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Titre *</span>
          <input required name="titre" className={fieldClass} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Description</span>
          <textarea name="description" rows={4} className={fieldClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Département</span>
            <select name="departement_id" className={fieldClass} defaultValue="">
              <option value="">—</option>
              {(departements ?? []).map((d: { id: string; nom: string }) => (
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
              {(postes ?? []).map((p: { id: string; titre: string }) => (
                <option key={p.id} value={p.id}>
                  {p.titre}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date limite</span>
            <input type="date" name="date_limite" className={fieldClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Statut</span>
            <select name="statut" className={fieldClass} defaultValue="ouvert">
              <option value="brouillon">Brouillon</option>
              <option value="ouvert">Ouvert</option>
            </select>
          </label>
        </div>
        <button type="submit" className="rounded bg-[var(--afd-blue)] px-4 py-2 text-white">
          Publier l&apos;offre
        </button>
      </form>
    </main>
  );
}
