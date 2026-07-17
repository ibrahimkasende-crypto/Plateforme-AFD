import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Campagnes newsletter"
      description="Création et suivi des campagnes."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Campagnes newsletter" },
      ]}
      eyebrow="Administration"
    />
  );
}
