import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Programmes"
      description="Les programmes institutionnels de l’AFD."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Nos actions",
            "href": "/actions"
      },
      {
            "label": "Programmes"
      }
]}
    />
  );
}
