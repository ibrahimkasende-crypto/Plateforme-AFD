import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Paramètres"
      description="Paramètres du site."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Paramètres" },
      ]}
      eyebrow="Administration"
    />
  );
}
