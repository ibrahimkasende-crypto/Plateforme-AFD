import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Appels d’offres"
      description="Appels d’offres et consultations."
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
            "label": "Appels d’offres"
      }
]}
    />
  );
}
