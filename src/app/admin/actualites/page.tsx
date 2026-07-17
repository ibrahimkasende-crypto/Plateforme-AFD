import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Actualités"
      description="Gestion éditoriale des actualités."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Actualités" },
      ]}
      eyebrow="Administration"
    />
  );
}
