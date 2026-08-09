import { CreationModeChooser } from "@/features/content-import/components/CreationModeChooser";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function NouvelleActualitePage() {
  await requirePermission("actualites:write");

  return (
    <CreationModeChooser
      entityType="actualite"
      title="Nouvelle actualité"
      description="Importez un communiqué ou un article, ou rédigez manuellement."
      importHref="/admin/publications/actualites/nouvelle/import"
      manualHref="/admin/publications/actualites/nouvelle/manuelle"
    />
  );
}
