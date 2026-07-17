import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Histoires d’impact"
      description="Récits d’impact issus des interventions de l’AFD."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Notre impact",
            "href": "/impact"
      },
      {
            "label": "Histoires d’impact"
      }
]}
    />
  );
}
