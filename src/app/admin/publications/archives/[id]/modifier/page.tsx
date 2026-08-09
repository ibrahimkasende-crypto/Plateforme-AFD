import { notFound } from "next/navigation";
import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { EventArchiveForm } from "@/features/event-archives/components/event-archive-form";
import { requirePermission } from "@/lib/auth/require-permission";
import { getAdminEventArchive } from "@/lib/queries/admin/event-archives";
import { getPublishedInterventionDomains } from "@/lib/queries/public/intervention-domains";

type PageProps = { params: Promise<{ id: string }> };

export default async function ModifierArchivePage({ params }: PageProps) {
  await requirePermission("archives:write");
  const { id } = await params;
  const [item, domains] = await Promise.all([
    getAdminEventArchive(id),
    getPublishedInterventionDomains(),
  ]);

  if (!item) notFound();

  return (
    <PublicationModuleShell
      title="Modifier l’archive terrain"
      description="Mettez à jour les preuves, le lieu, les dates et la publication de cette activité."
    >
      <EventArchiveForm domains={domains} item={item} />
    </PublicationModuleShell>
  );
}
