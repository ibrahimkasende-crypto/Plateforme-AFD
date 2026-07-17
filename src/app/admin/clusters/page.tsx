import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Clusters"
      description="Clusters et groupes de travail."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Clusters" },
      ]}
      eyebrow="Administration"
    />
  );
}
