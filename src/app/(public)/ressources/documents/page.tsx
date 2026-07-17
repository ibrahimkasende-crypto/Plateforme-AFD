import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Documents"
      description="Documents institutionnels téléchargeables."
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
            "label": "Documents"
      }
]}
    />
  );
}
