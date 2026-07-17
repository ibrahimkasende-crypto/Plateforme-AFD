import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Intentions de dons"
      description="Intentions de don enregistrées."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Intentions de dons" },
      ]}
      eyebrow="Administration"
    />
  );
}
