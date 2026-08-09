import { ImportTypePageShell } from "@/features/content-import/components/ImportTypePageShell";

export default function ImportMissionsPage() {
  return (
    <ImportTypePageShell
      entityType="activite"
      permission="activites:write"
      title="Import — rapport de mission"
      hint="Déposez un PDF, Word ou image. Validez l’aperçu avant création d’activités / mission."
    />
  );
}
