import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Départements"
      description="Structure organisationnelle."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Départements" },
      ]}
      eyebrow="Administration"
    />
  );
}
