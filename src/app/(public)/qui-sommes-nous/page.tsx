import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Présentation de l’AFD"
      description="Découvrez l’Alliance des Femmes pour le Développement, son identité institutionnelle et son ancrage en RDC."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Qui sommes-nous"
      }
]}
    />
  );
}
