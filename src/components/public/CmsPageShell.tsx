import { CmsSections } from "@/components/public/CmsSections";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import type { CmsPage } from "@/lib/queries/public/pages";

export function CmsPageShell({
  cms,
  breadcrumbs,
}: {
  cms: CmsPage;
  breadcrumbs: { label: string; href?: string }[];
}) {
  return (
    <PublicPageShell
      eyebrow={cms.surtitre || undefined}
      title={cms.titre}
      description={cms.resume || undefined}
      breadcrumbs={breadcrumbs}
    >
      <CmsSections sections={cms.sections} />
    </PublicPageShell>
  );
}
