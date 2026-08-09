import { CreationModeChooser } from "@/features/content-import/components/CreationModeChooser";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleActivitePage() {
  await requirePermission("activites:write");

  return (
    <CreationModeChooser
      entityType="activite"
      title="Nouvelle activité"
      description="Importez un rapport d’activité (recommandé) ou saisissez manuellement."
      importHref="/admin/activites/nouvelle/import"
      manualHref="/admin/activites/nouvelle/manuelle"
    />
  );
}
