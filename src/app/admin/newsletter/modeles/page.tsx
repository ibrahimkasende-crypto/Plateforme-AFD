import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Modèles newsletter"
      description="Modèles d’emails."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Modèles newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
