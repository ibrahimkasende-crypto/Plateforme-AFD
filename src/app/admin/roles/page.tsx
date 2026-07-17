import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Rôles et permissions"
      description="Administration des rôles."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Rôles et permissions" },
      ]}
      eyebrow="Administration"
    />
  );
}
