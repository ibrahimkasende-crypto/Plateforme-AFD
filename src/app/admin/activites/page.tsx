import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Activités"
      description="Suivi des activités opérationnelles."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Activités" },
      ]}
      eyebrow="Administration"
    />
  );
}
