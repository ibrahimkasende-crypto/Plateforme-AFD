import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Notre impact"
      description="Chiffres clés et résultats de l’AFD — contenus en cours de structuration."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Notre impact"
      }
]}
    />
  );
}
