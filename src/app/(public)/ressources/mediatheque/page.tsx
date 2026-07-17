import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Médiathèque"
      description="Galerie et ressources multimédias."
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
            "label": "Médiathèque"
      }
]}
    />
  );
}
