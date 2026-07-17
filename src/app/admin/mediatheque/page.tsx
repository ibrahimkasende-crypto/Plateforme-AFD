import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Médiathèque"
      description="Gestion des médias."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Médiathèque" },
      ]}
      eyebrow="Administration"
    />
  );
}
