import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Rapports et publications"
      description="Rapports institutionnels et publications."
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
            "label": "Rapports"
      }
]}
    />
  );
}
