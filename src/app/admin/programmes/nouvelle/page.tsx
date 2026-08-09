import { CreationModeChooser } from "@/features/content-import/components/CreationModeChooser";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleProgrammePage() {
  await requirePermission("programmes:write");

  return (
    <CreationModeChooser
      entityType="programme"
      title="Nouveau programme"
      description="Importez une fiche programme ou créez manuellement."
      importHref="/admin/programmes/nouvelle/import"
      manualHref="/admin/programmes/nouvelle/manuelle"
    />
  );
}
