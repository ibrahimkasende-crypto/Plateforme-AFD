import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Zones d’intervention"
      description="Territoires d’intervention."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Zones d’intervention" },
      ]}
      eyebrow="Administration"
    />
  );
}
