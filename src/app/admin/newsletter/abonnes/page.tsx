import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Abonnés newsletter"
      description="Liste et segments des abonnés."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Abonnés newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
