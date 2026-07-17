import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Témoignages"
      description="Témoignages liés aux actions de l’AFD."
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
            "label": "Témoignages"
      }
]}
    />
  );
}
