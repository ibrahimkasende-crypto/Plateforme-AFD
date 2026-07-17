import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Résultats"
      description="Les résultats et indicateurs consolidés."
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
            "label": "Résultats"
      }
]}
    />
  );
}
