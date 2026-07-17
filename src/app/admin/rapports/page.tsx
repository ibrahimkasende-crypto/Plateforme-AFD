import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Rapports"
      description="Génération et suivi des rapports."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Rapports" },
      ]}
      eyebrow="Administration"
    />
  );
}
