import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Statistiques newsletter"
      description="Indicateurs d’engagement."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Statistiques newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
