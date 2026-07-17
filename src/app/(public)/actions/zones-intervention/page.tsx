import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Zones d’intervention"
      description="Les territoires d’intervention de l’AFD."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Nos actions",
            "href": "/actions"
      },
      {
            "label": "Zones d’intervention"
      }
]}
    />
  );
}
