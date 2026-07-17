import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Remboursements"
      description="Suivi des remboursements."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Remboursements" },
      ]}
      eyebrow="Administration"
    />
  );
}
