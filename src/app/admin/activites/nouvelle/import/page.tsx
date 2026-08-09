import { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function ImportActivitePage() {
  await requirePermission("activites:write");
  return (
    <ContentImportWizard
      entityType="activite"
      cancelHref="/admin/activites/nouvelle"
    />
  );
}
