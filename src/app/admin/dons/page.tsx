import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Dons"
      description="Vue d’ensemble des dons."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Dons" },
      ]}
      eyebrow="Administration"
    />
  );
}
