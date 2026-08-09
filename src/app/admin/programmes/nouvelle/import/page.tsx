import { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function ImportProgrammePage() {
  await requirePermission("programmes:write");
  return (
    <ContentImportWizard
      entityType="programme"
      cancelHref="/admin/programmes/nouvelle"
    />
  );
}
