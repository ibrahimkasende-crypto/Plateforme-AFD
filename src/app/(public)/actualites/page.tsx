import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Actualités"
      description="Les actualités institutionnelles de l’AFD."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Actualités"
      }
]}
    />
  );
}
