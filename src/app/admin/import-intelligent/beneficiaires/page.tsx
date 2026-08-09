import { ImportTypePageShell } from "@/features/content-import/components/ImportTypePageShell";

export default function ImportBeneficiairesPage() {
  return (
    <ImportTypePageShell
      entityType="activite"
      permission="activites:write"
      title="Import — liste de bénéficiaires"
      hint="Excel/CSV recommandés via OCR natif. Vérifiez les doublons dans l’aperçu avant validation."
    />
  );
}
