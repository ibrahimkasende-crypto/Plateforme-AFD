import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Modèles de rapports"
      description="Bibliothèque de modèles."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Modèles de rapports" },
      ]}
      eyebrow="Administration"
    />
  );
}
