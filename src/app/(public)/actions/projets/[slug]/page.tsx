import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Détail du projet"
      description="Fiche détaillée d’un projet AFD."
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
            "label": "Projets",
            "href": "/actions/projets"
      },
      {
            "label": "Détail"
      }
]}
    />
  );
}
