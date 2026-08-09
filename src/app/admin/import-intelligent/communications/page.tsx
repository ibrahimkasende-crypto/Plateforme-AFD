import { ImportTypePageShell } from "@/features/content-import/components/ImportTypePageShell";

export default function ImportCommunicationsPage() {
  return (
    <ImportTypePageShell
      entityType="actualite"
      permission="actualites:write"
      title="Import — communication"
      hint="Word, PDF ou TXT : actualité / communiqué en brouillon ou publication après validation."
    />
  );
}
