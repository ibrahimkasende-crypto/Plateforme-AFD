import { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function ImportProjetPage() {
  await requirePermission("projets:write");
  return (
    <ContentImportWizard
      entityType="projet"
      cancelHref="/admin/projets/nouvelle"
    />
  );
}
