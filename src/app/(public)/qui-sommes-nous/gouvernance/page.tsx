import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Gouvernance"
      description="Les instances de direction et de contrôle de l’AFD."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Qui sommes-nous",
            "href": "/qui-sommes-nous"
      },
      {
            "label": "Gouvernance"
      }
]}
    />
  );
}
