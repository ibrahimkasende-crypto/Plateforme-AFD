import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Actualité"
      description="Détail d’une actualité."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Actualités",
            "href": "/actualites"
      },
      {
            "label": "Détail"
      }
]}
    />
  );
}
