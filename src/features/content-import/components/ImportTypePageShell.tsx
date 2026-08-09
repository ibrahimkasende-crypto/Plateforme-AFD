import { ContentImportWizard } from "@/features/content-import/components/ContentImportWizard";
import type { ContentEntityType } from "@/features/content-import/types";
import { requirePermission } from "@/lib/auth/require-permission";

type Props = {
  entityType: ContentEntityType;
  permission?: Parameters<typeof requirePermission>[0];
  title: string;
  hint: string;
};

export async function ImportTypePageShell({
  entityType,
  permission = "ocr.upload",
  title,
  hint,
}: Props) {
  await requirePermission(permission);
  return (
    <div className="space-y-2">
      <div className="border-b border-slate-100 px-6 pt-6">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 pb-4 text-sm text-slate-600">{hint}</p>
      </div>
      <ContentImportWizard
        entityType={entityType}
        cancelHref="/admin/import-intelligent"
      />
    </div>
  );
}
