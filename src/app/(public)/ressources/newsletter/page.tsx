import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Newsletter"
      description="Inscription et informations sur la newsletter AFD."
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
            "label": "Newsletter"
      }
]}
    />
  );
}
