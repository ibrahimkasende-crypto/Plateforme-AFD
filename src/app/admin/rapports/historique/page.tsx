import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Historique des rapports"
      description="Rapports générés."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Historique des rapports" },
      ]}
      eyebrow="Administration"
    />
  );
}
