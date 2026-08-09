import { ImportTypePageShell } from "@/features/content-import/components/ImportTypePageShell";

export default function ImportPhotosPage() {
  return (
    <ImportTypePageShell
      entityType="bibliotheque"
      permission="ocr.upload"
      title="Import — dossier photos"
      hint="Images JPG/PNG/WebP. Après validation, créez l’album depuis la bibliothèque si besoin."
    />
  );
}
