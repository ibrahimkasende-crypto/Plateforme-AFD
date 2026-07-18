import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Nouvelle activité"
      description="Création d’une activité terrain reliée au module Activités."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Activités", href: "/admin/activites" },
        { label: "Nouvelle" },
      ]}
      eyebrow="Administration"
    />
  );
}
