import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Organigramme"
      description="La structure organisationnelle de l’AFD."
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
            "label": "Organigramme"
      }
]}
    />
  );
}
