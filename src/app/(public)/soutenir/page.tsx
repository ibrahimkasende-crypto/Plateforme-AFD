import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Soutenir l’AFD"
      description="Soutenir les actions de l’AFD. Les paiements SerdiPay seront activés après configuration officielle."
      breadcrumbs={[
      {
            "label": "Accueil",
            "href": "/"
      },
      {
            "label": "Soutenir l’AFD"
      }
]}
    />
  );
}
