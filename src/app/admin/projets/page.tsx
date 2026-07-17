import { ModulePlaceholder } from "@/components/shared/ModulePlaceholder";

export default function Page() {
  return (
    <ModulePlaceholder
      title="Projets"
      description="Gestion des projets."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Projets" },
      ]}
      eyebrow="Administration"
    />
  );
}
