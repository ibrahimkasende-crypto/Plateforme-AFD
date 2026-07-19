import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormGrid } from "@/components/admin/forms/admin-form-grid";
import { AdminFormHeader } from "@/components/admin/forms/admin-form-header";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminRequiredIndicator } from "@/components/admin/forms/admin-required-indicator";
import { ModernAdminForm } from "@/components/admin/forms/modern-admin-form";
import { saveProjet } from "@/features/projets/actions/manage-projet";
import { requirePermission } from "@/lib/auth/require-permission";
import { getProgrammeOptions } from "@/lib/queries/admin/programmes";

const fieldClass =
  "h-11 w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20";

export default async function NouvelleProjetPage() {
  await requirePermission("projets:write");
  const programmes = await getProgrammeOptions();

  return (
    <main className="mx-auto max-w-4xl space-y-5 p-6">
      <AdminFormHeader
        title="Nouveau projet"
        description="Documentez une intervention terrain rattachée à un programme AFD."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Projets", href: "/admin/projets" },
          { label: "Nouveau" },
        ]}
      />

      <ModernAdminForm action={saveProjet}>
        <AdminFormSection
          title="Informations générales"
          description="Titre, programme et description du projet."
        >
          <AdminFormGrid>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">
                Titre
                <AdminRequiredIndicator />
              </span>
              <input required name="title" className={fieldClass} />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Slug</span>
              <input name="slug" placeholder="mon-projet" className={fieldClass} />
            </label>
          </AdminFormGrid>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Programme</span>
            <select name="program_id" className={fieldClass}>
              <option value="">— Aucun —</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">
              Description
              <AdminRequiredIndicator />
            </span>
            <textarea
              required
              name="description"
              className="min-h-32 w-full rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20"
            />
          </label>
        </AdminFormSection>

        <AdminFormSection
          title="Localisation et calendrier"
          description="Province, statut et dates d’exécution."
        >
          <AdminFormGrid>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">
                Localisation
                <AdminRequiredIndicator />
              </span>
              <input required name="location" className={fieldClass} />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Statut</span>
              <select name="status" defaultValue="en_cours" className={fieldClass}>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="futur">Futur</option>
              </select>
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">
                Date de début
                <AdminRequiredIndicator />
              </span>
              <input required name="start_date" type="date" className={fieldClass} />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Date de fin</span>
              <input name="end_date" type="date" className={fieldClass} />
            </label>
          </AdminFormGrid>
        </AdminFormSection>

        <AdminFormSection title="Impact et budget">
          <AdminFormGrid>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Budget</span>
              <input
                name="budget"
                type="number"
                min={0}
                step="0.01"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Bénéficiaires</span>
              <input name="beneficiaries" type="number" min={0} className={fieldClass} />
            </label>
          </AdminFormGrid>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Résultats</span>
            <textarea
              name="results"
              className="min-h-24 w-full rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">URL image</span>
            <input name="image_url" className={fieldClass} />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input name="active" type="checkbox" defaultChecked />
            Projet actif
          </label>
        </AdminFormSection>

        <AdminFormFooter
          cancelHref="/admin/projets"
          submitLabel="Enregistrer le projet"
        />
      </ModernAdminForm>
    </main>
  );
}
