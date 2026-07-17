import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Histoire d’impact"
      description="Détail d’une histoire d’impact."
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
            "label": "Histoires",
            "href": "/impact/histoires"
      },
      {
            "label": "Détail"
      }
]}
    />
  );
}
