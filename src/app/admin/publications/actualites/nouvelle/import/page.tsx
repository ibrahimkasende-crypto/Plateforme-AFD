import { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function ImportActualitePage() {
  await requirePermission("actualites:write");
  return (
    <ContentImportWizard
      entityType="actualite"
      cancelHref="/admin/publications/actualites/nouvelle"
    />
  );
}
