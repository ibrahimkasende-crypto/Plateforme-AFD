import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Détail du programme"
      description="Fiche détaillée d’un programme AFD."
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
            "label": "Programmes",
            "href": "/actions/programmes"
      },
      {
            "label": "Détail"
      }
]}
    />
  );
}
