import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Réponses d’urgence"
      description="Les interventions d’urgence de l’AFD."
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
            "label": "Réponses d’urgence"
      }
]}
    />
  );
}
