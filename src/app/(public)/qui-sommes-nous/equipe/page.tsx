import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Équipe"
      description="Les équipes et profils de l’AFD."
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
            "label": "Équipe"
      }
]}
    />
  );
}
