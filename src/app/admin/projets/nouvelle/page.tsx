import { CreationModeChooser } from "@/features/content-import/components/CreationModeChooser";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleProjetPage() {
  await requirePermission("projets:write");

  return (
    <CreationModeChooser
      entityType="projet"
      title="Nouveau projet"
      description="Créez un projet en important un rapport (recommandé) ou via le formulaire manuel."
      importHref="/admin/projets/nouvelle/import"
      manualHref="/admin/projets/nouvelle/manuelle"
    />
  );
}
