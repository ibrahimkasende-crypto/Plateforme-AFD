import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormGrid } from "@/components/admin/forms/admin-form-grid";
import { AdminFormHeader } from "@/components/admin/forms/admin-form-header";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminRequiredIndicator } from "@/components/admin/forms/admin-required-indicator";
import { ModernAdminForm } from "@/components/admin/forms/modern-admin-form";
import { saveRapport } from "@/features/rapports/actions/manage-rapport";
import { requirePermission } from "@/lib/auth/require-permission";

const fieldClass =
  "h-11 w-full rounded-lg border border-[var(--admin-border)] bg-white px-3 text-sm outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20";

export default async function AdminRapportsNouveauPage() {
  await requirePermission("rapports:write");

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-6">
      <AdminFormHeader
        title="Nouveau rapport"
        description="Générez un rapport d’activité, financier ou d’impact."
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Rapports", href: "/admin/rapports" },
          { label: "Nouveau" },
        ]}
      />
      <ModernAdminForm action={saveRapport}>
        <AdminFormSection title="Paramètres du rapport">
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">
              Titre
              <AdminRequiredIndicator />
            </span>
            <input required name="title" className={fieldClass} />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Type</span>
            <select name="type" className={fieldClass}>
              <option value="activite">Activité</option>
              <option value="financier">Financier</option>
              <option value="impact">Impact</option>
              <option value="partenaire">Partenaire</option>
            </select>
          </label>
          <AdminFormGrid>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Début période</span>
              <input type="date" name="period_start" className={fieldClass} />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Fin période</span>
              <input type="date" name="period_end" className={fieldClass} />
            </label>
          </AdminFormGrid>
        </AdminFormSection>
        <AdminFormFooter
          cancelHref="/admin/rapports/historique"
          submitLabel="Générer le rapport"
        />
      </ModernAdminForm>
    </main>
  );
}
