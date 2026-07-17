import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Opportunités"
      description="Opportunités de collaboration et recrutement."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Ressources",
            "href": "/ressources"
      },
      {
            "label": "Opportunités"
      }
]}
    />
  );
}
