import { PublicationModuleShell } from "@/components/admin/publications/publication-module-shell";
import { EventArchiveForm } from "@/features/event-archives/components/event-archive-form";
import { requirePermission } from "@/lib/auth/require-permission";
import { getPublishedInterventionDomains } from "@/lib/queries/public/intervention-domains";

export default async function NouvelleArchivePage() {
  await requirePermission("archives:write");
  const domains = await getPublishedInterventionDomains();

  return (
    <PublicationModuleShell
      title="Nouvelle archive terrain"
      description="Créez un événement documenté avec images, date, heure, lieu exact et rattachement au domaine d’intervention."
    >
      <EventArchiveForm domains={domains} />
    </PublicationModuleShell>
  );
}
