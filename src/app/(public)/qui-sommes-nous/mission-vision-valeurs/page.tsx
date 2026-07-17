import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Mission, vision et valeurs"
      description="Les fondements stratégiques de l’AFD."
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
            "label": "Mission, vision et valeurs"
      }
]}
    />
  );
}
