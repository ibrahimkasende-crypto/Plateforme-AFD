import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Politiques et engagements"
      description="Les politiques institutionnelles et engagements de l’AFD."
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
            "label": "Politiques et engagements"
      }
]}
    />
  );
}
