import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Politique de confidentialité"
      description="Traitement des données personnelles."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Politique de confidentialité"
      }
]}
    />
  );
}
